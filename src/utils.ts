import { keyType } from './enums';
import {
  ANO_TELEIA,
  CIRCUMFLEX,
  GREEK_QUESTION_MARK,
  GREEK_TILDE,
  LATIN_TILDE,
  MACRON,
  MIDDLE_DOT
} from './Mapping';

export function applyGreekVariants(
  greekStr: string,
  disableBetaVariant?: boolean
): string {
  // Apply beta variant.
  if (!disableBetaVariant) {
    greekStr = greekStr
      .replace(/\u03D0/g, 'β')
      .replace(/(?<!\p{P}|\s|^)β/gmu, '\u03D0');
  }

  // Apply final sigma.
  greekStr = greekStr.replace(/ς/g, 'σ').replace(/(σ)(?=\p{P}|\s|$)/gmu, 'ς');

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
    .normalize('NFC')
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
 * @param trPreserveLettersWithCxOrMacron.diacritic - The diacritic
 * associated to these letters (default to the \u0304 macron)
 */
export function removeDiacritics(
  str: string,
  type: keyType,
  trPreserveLettersWithCxOrMacron?: {
    letters: string[];
    useCxOverMacron: boolean;
  }
): string {
  switch (type) {
    case keyType.BETA_CODE:
      return str.replace(/[\(\)\\\/\+=\|]/g, '');

    case keyType.GREEK:
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .normalize('NFC');

    case keyType.TRANSLITERATION:
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
          // Exclude the \u0302 circumflex from the range.
          str = str
            .replace(/[\u0300-\u0301-\u0303-\u036f]/g, '')
            .replace(rePreservedLetters, '');
        } else {
          // Exclude the \u0304 macron from the range.
          str = str
            .replace(/[\u0300-\u0303-\u0305-\u036f]/g, '')
            .replace(rePreservedLetters, '');
        }
      } else {
        str = str.replace(/[\u0300-\u036f]/g, '');
      }

      return str.normalize('NFC');

    default:
      console.warn(`keyType '${type}' is not implemented.`);
      return str;
  }
}

export function removeGreekVariants(str: string): string {
  return str.replace(/ϐ/g, 'β').replace(/ς/g, 'σ');
}

export function removeExtraWhitespace(str: string): string {
  return str.replace(/(\s)+/g, '$1').trim();
}

export function sanitizeRegExpString(str): string {
  return str.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
}
