import { keyType } from './enums';
import { IConversionOptions } from './interfaces';
import { Mapping } from './Mapping';
import {
  applyUppercaseChars,
  removeDiacritics,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils';

export function toBetaCode(
  str: string,
  from: keyType,
  options: IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const mapping = declaredMapping ?? new Mapping(options);

  switch (from) {
    case keyType.BETA_CODE:
      if (options.removeDiacritics) {
        str = removeDiacritics(str, keyType.BETA_CODE);
      }
      str = mapping.apply(str, keyType.BETA_CODE, keyType.BETA_CODE, options);
      break;

    case keyType.GREEK:
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.GREEK);
      str = removeGreekVariants(str);
      str = mapping.apply(str, keyType.GREEK, keyType.BETA_CODE, options);
      str = reorderDiacritics(str);
      break;

    case keyType.TRANSLITERATION:
      str = applyUppercaseChars(str);

      // Flag transliterated rough breathings.
      str = str.replace(/(?<=\p{P}|\s|^|r{1,2})h/gimu, '$');

      str = mapping.apply(
        str,
        keyType.TRANSLITERATION,
        keyType.BETA_CODE,
        options
      );

      if (options.removeDiacritics) {
        str = removeDiacritics(str, keyType.TRANSLITERATION);
        str = str.replace(/\$/gi, '');
      } else {
        str = convertTransliteratedBreathings(str, mapping, '\\$');
      }

      str = reorderDiacritics(str);
      break;
  }

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str);

  return str;
}

// @FIXME: take care of diaeresis, diphthongs and so on.
function convertTransliteratedBreathings(
  str: string,
  mapping: Mapping,
  escapedRoughBreathingMark: string
): string {
  const roughBreathing = mapping.DIACRITICS.ROUGH_BREATHING;
  const smoothBreathing = mapping.DIACRITICS.SMOOTH_BREATHING;
  const bcVowels = 'aehiowu';
  const bcDiacritics = '()\\/+=|';

  str = str.normalize('NFD');

  const re = new RegExp(
    `(?<=(?![${bcDiacritics}])\\p{P}|\\s|^)(?<trRoughBreathing>${escapedRoughBreathingMark})?(?<vowelsGroup>[${bcVowels}]{1,2})`,
    'gimu'
  );

  str = str.replace(re, (match, trRoughBreathing, vowelsGroup) => {
    const breathing = trRoughBreathing ? roughBreathing.bc : smoothBreathing.bc;
    return vowelsGroup + breathing;
  });

  // Apply rough breathings on rhos (excluding double rhos).
  str = str.replace(
    new RegExp(`(?<!r)(r)${escapedRoughBreathingMark}`, 'gi'),
    `$1${roughBreathing.bc}`
  );

  // Remove remaining flagged rough breathings (e.g. on double rhos).
  str = str.replace(new RegExp(`${escapedRoughBreathingMark}`, 'gi'), '');

  return str.normalize('NFC');
}

// @FIXME: reorder all diacritics combinations.
function reorderDiacritics(str: string): string {
  return str.replace(/(=)(\|)/g, '$2$1');
}
