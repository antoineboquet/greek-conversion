import { KeyType } from './enums';
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
  fromType: KeyType,
  options: IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const mapping = declaredMapping ?? new Mapping(options);

  switch (fromType) {
    case KeyType.BETA_CODE:
      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.BETA_CODE);
      }
      str = mapping.apply(str, KeyType.BETA_CODE, KeyType.GREEK);
      break;

    case KeyType.GREEK:
      if (options.removeDiacritics) str = removeDiacritics(str, KeyType.GREEK);
      str = mapping.apply(str, KeyType.TRANSLITERATION, KeyType.GREEK);
      break;

    case KeyType.TRANSLITERATION:
      str = applyUppercaseChars(str);
      str = mapping.apply(str, KeyType.TRANSLITERATION, KeyType.GREEK);

      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.TRANSLITERATION);
        str = str.replace(/h/gi, '');
      } else {
        str = trConvertBreathings(str);
      }

      str = normalizeGreek(str);
      break;
  }

  str = applyGreekVariants(str, options.setGreekStyle?.disableBetaVariant);
  if (options.removeExtraWhitespace) str = removeExtraWhitespace(str);

  return str;
}

/**
 * Returns a string with tranliterated greek breathings.
 *
 * @remarks
 * This function applies:
 *   1. initial breathings, taking care of diphthongs and diaeresis rules;
 *   2. rough breathing on single rhos (excluding double rhos).
 * Then it removes possibly remaining flagged rough breathings (such as
 * on double rhos).
 *
 * @privateRemarks
 * (1) Can't figure how to implement `reInitialBreathing` in order
 * to consistently find `firstV`, `firstD`, `nextV` & `nextD` values.
 * (2) Currently the regex captures the first vowels - including their
 * diacritics - of a word together. Notice that the `vowelGroups` can
 * match 2+ vowels.
 */
function trConvertBreathings(str: string): string {
  const diphthongs = ['αι', 'αυ', 'ει', 'ευ', 'ηυ', 'οι', 'ου', 'υι'];
  const vowels = 'αεηιουω';
  const reInitialBreathing = new RegExp(`(?<=\\p{P}|\\s|^)(?<trRough>h)?(?<vowelsGroup>[${vowels}\\p{M}]+)`, 'gimu'); // prettier-ignore

  return str
    .normalize('NFD')
    .replace(reInitialBreathing, (match, trRough, vowelsGroup) => {
      const breathing = trRough ? ROUGH_BREATHING : SMOOTH_BREATHING;

      vowelsGroup = vowelsGroup.normalize('NFC');

      // `vowelsGroup` length can be 2+, so define first, next & extra vowels.
      let firstV = vowelsGroup.substring(0, 1).normalize('NFD');
      let nextV = vowelsGroup.substring(1, 2).normalize('NFD');
      const extraV = vowelsGroup.substring(2).normalize('NFD');

      const firstD = firstV.substring(1);
      const nextD = nextV.substring(1);

      firstV = firstV.substring(0, 1);
      nextV = nextV.substring(0, 1);

      const hasDiphthong = diphthongs.includes((firstV + nextV).toLowerCase());

      if (/* diaeresis */ !/\u0308/.test(nextD) && hasDiphthong) {
        return firstV + firstD + nextV + breathing + nextD + extraV;
      }

      return firstV + breathing + firstD + nextV + nextD + extraV;
    })
    .replace(new RegExp(`(?<!ρ)(ρ)h`, 'gi'), `$1${ROUGH_BREATHING}`)
    .replace(new RegExp('h', 'gi'), '')
    .normalize('NFC');
}
