import { KeyType, MixedPreset, Preset } from './enums';
import { IConversionOptions, IInternalConversionOptions } from './interfaces';
import {
  CIRCUMFLEX,
  DIAERESIS,
  MACRON,
  Mapping,
  ROUGH_BREATHING,
  SMOOTH_BREATHING
} from './Mapping';
import { applyPreset } from './presets';
import {
  isUpperCase,
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

  const internalOptions: IInternalConversionOptions = {
    isUpperCase: isUpperCase(str, fromType),
    ...options
  };

  const mapping = declaredMapping ?? new Mapping(internalOptions);

  if (options.setTransliterationStyle?.upsilon_y) {
    str = flagDiaereses(str, fromType);
  }

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = bcFlagRoughBreathings(str, internalOptions);
      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.BETA_CODE);
      }
      str = mapping.apply(str, KeyType.BETA_CODE, KeyType.TRANSLITERATION);
      str = bcConvertBreathings(str, internalOptions);
      break;

    case KeyType.GREEK:
      str = grConvertBreathings(str, internalOptions);
      if (options.removeDiacritics) str = removeDiacritics(str, KeyType.GREEK);
      str = removeGreekVariants(str);
      str = normalizeGreek(str);
      str = mapping.apply(str, KeyType.GREEK, KeyType.TRANSLITERATION);
      break;

    // @todo: clean this section.
    case KeyType.TRANSLITERATION:
      if (options.setTransliterationStyle?.useCxOverMacron) {
        const re = new RegExp(`([${mapping.trLettersWithCxOrMacron()}])(${MACRON})`, 'g'); // prettier-ignore
        str = str
          .normalize('NFD')
          .replace(re, `$1${CIRCUMFLEX}`)
          .normalize('NFC');
      }

      if (options.setTransliterationStyle?.xi_ks) {
        str = str.replace(/x/gi, (match) => {
          if (internalOptions.isUpperCase) return 'KS';
          else return match.charAt(0).toUpperCase() === match ? 'Ks' : 'ks';
        });
      }

      if (options.setTransliterationStyle?.chi_kh) {
        str = str.replace(/ch/gi, (match) => {
          if (internalOptions.isUpperCase) return 'KH';
          else return match.charAt(0).toUpperCase() === match ? 'Kh' : 'kh';
        });
      }

      if (options.setTransliterationStyle?.rho_rh) {
        str = str
          .replace(/(?<!^)rr(?!$)/gim, (match) =>
            match.toUpperCase() === match ? match + 'H' : match + 'h'
          )
          .replace(/(?<=\p{P}|\s|^)r/gimu, (match) =>
            internalOptions.isUpperCase ? match + 'H' : match + 'h'
          );
      }

      if (options.setTransliterationStyle?.upsilon_y) {
        str = str
          .normalize('NFD')
          .replace(/U/g, 'Y')
          .replace(/u/g, 'y')
          .normalize('NFC');
      }

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
 * Returns a transliterated string with transliterated breathings.
 *
 * @remarks
 * This function does:
 *   1. convert flagged rough breathings;
 *   2. enforce rough breathings on rhos if `setTransliterationStyle.rho_rh` is enabled;
 *   3. remove initial smooth breathings (while keeping coronides);
 *   4. remove potential smooth breathings on rhos.
 *   5. transliterate the remaining smooth breathings.
 *
 * @param transliteratedStr - Expects an already transliterated string with flagged
 * rough breathings ('$', '$$').
 * @param options - Internal conversion options.
 */
function bcConvertBreathings(
  transliteratedStr: string,
  options: IInternalConversionOptions
): string {
  const { isUpperCase, setTransliterationStyle } = options;
  const rho_rh = setTransliterationStyle?.rho_rh;

  transliteratedStr = transliteratedStr
    .replace(/\$\$/g, 'H')
    .replace(/\$/g, 'h');

  if (rho_rh) {
    transliteratedStr = transliteratedStr
      .replace(new RegExp(`(r${SMOOTH_BREATHING}?r)(?!h)`, 'gi'), (match) =>
        match.toUpperCase() === match ? 'RRH' : 'rrh'
      )
      .replace(/(?<=\p{P}|\\s|^)(r)(?!h)/gimu, (match) =>
        // @fixme(v0.13): case should be checked against the current word.
        isUpperCase ? match + 'H' : match + 'h'
      );
  }

  const vowels = 'aeēiouyō';
  const reInitialSmooth = new RegExp(`(?<=\\p{P}|\\s|^)(?<vowelsGroup>[${vowels}]{1,2})(${SMOOTH_BREATHING})`, 'gimu'); // prettier-ignore

  transliteratedStr = transliteratedStr
    .replace(reInitialSmooth, '$<vowelsGroup>')
    .replace(new RegExp(`(?<rho>r)${SMOOTH_BREATHING}`, 'gi'), '$<rho>');

  return transliteratedStr;
}

/**
 * Returns a beta code string with an unambiguous representation
 * of rough breathings (`h` -> `$`, `H` -> `$$`).
 *
 * @remarks
 * Rough breathings are ambiguous as letter `h` is transliterated
 * as `ē` or `ê`.
 */
function bcFlagRoughBreathings(
  betaCodeStr: string,
  options: IInternalConversionOptions
): string {
  const { isUpperCase } = options;

  return betaCodeStr
    .replace(/([aehiouw]{1,2})\(/gi, (match, vowelsGroup) => {
      // @fixme(v0.13): case should be checked against the current word too.
      if (isUpperCase) return '$$' + vowelsGroup;
      else {
        return vowelsGroup.charAt(0).toUpperCase() === vowelsGroup.charAt(0)
          ? '$$' + vowelsGroup.toLowerCase()
          : '$' + vowelsGroup;
      }
    })
    .replace(/(r{1,2})\(/gi, (match, rho) =>
      isUpperCase ? rho + '$$' : rho + '$'
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
 * Returns a greek string with transliterated breathings.
 *
 * @remarks
 * This function does:
 *   1. remove initial smooth breathings (while keeping coronides);
 *   2. add an `h` before a word starting by 1-2 vowels carrying a rough breathing;
 *   3. add an `h` after double rhos;
 *   4. add an `h` after a single rho (carrying a rough breathing or not if `rho_rh` is true).
 */
function grConvertBreathings(
  greekStr: string,
  options: IInternalConversionOptions
): string {
  const { isUpperCase, setTransliterationStyle } = options;
  const rho_rh = setTransliterationStyle?.rho_rh;

  const reInitialSmooth = new RegExp(`(?<=\\p{P}|\\s|^)(?<vowelsGroup>[αεηιουω]{1,2})(${SMOOTH_BREATHING})`, 'gimu'); // prettier-ignore
  const reInitialRough = new RegExp(`(?<vowelsGroup>[αεηιοωυ]{1,2})(${ROUGH_BREATHING})`, 'gi'); // prettier-ignore
  const reDoubleRhoLazy = new RegExp(`(?<doubleRho>ρ${SMOOTH_BREATHING}?ρ)${ROUGH_BREATHING}?`, 'gi'); //prettier-ignore
  const reInitialRho = new RegExp(`(?<initialRho>ρ)${ROUGH_BREATHING}`, 'gi');
  const reInitialRhoLazy = new RegExp(`(?<=\\p{P}|\\s|^)(?<initialRho>ρ)${ROUGH_BREATHING}?`, 'gimu'); // prettier-ignore

  // Change the coronis form after `reInitialSmooth`,
  // by replacing the remaining smooth breathings (e. g.
  // `.replace(new RegExp(SMOOTH_BREATHING, 'g'), CORONIS)`).
  return greekStr
    .normalize('NFD')
    .replace(reInitialSmooth, '$<vowelsGroup>')
    .replace(reInitialRough, (match, vowelsGroup) => {
      // @fixme(v0.13): case should be checked against the current word too.
      if (isUpperCase) return 'H' + vowelsGroup;
      else {
        return vowelsGroup.charAt(0).toUpperCase() === vowelsGroup.charAt(0)
          ? 'H' + vowelsGroup.toLowerCase()
          : 'h' + vowelsGroup;
      }
    })
    .replace(reDoubleRhoLazy, (match, doubleRho) =>
      doubleRho.toUpperCase() === doubleRho ? 'RRH' : 'rrh'
    )
    .replace(rho_rh ? reInitialRhoLazy : reInitialRho, (match, initialRho) =>
      isUpperCase ? initialRho + 'H' : initialRho + 'h'
    )
    .normalize('NFC');
}
