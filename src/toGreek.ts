import { Coronis, KeyType, Preset } from './enums';
import {
  IConversionOptions,
  IInternalConversionOptions,
  MixedPreset
} from './interfaces';
import { Mapping, ROUGH_BREATHING, SMOOTH_BREATHING } from './Mapping';
import {
  applyGreekVariants,
  applyUppercaseChars,
  bcReorderDiacritics,
  fromTLG,
  handleOptions,
  normalizeGreek,
  trNormalizeCoronis,
  removeDiacritics as utilRmDiacritics,
  removeExtraWhitespace as utilRmExtraWhitespace,
  removeGreekVariants as utilRmGreekVariants
} from './utils';

export function toGreek(
  str: string,
  fromType: KeyType,
  settings: Preset | MixedPreset | IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const options = handleOptions(str, fromType, settings);
  const {
    removeDiacritics,
    removeExtraWhitespace,
    greekStyle,
    transliterationStyle
  } = options;
  const mapping = declaredMapping ?? new Mapping(options);

  if (fromType === KeyType.TLG_BETA_CODE) {
    str = fromTLG(str);
    fromType = KeyType.BETA_CODE;
  }

  switch (fromType) {
    case KeyType.BETA_CODE:
      if (removeDiacritics) str = utilRmDiacritics(str, fromType);
      else str = bcReorderDiacritics(str);

      str = mapping.apply(str, fromType, KeyType.GREEK);

      break;

    case KeyType.GREEK:
      if (removeDiacritics) str = utilRmDiacritics(str, fromType);
      str = utilRmGreekVariants(str);
      str = mapping.apply(str, fromType, fromType);
      break;

    case KeyType.TRANSLITERATION:
      str = applyUppercaseChars(str);
      str = mapping.apply(str, fromType, KeyType.GREEK);

      str = trNormalizeCoronis(str, transliterationStyle?.setCoronisStyle);

      if (removeDiacritics) {
        str = utilRmDiacritics(str, fromType);
        str = str.replace(/h/gi, '');
      } else {
        str = trConvertBreathings(str, options);
      }
      break;
  }

  str = applyGreekVariants(str, greekStyle);
  if (removeExtraWhitespace) str = utilRmExtraWhitespace(str);

  return normalizeGreek(str, greekStyle?.useGreekQuestionMark);
}

/**
 * Returns a string with greek breathings.
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
 * (1) Currently, the regex captures the first vowels - including their
 * diacritics - of a word together. Notice that the `vowelGroups` can
 * match 2+ vowels.
 */
function trConvertBreathings(
  str: string,
  options: IInternalConversionOptions
): string {
  const { isUpperCase } = options;

  const diphthongs = ['αι', 'αυ', 'ει', 'ευ', 'ηυ', 'οι', 'ου', 'υι'];
  const vowels = 'αεηιουω';
  const reInitialBreathing = new RegExp(`(?<=\\p{P}|\\s|^)(h)?([${vowels}\\p{M}]+)`, 'gimu'); // prettier-ignore

  return str
    .normalize('NFD')
    .replace(reInitialBreathing, (m, trRough, vowelsGroup) => {
      const breathing = trRough ? ROUGH_BREATHING : SMOOTH_BREATHING;

      vowelsGroup = vowelsGroup.normalize();

      // `vowelsGroup` length can be 2+, so define first, next & extra vowels.
      let firstV = vowelsGroup.charAt(0).normalize('NFD');
      let nextV = vowelsGroup.charAt(1).normalize('NFD');
      const extraV = vowelsGroup.substring(2);

      const firstD = firstV.substring(1);
      const nextD = nextV.substring(1);

      firstV = firstV.charAt(0);
      nextV = nextV.charAt(0);

      const hasDiphthong = diphthongs.includes((firstV + nextV).toLowerCase());

      if (/* diaeresis */ !/\u0308/.test(nextD) && hasDiphthong) {
        return isUpperCase
          ? firstV + breathing + firstD + nextD + nextV + extraV
          : firstV + firstD + nextV + breathing + nextD + extraV;
      }

      return firstV + breathing + firstD + nextV + nextD + extraV;
    })
    .replace(new RegExp(`(?<!ρ)(ρ)h`, 'gi'), `$1${ROUGH_BREATHING}`)
    .replace(new RegExp('h', 'gi'), '')
    .normalize();
}
