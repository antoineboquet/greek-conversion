import { KeyType, MixedPreset, Preset } from './enums';
import { IConversionOptions } from './interfaces';
import {
  DIAERESIS,
  Mapping,
  ROUGH_BREATHING,
  SMOOTH_BREATHING
} from './Mapping';
import { applyPreset } from './presets';
import {
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils';

export function toTransliteration(
  str: string,
  fromType: KeyType,
  options: Preset | MixedPreset | IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  // Convert named presets to `IConversionOptions` objects.
  if (typeof options === 'string' || Array.isArray(options)) {
    options = applyPreset(options);
  }

  // @fixme: beta code '#2*#2#1*#1#5*#5' produces a false positive;
  // so we should define what is uppercase for beta code.
  const mapping =
    declaredMapping ??
    new Mapping({ isUpperCase: str.toUpperCase() === str, ...options });

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = bcFlagRoughBreathings(str);

      if (options.setTransliterationStyle?.upsilon_y) {
        str = flagDiaereses(str, KeyType.BETA_CODE);
      }

      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.BETA_CODE);
      }

      str = mapping.apply(str, KeyType.BETA_CODE, KeyType.TRANSLITERATION);

      // Apply flagged rough breathings.
      str = str.replace(/\$\$/g, 'H').replace(/\$/g, 'h');

      // Enforce rough breathings on rhos.
      if (options.setTransliterationStyle?.rho_rh) {
        str = str
          .replace(/(rr)(?!h)/gi, (match) =>
            match === 'RR' ? match + 'H' : match + 'h'
          )
          .replace(/(?<=\p{P}|\\s|^)(r)(?!h)/gimu, (match) =>
            // @FIXME: check for the word, not the entire string.
            str.toUpperCase() === str ? match + 'H' : match + 'h'
          );
      }
      break;

    case KeyType.GREEK:
      str = grConvertBreathings(str, options.setTransliterationStyle?.rho_rh);
      if (options.setTransliterationStyle?.upsilon_y) {
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
          useCxOverMacron: options.setTransliterationStyle?.useCxOverMacron
        });
      }

      str = mapping.apply(
        str,
        KeyType.TRANSLITERATION,
        KeyType.TRANSLITERATION
      );
      break;
  }

  if (options.setTransliterationStyle?.upsilon_y) {
    str = applyUpsilonDiphthongs(str);
    str = str.replace(/@/gm, '');
  }

  if (options.removeExtraWhitespace) str = removeExtraWhitespace(str);

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
  return betaCodeStr
    .replace(/([aehiowu]{1,2})\(/gi, (match, vowelsGroup) =>
      vowelsGroup === vowelsGroup.toUpperCase()
        ? '$$' + vowelsGroup.toLowerCase()
        : '$' + vowelsGroup
    )
    .replace(/(r{1,2})\(/gi, (match, rho) =>
      betaCodeStr.toUpperCase() === betaCodeStr ? rho + '$$' : rho + '$'
    );
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

/**
 * Returns a greek string with tranliterated breathings.
 *
 * @remarks
 * This function does:
 *   1. remove smooth breathings;
 *   2. add an `h` before a word starting by 1-2 vowels carrying a rough breathing;
 *   3. add an `h` after double rhos;
 *   4. add an `h` after a single rho (carrying a rough breathing or not if `rho_rh` is true).
 */
function grConvertBreathings(greekStr: string, rho_rh: boolean): string {
  const reInitialBreathing = new RegExp(`(?<vowelsGroup>[αεηιοωυ]{1,2})(${ROUGH_BREATHING})`, 'gi'); // prettier-ignore
  const reDoubleRhoLazy = new RegExp(`(?<doubleRho>ρ${SMOOTH_BREATHING}?ρ)${ROUGH_BREATHING}?`, 'gi'); //prettier-ignore
  const reInitialRho = new RegExp(`(?<initialRho>ρ)${ROUGH_BREATHING}`, 'gi');
  const reInitialRhoLazy = new RegExp(`(?<=\\p{P}|\\s|^)(?<initialRho>ρ)${ROUGH_BREATHING}?`, 'gimu'); // prettier-ignore

  return greekStr
    .normalize('NFD')
    .replace(new RegExp(SMOOTH_BREATHING, 'g'), '')
    .replace(reInitialBreathing, (match, vowelsGroup) =>
      vowelsGroup === vowelsGroup.toUpperCase()
        ? 'H' + vowelsGroup.toLowerCase()
        : 'h' + vowelsGroup
    )
    .replace(reDoubleRhoLazy, (match, doubleRho) =>
      doubleRho === 'ΡΡ' ? doubleRho + 'H' : doubleRho + 'h'
    )
    .replace(rho_rh ? reInitialRhoLazy : reInitialRho, (match, initialRho) =>
      greekStr.toUpperCase() === greekStr ? initialRho + 'H' : initialRho + 'h'
    )
    .normalize('NFC');
}
