import { AdditionalChar, Coronis, KeyType, Preset } from './enums';
import {
  IConversionOptions,
  IGreekStyle,
  IInternalConversionOptions,
  ITransliterationStyle,
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
  SMALL_LUNATE_SIGMA,
  SMOOTH_BREATHING
} from './Mapping';
import { applyPreset } from './presets';

export const notImplemented = (subject: string, value: string): never => {
  throw new RangeError(`${subject} '${value}' is not implemented.`);
};

/**
 * Returns a string with the right representation of gamma nasals.
 *
 * @privateRemarks
 * Transliteration: letter 'k' covers the case of `xi_ks`/`chi_kh` options.
 */
export const applyGammaNasals = (
  str: string,
  type: KeyType,
  gammaNasal_n?: ITransliterationStyle['gammaNasal_n']
): string => {
  const reReturn = (l: string, $1: string, $2: string): string =>
    ($1.toUpperCase() === $1 ? l.toUpperCase() : l) + $2;

  switch (type) {
    case KeyType.GREEK:
      return str.replace(/(ν)([γκξχ])/gi, (m, $1, $2) => reReturn('γ', $1, $2));

    case KeyType.TRANSLITERATION:
      if (gammaNasal_n === Preset.ALA_LC) {
        return str
          .replace(/(?<!\p{P}|\s|^)(g)(k)(?!s|h|\p{P}|\s|$)/gimu, (m, $1, $2) =>
            reReturn('n', $1, $2)
          )
          .replace(/(g)(g|x|ks|ch|kh)/gi, (m, $1, $2) => reReturn('n', $1, $2));
      }

      if (gammaNasal_n) {
        return str.replace(/(g)(g|k|x|ch)/gi, (m, $1, $2) =>
          reReturn('n', $1, $2)
        );
      }

      return str.replace(/(n)(g|k|x|ch)/gi, (m, $1, $2) =>
        reReturn('g', $1, $2)
      );

    case KeyType.BETA_CODE:
      return str.replace(/(n)([gkcx])/gi, (m, $1, $2) => reReturn('g', $1, $2));
  }
};

export const applyGreekVariants = (
  greekStr: string,
  options?: IGreekStyle
): string => {
  // Apply beta variant (lowercase only).
  if (!options?.disableBetaVariant) {
    greekStr = greekStr
      .replace(new RegExp(GREEK_BETA_SYMBOL, 'g'), 'β')
      .replace(/(?<!\p{P}|\s|^)β/gmu, GREEK_BETA_SYMBOL);
  }

  // Replace sigma variants
  greekStr = options?.useLunateSigma
    ? greekStr.replace(/[Σσς]/g, (m) =>
        m === 'Σ' ? CAPITAL_LUNATE_SIGMA : SMALL_LUNATE_SIGMA
      )
    : greekStr.replace(/ς/g, 'σ').replace(/(σ)(?=\p{P}|\s|$)/gmu, 'ς');

  // Replace pi + sigma with psi.
  greekStr = greekStr.replace(/Π[Σσ]/g, 'Ψ').replace(/πσ/g, 'ψ');

  return greekStr;
};

/**
 * Takes a TLG beta code string and returns a beta code string following
 * the `greek-conversion` convention.
 */
export const fromTLG = (betaCodeStr: string): string => {
  return betaCodeStr
    .toLowerCase()
    .replace(
      /(\*)([()\\/+=|?]*)([a-z])/g,
      (m, $1, $2, $3) => $3.toUpperCase() + $2
    );
};

/**
 * Takes a beta code string following the `greek-conversion` convention
 * and returns a TLG beta code string.
 *
 * @remarks
 * The iota subscript must remain after its base letter.
 */
export const toTLG = (betaCodeStr: string): string => {
  return betaCodeStr
    .replace(/([a-z])([()\\/+=?]*)/gi, (m, $1, $2) =>
      $1.toUpperCase() === $1 ? '*' + $2 + $1 : m
    )
    .toUpperCase();
};

/**
 * Returns an `IInternalConversionOptions` from a (mixed) preset or
 * a plain `IConversionOptions` object submitted by an end user.
 */
export const handleOptions = (
  str: string,
  fromType: KeyType,
  settings: Preset | MixedPreset | IConversionOptions = {}
): IInternalConversionOptions => {
  // Convert named presets (= numeric enum) to `IConversionOptions` objects.
  if (typeof settings === 'number' || Array.isArray(settings)) {
    settings = applyPreset(settings);
  }

  let { greekStyle, transliterationStyle, additionalChars } = settings ?? {};

  // Determining the case of a TLG string involves converting it.
  if (fromType === KeyType.TLG_BETA_CODE) str = fromTLG(str);

  // Silently enable `AdditionalChar.LUNATE_SIGMA` if related options are enabled.
  if (greekStyle?.useLunateSigma || transliterationStyle?.lunatesigma_s) {
    if (!additionalChars) {
      settings.additionalChars = AdditionalChar.LUNATE_SIGMA;
    } else if (Array.isArray(additionalChars)) {
      if (!additionalChars.includes(AdditionalChar.LUNATE_SIGMA)) {
        settings.additionalChars = additionalChars.push(
          AdditionalChar.LUNATE_SIGMA
        );
      }
    } else if (additionalChars !== AdditionalChar.LUNATE_SIGMA) {
      settings.additionalChars = [
        additionalChars as AdditionalChar,
        AdditionalChar.LUNATE_SIGMA
      ];
    }
  }

  return {
    isUpperCase: isUpperCase(str, fromType),
    ...settings
  };
};

export const handleTLGInput = (str: string): [string, KeyType] => {
  return [fromTLG(str), KeyType.BETA_CODE];
};

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
export const isUpperCase = (str: string, type: KeyType): boolean => {
  return type === KeyType.BETA_CODE
    ? str.toUpperCase() === str && !/(?<!\*)#[1-35]/.test(str)
    : str.toUpperCase() === str;
};

/**
 * Returns a normalized beta code string.
 *
 * @remarks
 * (1) Ensure the right diacritics order (and remove duplicates).
 * (2) Sanitize the given string, removing all non beta code characters.
 *
 * @privateRemarks
 * The correct diacritics order seems to be: (1) breathings; (2) diaereses;
 * (3) accents; (4) iota subscript; (5) dot below.
 */
export const normalizeBetaCode = (
  betaCodeStr: string,
  options: IBetaCodeStyle
): string => {
  const order: string[] = [')', '(', '+', '/', '\\', '=', '|', '?'];

  betaCodeStr = betaCodeStr.replace(/([()\\/+=|?]{2,})/gi, (m, diacritics) => {
      // Converting to a `Set` prevents data duplication.
      return [...new Set(diacritics)]
        .sort((a: string, b: string) => order.indexOf(a) - order.indexOf(b))
        .join('');
  });

  if (options?.skipSanitization) return betaCodeStr;

  return betaCodeStr
    .normalize('NFD')
    .replace(/[^*a-z0-9$&^@{<{[\]%#\s()\\/+=|?.,:]/gi, '')
    .normalize();
};

/**
 * Returns a normalized greek string.
 *
 * @remarks
 * (1) Some characters must be applied in the canonically-decomposed form.
 * (2) Due to the poor Unicode canonical equivalences, any subsequent
 * normalization may break the replacements made by this function.
 */
export const normalizeGreek = (
  greekStr: string,
  options?: IGreekStyle
): string => {
  greekStr = greekStr
    .normalize('NFD')
    .replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE)
    .normalize()
    .replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA);

  if (!options?.useMonotonicOrthography) {
    // prettier-ignore
    const PRECOMPOSED_CHARS_WITH_TONOS_OXIA: string[][] = [
      ['ά', 'ά'], ['έ', 'έ'], ['ή', 'ή'], ['ί', 'ί'],
      ['ό', 'ό'], ['ύ', 'ύ'], ['ώ', 'ώ'], ['Ά', 'Ά'],
      ['Έ', 'Έ'], ['Ή', 'Ή'], ['Ί', 'Ί'], ['Ό', 'Ό'],
      ['Ύ', 'Ύ'], ['Ώ', 'Ώ'], ['ΐ', 'ΐ'], ['ΰ', 'ΰ']
    ];
    for (const ch of PRECOMPOSED_CHARS_WITH_TONOS_OXIA) {
      greekStr = greekStr.replace(new RegExp(`${ch[0]}`, 'g'), ch[1]);
    }
  } else {
    // Remove non-monotonic diacritics.
  }

  return options?.useGreekQuestionMark
    ? (greekStr = greekStr.replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK))
    : greekStr;
};

/**
 * Returns a normalized transliterated string.
 */
export const normalizeTransliteration = (
  transliteratedStr: string,
  options?: ITransliterationStyle,
  isUpperCase?: boolean
): string => {
  const { setCoronisStyle, beta_v } = options ?? {};
  const re = new RegExp(`(?<=\\S)${Coronis.APOSTROPHE}(?=\\S)`, 'g');

  // @fixme: check the logic behind this.
  if (setCoronisStyle === Coronis.APOSTROPHE) {
    transliteratedStr = transliteratedStr.replace(re, SMOOTH_BREATHING);
  }

  if (beta_v) {
    transliteratedStr = transliteratedStr.replace(/b/gi, (m) => {
      if (isUpperCase) return 'MP';
      else return m.toUpperCase() === m ? 'Mp' : 'mp';
    });
  }

  transliteratedStr = transliteratedStr.replace(/d̲/gi, (m) => {
    if (isUpperCase) return 'NT';
    else return m.toUpperCase() === m ? 'Nt' : 'nt';
  });

  return transliteratedStr
    .normalize('NFD')
    .replace(/Y/g, 'U')
    .replace(/y/g, 'u')
    .normalize();
};

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
export const removeDiacritics = (
  str: string,
  type: KeyType,
  trPreserveLetters?: string[],
  trUseCxOverMacron?: boolean
): string => {
  switch (type) {
    case KeyType.BETA_CODE:
      // Include the macron (%26) & the breve (%27).
      return str.replace(/[()\\/+=|?]|%26|%27/g, '');

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
      notImplemented('KeyType', type);
  }
};

export const removeGreekVariants = (
  greekStr: string,
  removeLunateSigma?: boolean
): string => {
  if (removeLunateSigma) {
    greekStr = greekStr
      .replace(new RegExp(CAPITAL_LUNATE_SIGMA, 'g'), 'Σ')
      .replace(new RegExp(SMALL_LUNATE_SIGMA, 'g'), 'ς');
  }

  return greekStr
    .replace(new RegExp(GREEK_BETA_SYMBOL, 'g'), 'β')
    .replace(/ς/g, 'σ');
};

export const removeExtraWhitespace = (str: string): string => {
  return str.replace(/(\s)+/g, '$1').trim();
};

export const sanitizeRegExpString = (str: string): string => {
  return str.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
};

/**
 * Returns a string with correctly positioned uppercase chars considering
 * that an initial uppercase `h` is going to be removed during a subsequent
 * conversion process.
 *
 * @remarks
 * This function expects a transliterated string or, at least, a string that
 * keeps its transliterated rough breathings.
 */
export const trApplyUppercaseChars = (transliteratedStr: string): string => {
  return transliteratedStr.replace(/(?<=\p{P}|\s|^)(\S*)/gmu, (word) => {
    return word.charAt(0) === 'H'
      ? word.charAt(0) + word.charAt(1).toUpperCase() + word.slice(2)
      : word;
  });
};
