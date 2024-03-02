import { KeyType, MixedPreset, Preset } from './enums';
import { IConversionOptions, IInternalConversionOptions } from './interfaces';
import { Mapping } from './Mapping';
import { applyPreset } from './presets';
import {
  applyUppercaseChars,
  isUpperCase,
  removeDiacritics,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils';

export function toBetaCode(
  str: string,
  fromType: KeyType,
  options: Preset | MixedPreset | IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  // Convert named presets to `IConversionOptions` objects.
  if (typeof options === 'string' || Array.isArray(options)) {
    options = applyPreset(options);
  }

  const internalOptions: IInternalConversionOptions = {
    isUpperCase: isUpperCase(str, fromType),
    ...options
  };

  const mapping = declaredMapping ?? new Mapping(internalOptions);

  switch (fromType) {
    case KeyType.BETA_CODE:
      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.BETA_CODE);
      }
      str = mapping.apply(str, KeyType.BETA_CODE, KeyType.BETA_CODE);
      str = reorderDiacritics(str);
      break;

    case KeyType.GREEK:
      if (options.removeDiacritics) str = removeDiacritics(str, KeyType.GREEK);
      str = removeGreekVariants(str);
      str = mapping.apply(str, KeyType.GREEK, KeyType.BETA_CODE);
      str = reorderDiacritics(str);
      break;

    case KeyType.TRANSLITERATION:
      str = applyUppercaseChars(str);

      // Flag transliterated rough breathings.
      str = str.replace(/(?<=\p{P}|\s|^|r{1,2})h/gimu, '$');

      str = mapping.apply(str, KeyType.TRANSLITERATION, KeyType.BETA_CODE);

      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.TRANSLITERATION);
        str = str.replace(/\$/gi, '');
      } else {
        str = trConvertFlaggedBreathings(str);
      }

      str = reorderDiacritics(str);
      break;
  }

  if (options.removeExtraWhitespace) str = removeExtraWhitespace(str);

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

/**
 * Returns a beta code string with a correct diacritics order.
 *
 * @privateRemarks
 * This function should reorder all the diacritics defined for the beta code
 * representation. Currently, it only reorders breathings/accents in relation
 * to the iota subscript.
 */
function reorderDiacritics(betaCodeStr: string): string {
  return betaCodeStr.replace(/(\|)([()\\/+=]+)/g, '$2$1');
}
