import { keyType } from './enums';
import {
  ANO_TELEIA,
  GREEK_QUESTION_MARK,
  GREEK_TILDE,
  LATIN_TILDE,
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
 */
export function removeDiacritics(str: string, type: keyType): string {
  switch (type) {
    case keyType.BETA_CODE:
      return str.replace(/[\(\)\\\/\+=\|]/g, '');

    case keyType.GREEK:
    case keyType.TRANSLITERATION:
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .normalize('NFC');

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
