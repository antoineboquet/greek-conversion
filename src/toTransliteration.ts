import { keyType } from './enums';
import { IConversionOptions } from './interfaces';
import { Mapping, ROUGH_BREATHING, SMOOTH_BREATHING } from './Mapping';
import {
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils';

export function toTransliteration(
  str: string,
  from: keyType,
  options: IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const mapping = declaredMapping ?? new Mapping(options);

  switch (from) {
    case keyType.BETA_CODE:
      str = flagRoughBreathings(str);

      if (options.removeDiacritics) {
        str = removeDiacritics(str, keyType.BETA_CODE);
      }

      str = mapping.apply(
        str,
        keyType.BETA_CODE,
        keyType.TRANSLITERATION,
        options
      );

      // Apply flagged rough breathings.
      str = str.replace(/\$\$/g, 'H').replace(/\$/g, 'h');
      break;

    case keyType.GREEK:
      str = convertGreekBreathings(str);
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.GREEK);
      str = removeGreekVariants(str);
      str = normalizeGreek(str);
      str = mapping.apply(str, keyType.GREEK, keyType.TRANSLITERATION, options);
      break;

    case keyType.TRANSLITERATION:
      if (options.removeDiacritics) {
        str = removeDiacritics(str, keyType.TRANSLITERATION);
      }

      str = mapping.apply(
        str,
        keyType.TRANSLITERATION,
        keyType.TRANSLITERATION,
        options
      );
      break;
  }

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str);

  return str;
}

// @FIXME: take care of diaeresis, diphthongs and so on.
function convertGreekBreathings(str: string): string {
  const grVowels = 'αεηιοωυ';

  str = str.normalize('NFD');

  str = str.replace(new RegExp(SMOOTH_BREATHING, 'g'), '');

  const re = new RegExp(
    `(?<vowelsGroup>[${grVowels}]{1,2})(?<grRoughBreathing>${ROUGH_BREATHING})`,
    'gi'
  );

  str = str.replace(re, (match, vowelsGroup) => {
    if (vowelsGroup === vowelsGroup.toLowerCase()) return 'h' + vowelsGroup;
    else return 'H' + vowelsGroup.toLowerCase();
  });

  // Apply rough breathings on double rhos.
  const reDoubleRho = new RegExp(
    `(ρ${SMOOTH_BREATHING}?ρ)${ROUGH_BREATHING}?`,
    'gi'
  );
  str = str.replace(reDoubleRho, '$1h');

  // Apply rough breathings on single rhos.
  const reRho = new RegExp(`(ρ)${ROUGH_BREATHING}`, 'gi');
  str = str.replace(reRho, '$1h');

  return str.normalize('NFC');
}

/*
 * Rough breathings are ambiguous as `h` is transliterated to `η`.
 * This function transforms rough breathings to unambiguous flags
 * (`$` = `h`, `$$` = `H`) that need to be transliterated in
 * fromBetaCodeToTransliteration().
 */
function flagRoughBreathings(str: string): string {
  return str.replace(/([aehiowur]+)\(/gi, (match, group) => {
    if (match.toLowerCase() === 'r(') return group + '$';
    else if (group === group.toLowerCase()) return '$' + group;
    else return '$$' + group.toLowerCase();
  });
}
