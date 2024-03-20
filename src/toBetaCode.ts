import { KeyType, Preset } from './enums';
import { IConversionOptions, MixedPreset } from './interfaces';
import { Mapping } from './Mapping';
import {
  applyGammaNasals,
  applyUppercaseChars,
  fromTLG,
  handleOptions,
  normalizeBetaCode,
  toTLG,
  trNormalizeCoronis,
  removeDiacritics as utilRmDiacritics,
  removeExtraWhitespace as utilRmExtraWhitespace,
  removeGreekVariants as utilRmGreekVariants
} from './utils';

export function toBetaCode(
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
    transliterationStyle
  } = options;
  const mapping = declaredMapping ?? new Mapping(options);

  const isInputTLG = fromType === KeyType.TLG_BETA_CODE;
  const isOutputTLG = betaCodeStyle?.useTLGStyle;

  if (isInputTLG) fromType = KeyType.BETA_CODE;

  switch (fromType) {
    case KeyType.BETA_CODE:
      if (removeDiacritics) str = utilRmDiacritics(str, fromType);
      str = applyGammaNasals(str, fromType);
      break;

    case KeyType.GREEK:
      if (removeDiacritics) str = utilRmDiacritics(str, fromType);
      str = utilRmGreekVariants(str);
      str = mapping.apply(str, fromType, KeyType.BETA_CODE);
      break;

    case KeyType.TRANSLITERATION:
      str = applyUppercaseChars(str);

      str = trNormalizeCoronis(str, transliterationStyle?.setCoronisStyle);

      // Flag transliterated rough breathings.
      str = str.replace(/(?<=\p{P}|\s|^|r{1,2})h/gimu, '$');

      str = mapping.apply(str, fromType, KeyType.BETA_CODE);

      if (removeDiacritics) {
        str = utilRmDiacritics(str, fromType).replace(/\$/gi, '');
      } else {
        str = trConvertFlaggedBreathings(str);
      }
      break;
  }

  str = normalizeBetaCode(str);

  if (isInputTLG && !isOutputTLG) str = fromTLG(str);
  if (!isInputTLG && isOutputTLG) str = toTLG(str);

  if (removeExtraWhitespace) str = utilRmExtraWhitespace(str);

  return str;
}

/**
 * Returns a string with beta code formated breathings.
 *
 * @remarks
 * This function applies:
 *   1. initial breathings, taking care of diphthongs and diaeresis rules;
 *   2. rough breathing on single rhos (excluding double rhos).
 * Then it removes possibly remaining flagged rough breathings (such as
 * on double rhos).
 */
function trConvertFlaggedBreathings(str: string): string {
  const diphthongs = ['ai', 'au', 'ei', 'eu', 'hu', 'oi', 'ou', 'ui'];
  const vowels = 'aehiouw';
  const diacritics = '()\\/+=|';

  // $1: trRough, $2: firstV, $3: firstD, $4: nextV, $5: nextD.
  const reInitialBreathing = new RegExp(`(?<=(?![${diacritics}])\\p{P}|\\s|^)(\\$)?([${vowels}])([${diacritics}])?([${vowels}])?([${diacritics}])?`, 'gimu'); // prettier-ignore

  return str
    .normalize('NFD')
    .replace(reInitialBreathing, (m, trRough, firstV, firstD, nextV, nextD) => {
      const breathing = trRough ? '(' : ')';

      firstD = firstD ?? '';
      nextV = nextV ?? '';
      nextD = nextD ?? '';

      const hasDiphthong = diphthongs.includes((firstV + nextV).toLowerCase());

      if (/* diaeresis */ !/\+/.test(nextD) && hasDiphthong) {
        return firstV + firstD + nextV + breathing + nextD;
      }

      return firstV + breathing + firstD + nextV + nextD;
    })
    .replace(/(?<!r)(r)\$/gi, '$1(')
    .replace(/\$/g, '')
    .normalize();
}
