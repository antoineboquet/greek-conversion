import { Coronis, KeyType, Preset } from './enums';
import { IConversionOptions, MixedPreset } from './interfaces';
import { Mapping, SMOOTH_BREATHING } from './Mapping';
import {
  applyUppercaseChars,
  bcReorderDiacritics,
  handleOptions,
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
  const { removeDiacritics, removeExtraWhitespace, setTransliterationStyle } =
    options;
  const mapping = declaredMapping ?? new Mapping(options);

  switch (fromType) {
    case KeyType.BETA_CODE:
      if (removeDiacritics) str = utilRmDiacritics(str, KeyType.BETA_CODE);
      str = mapping.apply(str, KeyType.BETA_CODE, KeyType.BETA_CODE);
      break;

    case KeyType.GREEK:
      if (removeDiacritics) str = utilRmDiacritics(str, KeyType.GREEK);
      str = utilRmGreekVariants(str);
      str = mapping.apply(str, KeyType.GREEK, KeyType.BETA_CODE);
      break;

    case KeyType.TRANSLITERATION:
      str = applyUppercaseChars(str);

      if (setTransliterationStyle?.setCoronisStyle === Coronis.APOSTROPHE) {
        str = str.replace(
          new RegExp(`(?<=\\S)${Coronis.APOSTROPHE}(?=\\S)`, 'gu'),
          SMOOTH_BREATHING
        );
      }

      // Flag transliterated rough breathings.
      str = str.replace(/(?<=\p{P}|\s|^|r{1,2})h/gimu, '$');

      str = mapping.apply(str, KeyType.TRANSLITERATION, KeyType.BETA_CODE);

      if (removeDiacritics) {
        str = utilRmDiacritics(str, KeyType.TRANSLITERATION);
        str = str.replace(/\$/gi, '');
      } else {
        str = trConvertFlaggedBreathings(str);
      }
      break;
  }

  str = bcReorderDiacritics(str);

  if (removeExtraWhitespace) str = utilRmExtraWhitespace(str);

  return str.normalize();
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
    .replace(
      reInitialBreathing,
      (match, trRough, firstV, firstD, nextV, nextD) => {
        const breathing = trRough ? '(' : ')';

        firstD = firstD ?? '';
        nextV = nextV ?? '';
        nextD = nextD ?? '';

        const hasDiphthong = diphthongs.includes(
          (firstV + nextV).toLowerCase()
        );

        if (/* diaeresis */ !/\+/.test(nextD) && hasDiphthong) {
          return firstV + firstD + nextV + breathing + nextD;
        }

        return firstV + breathing + firstD + nextV + nextD;
      }
    )
    .replace(/(?<!r)(r)\$/gi, '$1(')
    .replace(/\$/g, '')
    .normalize();
}
