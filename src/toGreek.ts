import { KeyType, Preset } from './enums';
import { IConversionOptions, MixedPreset } from './interfaces';
import { Mapping, ROUGH_BREATHING, SMOOTH_BREATHING } from './Mapping';
import {
  applyGammaNasals,
  applyGreekVariants,
  handleOptions,
  normalizeBetaCode,
  normalizeGreek,
  normalizeTransliteration,
  removeDiacritics as utilRmDiacritics,
  removeExtraWhitespace as utilRmExtraWhitespace,
  removeGreekVariants as utilRmGreekVariants,
  trApplyUppercaseChars,
  handleTLGInput
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
    betaCodeStyle,
    greekStyle,
    transliterationStyle,
    isUpperCase
  } = options;
  const mapping = declaredMapping ?? new Mapping(options);

  if (fromType === KeyType.TLG_BETA_CODE) [str, fromType] = handleTLGInput(str);

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = normalizeBetaCode(str, betaCodeStyle);
      if (removeDiacritics) str = utilRmDiacritics(str, fromType);
      str = mapping.apply(str, fromType, KeyType.GREEK);
      break;

    case KeyType.GREEK:
      if (removeDiacritics) str = utilRmDiacritics(str, fromType);
      str = utilRmGreekVariants(str);
      str = applyGammaNasals(str, fromType);
      break;

    case KeyType.TRANSLITERATION:
      str = normalizeTransliteration(str, transliterationStyle, isUpperCase);
      str = trApplyUppercaseChars(str);
      str = mapping.apply(str, fromType, KeyType.GREEK);

      if (removeDiacritics) {
        str = utilRmDiacritics(str, fromType).replace(/h/gi, '');
      } else {
        str = trConvertBreathings(str);
      }
      break;
  }

  str = applyGreekVariants(str, greekStyle);
  if (removeExtraWhitespace) str = utilRmExtraWhitespace(str);

  return normalizeGreek(str, greekStyle);
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
 * The regex captures the first vowels - including their diacritics - of a word
 * together. Notice that the `vowelGroups` can match 2+ vowels.
 */
function trConvertBreathings(str: string): string {
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

      return /* diaeresis */ !/\u0308/.test(nextD) && hasDiphthong
        ? firstV + firstD + nextV + breathing + nextD + extraV
        : firstV + breathing + firstD + nextV + nextD + extraV;
    })
    .replace(new RegExp(`(?<!ρ)(ρ)h`, 'gi'), `$1${ROUGH_BREATHING}`)
    .replace(new RegExp('h', 'gi'), '')
    .normalize();
}
