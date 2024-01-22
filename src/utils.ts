import { keyType } from './enums';
import {
  ANO_TELEIA,
  GREEK_QUESTION_MARK,
  GREEK_TILDE,
  LATIN_TILDE,
  MIDDLE_DOT
} from './Mapping';

export function applyGreekVariants(
  str: string,
  disableBetaVariant?: boolean
): string {
  // Apply beta variant.
  if (!disableBetaVariant) {
    str = str.replace(/\u03D0/g, 'β');
    str = str.replace(/(?<!\p{P}|\s|^)β/gmu, '\u03D0');
  }

  // Apply final sigma.
  str = str.replace(/ς/g, 'σ').replace(/(σ)(?=\p{P}|\s|$)/gmu, 'ς');

  // Replace pi + sigma with psi.
  str = str.replace(/Π[Σσ]/g, 'Ψ').replace(/πσ/g, 'ψ');

  return str;
}

export function applyUppercaseChars(str: string): string {
  return str.replace(/(?<=\p{P}|\s|^)(\S*)/gmu, (word) => {
    if (word.charAt(0) === 'H') {
      word = word.charAt(0) + word.charAt(1).toUpperCase() + word.slice(2);
    }

    return word;
  });
}

/**
 * Normalizes the given greek string.
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
 * Returns the given string without diacritics.
 * *
 * @remarks
 * The set of diacritical signs depends of the greek string representation.
 */
export function removeDiacritics(str: string, type: keyType): string {
  switch (type) {
    case keyType.BETA_CODE:
      // Remove the following characters: `(`, `)`, `\`, `/`, `+`, `=`, `|`.
      str = str.replace(/[\(\)\\\/\+=\|]/g, '');
      break;

    case keyType.GREEK:
    case keyType.TRANSLITERATION:
      str = str.normalize('NFD');
      str = str.replace(/[\u0300-\u036f]/g, '');
      str = str.normalize('NFC');
      break;
  }

  return str;
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
