import { KeyType, Preset } from './enums';
import {
  IConversionOptions,
  IGreekStyle,
  IInternalConversionOptions,
  MixedPreset
} from './interfaces';
import {
  ANO_TELEIA,
  CAPITAL_LUNATE_SIGMA,
  CIRCUMFLEX,
  GREEK_BETA_SYMBOL,
  GREEK_QUESTION_MARK,
  GREEK_TILDE,
  LATIN_TILDE,
  MACRON,
  MIDDLE_DOT,
  SMALL_LUNATE_SIGMA
} from './Mapping';
import { applyPreset } from './presets';

export function applyGreekVariants(
  greekStr: string,
  options?: IGreekStyle
): string {
  // Apply beta variant (lowercase only).
  if (!options?.disableBetaVariant) {
    greekStr = greekStr
      .replace(new RegExp(GREEK_BETA_SYMBOL, 'g'), 'β')
      .replace(/(?<!\p{P}|\s|^)β/gmu, GREEK_BETA_SYMBOL);
  }

  if (options?.useLunateSigma) {
    // Apply lunate sigma.
    greekStr = greekStr
      .replace(/Σ/g, CAPITAL_LUNATE_SIGMA)
      .replace(/[σς]/g, SMALL_LUNATE_SIGMA);
  } else {
    // Apply final sigma (lowercase only).
    greekStr = greekStr.replace(/ς/g, 'σ').replace(/(σ)(?=\p{P}|\s|$)/gmu, 'ς');
  }

  // Replace pi + sigma with psi.
  greekStr = greekStr.replace(/Π[Σσ]/g, 'Ψ').replace(/πσ/g, 'ψ');

  return greekStr;
}

/**
 * Returns a string with correctly positioned uppercase chars considering
 * that an initial uppercase `h` is going to be removed during a subsequent
 * conversion process.
 *
 * @remarks
 * This function expects a transliterated string or, at least, a string that
 * keeps its transliterated rough breathings.
 */
export function applyUppercaseChars(transliteratedStr: string): string {
  return transliteratedStr.replace(/(?<=\p{P}|\s|^)(\S*)/gmu, (word) => {
    if (word.charAt(0) === 'H') {
      word = word.charAt(0) + word.charAt(1).toUpperCase() + word.slice(2);
    }

    return word;
  });
}

/**
 * Takes a TLG beta code string and returns a beta code string following
 * the `greek-conversion` convention.
 */
export function fromTLG(betaCodeStr: string): string {
  return betaCodeStr
    .toLowerCase()
    .replace(
      /(\*)([\(\)\\\/\+=\|\?]*)([a-z])/g,
      (m, $1, $2, $3) => $3.toUpperCase() + $2
    );
}

/**
 * Takes a beta code string following the `greek-conversion` convention
 * and returns a TLG beta code string.
 *
 * @remarks
 * The iota subscript must remain after its base letter.
 */
export function toTLG(betaCodeStr: string): string {
  return betaCodeStr
    .replace(/([a-z])([\(\)\\\/\+=\?]*)/gi, (m, $1, $2) => {
      if ($1.toUpperCase() === $1) return '*' + $2 + $1;
      else return m;
    })
    .toUpperCase();
}

/**
 * Returns a beta code string with a correct diacritics order.
 *
 * @remarks
 * The correct order seems to be: (1) breathings; (2) diaereses; (3) accents;
 * (4) iota subscript; (5) dot below.
 */
export function bcReorderDiacritics(betaCodeStr: string): string {
  return betaCodeStr.replace(
    /([\(\)\\\/\+=\|\?]{2,})/gi,
    (match, diacritics) => {
      const order: string[] = [')', '(', '+', '/', '\\', '=', '|', '?'];
      return diacritics
        .split('')
        .sort((a: string, b: string) => order.indexOf(a) - order.indexOf(b))
        .join('');
    }
  );
}

/**
 * Returns an `IInternalConversionOptions` from a (mixed) preset or
 * a plain `IConversionOptions` object submitted by an end user.
 */
export function handleOptions(
  str: string,
  fromType: KeyType,
  settings: Preset | MixedPreset | IConversionOptions = {}
): IInternalConversionOptions {
  // Convert named presets (= numeric enum) to `IConversionOptions` objects.
  if (typeof settings === 'number' || Array.isArray(settings)) {
    settings = applyPreset(settings);
  }

  // Determining the case of a TLG string involves converting it.
  if (settings.setBetaCodeStyle?.useTLGStyle) str = fromTLG(str);

  return {
    isUpperCase: isUpperCase(str, fromType),
    ...settings
  };
}

/**
 * Returns a boolean that indicates if the given string is uppercase or not.
 *
 * @remarks
 * `Modern beta code`: if the string is written in beta code, uppercase
 * sequences may represent lowercase characters. This applies to some of the
 * TLG's `# – Additional Characters` section (characters beginning with a '#').
 *
 * @privateRemarks
 * (1) Given the current mapping implementation, the unusual lowercase
 * characters are the following: #1, #2, #3 & #5.
 * (2) When implementing the TLG beta code, the definition of a string
 * containing lowercase characters will be different.
 */
export function isUpperCase(str: string, type: KeyType): boolean {
  if (type === KeyType.BETA_CODE) {
    return str.toUpperCase() === str && !/(?<!\*)#[1-35]/.test(str);
  }
  return str.toUpperCase() === str;
}

/**
 * Returns a normalized greek string.
 *
 * @remarks
 * (1) Some characters must be applied in the canonically-decomposed form.
 * (2) Due to the poor Unicode canonical equivalences, any subsequent
 * normalization may break the replacements made by this function.
 */
export function normalizeGreek(
  greekStr: string,
  useGreekQuestionMark: boolean = false,
  skipUnicodeNormalization: boolean = false
): string {
  if (!skipUnicodeNormalization) greekStr = greekStr.normalize('NFD');

  greekStr = greekStr.replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE);

  if (!skipUnicodeNormalization) greekStr = greekStr.normalize();

  greekStr = greekStr.replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA);

  if (useGreekQuestionMark) {
    greekStr = greekStr.replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK);
  }

  return greekStr;
}

/**
 * Returns a string without diacritics.
 *
 * @remarks
 * The set of diacritical signs depends of the greek string representation.
 *
 * @param str - The input string
 * @param type - The kind of representation associated to the input string
 * @param trPreserveLetters - An array of letters paired with a diacritical
 * mark (see the next parameter) to preserve.
 * @param trUseCxOverMacron - The diacritical mark to match (defaults to
 * the macron [\u0304]).
 */
export function removeDiacritics(
  str: string,
  type: KeyType,
  trPreserveLetters?: string[],
  trUseCxOverMacron?: boolean
): string {
  switch (type) {
    case KeyType.BETA_CODE:
      // Include the macron (%26) & the breve (%27).
      return str.replace(/[\(\)\\\/\+=\|\?]|%26|%27/g, '');

    case KeyType.GREEK:
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .normalize();

    case KeyType.TRANSLITERATION:
      str = str.normalize('NFD');

      if (trPreserveLetters?.length) {
        const rePreservedLetters = new RegExp(`(?<![${trPreserveLetters.join('')}])(\\p{M}*?)${trUseCxOverMacron ? CIRCUMFLEX : MACRON}`, 'gu'); // prettier-ignore

        // Exclude circumflexes [\u0302] or macrons [\u0304] from the range.
        str = trUseCxOverMacron
          ? str.replace(/[\u0300-\u0301-\u0303-\u036f]/g, '')
          : str.replace(/[\u0300-\u0303-\u0305-\u036f]/g, '');

        str = str.replace(rePreservedLetters, '');
      } else {
        str = str.replace(/[\u0300-\u036f]/g, '');
      }

      return str.normalize();

    default:
      throw new RangeError(`KeyType '${type}' is not implemented.`);
  }
}

export function removeGreekVariants(
  greekStr: string,
  removeLunateSigma?: boolean
): string {
  if (removeLunateSigma) {
    greekStr = greekStr
      .replace(new RegExp(CAPITAL_LUNATE_SIGMA, 'g'), 'Σ')
      .replace(new RegExp(SMALL_LUNATE_SIGMA, 'g'), 'ς');
  }

  return greekStr
    .replace(new RegExp(GREEK_BETA_SYMBOL, 'g'), 'β')
    .replace(/ς/g, 'σ');
}

export function removeExtraWhitespace(str: string): string {
  return str.replace(/(\s)+/g, '$1').trim();
}

export function sanitizeRegExpString(str: string): string {
  return str.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
}
