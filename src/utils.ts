import { KeyType } from './enums';
import { IGreekStyle } from './interfaces';
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
export function normalizeGreek(greekStr: string): string {
  return greekStr
    .normalize('NFD')
    .replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE)
    .normalize()
    .replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA)
    .replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK);
}

/**
 * Returns a string without diacritics.
 *
 * @remarks
 * The set of diacritical signs depends of the greek string representation.
 *
 * @param str - The input string
 * @param type - The kind of representation associated to the input string
 * @param trPreserveLettersWithCxOrMacron - Transliteration only: preserve
 * some letters that are paired with a diacritic
 * @param trPreserveLettersWithCxOrMacron.letters - An array of letters
 * @param trPreserveLettersWithCxOrMacron.useCxOverMacron - The diacritic
 * associated to these letters (default to the \u0304 macron)
 */
export function removeDiacritics(
  str: string,
  type: KeyType,
  trPreserveLettersWithCxOrMacron?: {
    letters: string[];
    useCxOverMacron: boolean;
  }
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
      const { letters, useCxOverMacron } =
        trPreserveLettersWithCxOrMacron || {};

      str = str.normalize('NFD');

      if (letters?.length) {
        const cxOrMacron = useCxOverMacron ? CIRCUMFLEX : MACRON;
        const rePreservedLetters = new RegExp(
          `(?<![${letters.join('')}])(\\p{M}*?)${cxOrMacron}`,
          'gu'
        );

        if (useCxOverMacron) {
          // Exclude the circumflex [\u0302] from the range.
          str = str
            .replace(/[\u0300-\u0301-\u0303-\u036f]/g, '')
            .replace(rePreservedLetters, '');
        } else {
          // Exclude the macron [\u0304] from the range.
          str = str
            .replace(/[\u0300-\u0303-\u0305-\u036f]/g, '')
            .replace(rePreservedLetters, '');
        }
      } else {
        str = str.replace(/[\u0300-\u036f]/g, '');
      }

      return str.normalize();

    default:
      console.warn(`KeyType '${type}' is not implemented.`);
      return str;
  }
}

export function removeGreekVariants(greekStr: string): string {
  return greekStr
    .replace(new RegExp(GREEK_BETA_SYMBOL, 'g'), 'β')
    .replace(/ς/g, 'σ');
}

export function removeExtraWhitespace(str: string): string {
  return str.replace(/(\s)+/g, '$1').trim();
}

export function sanitizeRegExpString(str): string {
  return str.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
}
