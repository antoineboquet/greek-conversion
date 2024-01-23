import { keyType } from './enums';
import { IConversionOptions } from './interfaces';
import { Mapping, ROUGH_BREATHING, SMOOTH_BREATHING } from './Mapping';
import {
  applyGreekVariants,
  applyUppercaseChars,
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace
} from './utils';

export function toGreek(
  str: string,
  from: keyType,
  options: IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const mapping = declaredMapping ?? new Mapping(options);

  switch (from) {
    case keyType.BETA_CODE:
      if (options.removeDiacritics)
        str = removeDiacritics(str, keyType.BETA_CODE);
      str = mapping.apply(str, keyType.BETA_CODE, keyType.GREEK, options);
      break;

    case keyType.GREEK:
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.GREEK);
      str = mapping.apply(str, keyType.TRANSLITERATION, keyType.GREEK, options);
      break;

    case keyType.TRANSLITERATION:
      str = mapping.apply(str, keyType.TRANSLITERATION, keyType.GREEK, options);

      str = applyUppercaseChars(str);

      if (options.removeDiacritics) {
        str = removeDiacritics(str, keyType.TRANSLITERATION);
        str = str.replace(/h/gi, '');
      } else {
        str = convertTransliteratedBreathings(str);
      }

      str = normalizeGreek(str);
      break;
  }

  str = applyGreekVariants(str, options.setGreekStyle?.disableBetaVariant);
  if (!options.preserveWhitespace) str = removeExtraWhitespace(str);

  return str;
}

// @FIXME: take care of diaeresis, diphthongs and so on.
function convertTransliteratedBreathings(str: string): string {
  const grVowels = 'αεηιοωυ';

  str = str.normalize('NFD');

  const re = new RegExp(
    `(?<=\\p{P}|\\s|^)(?<trRoughBreathing>h)?(?<vowelsGroup>[${grVowels}]{1,2})`,
    'gimu'
  );

  str = str.replace(re, (match, trRoughBreathing, vowelsGroup) => {
    const breathing = trRoughBreathing ? ROUGH_BREATHING : SMOOTH_BREATHING;
    return vowelsGroup + breathing;
  });

  // Apply rough breathings on rhos (excluding double rhos).
  str = str.replace(new RegExp(`(?<!ρ)(ρ)h`, 'gi'), `$1${ROUGH_BREATHING}`);

  // Remove remaining flagged rough breathings (e.g. on double rhos).
  str = str.replace(new RegExp('h', 'gi'), '');

  return str.normalize('NFC');
}
