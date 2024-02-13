import {
  AdditionalChars,
  KeyType,
  Preset,
  TransliterationPreset
} from './enums';
import { IConversionOptions } from './interfaces';
import {
  DIAERESIS,
  Mapping,
  ROUGH_BREATHING,
  SMOOTH_BREATHING
} from './Mapping';
import {
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils';

const ALA_LC_OPTIONS: IConversionOptions = {
  removeDiacritics: true,
  useAdditionalChars: [
    AdditionalChars.DIGAMMA,
    AdditionalChars.KOPPA,
    AdditionalChars.LUNATE_SIGMA
  ],
  setTransliterationStyle: {
    upsilon_y: true,
    lunatesigma_s: true
  }
};

const BNF_OPTIONS: IConversionOptions = {
  removeDiacritics: false,
  useAdditionalChars: [
    AdditionalChars.DIGAMMA,
    AdditionalChars.YOT,
    AdditionalChars.LUNATE_SIGMA,
    AdditionalChars.STIGMA,
    AdditionalChars.KOPPA,
    AdditionalChars.SAMPI
  ]
};

const SBL_OPTIONS: IConversionOptions = {
  removeDiacritics: true,
  setTransliterationStyle: {
    upsilon_y: true
  }
};

export function toTransliteration(
  str: string,
  fromType: KeyType,
  options: TransliterationPreset | IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  // Convert named presets to `IConversionOptions`objects.
  if (typeof options === 'string') {
    switch (options) {
      case Preset.ALA_LC:
        options = ALA_LC_OPTIONS;
        break;

      case Preset.BNF:
        options = BNF_OPTIONS;
        break;

      case Preset.SBL:
        options = SBL_OPTIONS;
        break;

      default:
        console.warn(`style '${options}' is not implemented.`);
    }
  }

  const mapping = declaredMapping ?? new Mapping(options);
  const transliterationStyle = mapping.getTransliterationStyle();

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = bcFlagRoughBreathings(str);

      if (transliterationStyle?.upsilon_y) {
        str = flagDiaereses(str, KeyType.BETA_CODE);
      }

      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.BETA_CODE);
      }

      str = mapping.apply(str, KeyType.BETA_CODE, KeyType.TRANSLITERATION);

      // Apply flagged rough breathings.
      str = str.replace(/\$\$/g, 'H').replace(/\$/g, 'h');
      break;

    case KeyType.GREEK:
      str = grConvertBreathings(str);
      if (transliterationStyle?.upsilon_y) {
        str = flagDiaereses(str, KeyType.GREEK);
      }
      if (options.removeDiacritics) str = removeDiacritics(str, KeyType.GREEK);
      str = removeGreekVariants(str);
      str = normalizeGreek(str);
      str = mapping.apply(str, KeyType.GREEK, KeyType.TRANSLITERATION);
      break;

    case KeyType.TRANSLITERATION:
      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.TRANSLITERATION, {
          letters: mapping.trLettersWithCxOrMacron(),
          useCxOverMacron: transliterationStyle?.useCxOverMacron
        });
      }

      str = mapping.apply(
        str,
        KeyType.TRANSLITERATION,
        KeyType.TRANSLITERATION
      );
      break;
  }

  if (transliterationStyle?.upsilon_y) {
    str = applyUpsilonDiphthongs(str);
    str = str.replace(/@/gm, '');
  }

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str);

  return str.normalize('NFC');
}

/**
 * Returns a transliterated string with correct upsilon forms.
 *
 * @remarks
 * This applies to the `transliterationStyle.upsilon_y` option.
 *
 * @privateRemarks
 * (1) Upsilon diphthongs are: 'au', 'eu', 'ēu', 'ou', 'ui', 'ōu'.
 * (2) The given string's diaereses should have been flagged as '@' using
 * the `flagDiaereses()` function.
 */
function applyUpsilonDiphthongs(transliteratedStr: string): string {
  const vowels = 'aeēioyō';
  // `vowelsGroup` includes the upsilon ('y'), the diaeresis flag '@'.
  const reUpsilonDiphthongs = new RegExp(`(?<vowelsGroup>[${vowels}\\p{M}@]{2,})`, 'gimu'); // prettier-ignore

  return transliteratedStr
    .normalize('NFD')
    .replace(reUpsilonDiphthongs, (match, vowelsGroup) => {
      if (!/y/i.test(vowelsGroup)) return vowelsGroup;
      if (/* flagged diaeresis */ /@/.test(vowelsGroup)) return vowelsGroup;
      if (vowelsGroup.normalize('NFC').length === 1) return vowelsGroup;

      return vowelsGroup.replace(/Y/, 'U').replace(/y/, 'u');
    })
    .normalize('NFC');
}

/**
 * Returns a beta code string with an unambiguous representation
 * of rough breathings (`h` -> `$`, `H` -> `$$`).
 *
 * @remarks
 * Rough breathings are ambiguous as letter `h` is transliterated
 * as `ē` or `ê`.
 */
function bcFlagRoughBreathings(betaCodeStr: string): string {
  return betaCodeStr.replace(/([aehiowur]+)\(/gi, (match, group) => {
    if (match.toLowerCase() === 'r(') return group + '$';
    else if (group === group.toLowerCase()) return '$' + group;
    else return '$$' + group.toLowerCase();
  });
}

/**
 * Returns a greek string with tranliterated breathings.
 *
 * @remarks
 * This function does:
 *   1. remove smooth breathings;
 *   2. add an `h` before a word starting by 1-2 vowels carrying a rough breathing;
 *   3. add an `h` after double rhos carrying a rough breathing;
 *   4. add an `h` after a single rho carrying a rough breathing.
 */
function grConvertBreathings(greekStr: string): string {
  const reInitialBreathing = new RegExp(`(?<vowelsGroup>[αεηιοωυ]{1,2})(${ROUGH_BREATHING})`, 'gi'); // prettier-ignore
  const reDoubleRho = new RegExp(`(ρ${SMOOTH_BREATHING}?ρ)${ROUGH_BREATHING}?`, 'gi'); //prettier-ignore
  const reSingleRho = new RegExp(`(ρ)${ROUGH_BREATHING}`, 'gi');

  return greekStr
    .normalize('NFD')
    .replace(new RegExp(SMOOTH_BREATHING, 'g'), '')
    .replace(reInitialBreathing, (match, vowelsGroup) => {
      if (vowelsGroup === vowelsGroup.toLowerCase()) return 'h' + vowelsGroup;
      else return 'H' + vowelsGroup.toLowerCase();
    })
    .replace(reDoubleRho, '$1h') // Apply rough breathings on double rhos.
    .replace(reSingleRho, '$1h') // Apply rough breathings on single rhos.
    .normalize('NFC');
}

/**
 * Returns a string with added 'commercial at' when diaereses occur
 * (`\u0308` + `@`) to be able to test the presence of diaereses even
 * if the diacritics have been removed.
 */
function flagDiaereses(str: string, fromType: KeyType): string {
  switch (fromType) {
    case KeyType.BETA_CODE:
      return str.replace(new RegExp('\\+', 'g'), '$&@');

    case KeyType.GREEK:
    case KeyType.TRANSLITERATION:
      return str
        .normalize('NFD')
        .replace(new RegExp(DIAERESIS, 'g'), '$&@')
        .normalize('NFC');

    default:
      console.warn(`KeyType '${fromType}' is not implemented.`);
      return str;
  }
}
