import { KeyType, Preset } from './enums';
import {
  IConversionOptions,
  IInternalConversionOptions,
  MixedPreset
} from './interfaces';
import {
  CIRCUMFLEX,
  DIAERESIS,
  MACRON,
  Mapping,
  ROUGH_BREATHING,
  SMOOTH_BREATHING
} from './Mapping';
import {
  handleOptions,
  normalizeGreek,
  removeDiacritics as utilRmDiacritics,
  removeExtraWhitespace as utilRmExtraWhitespace,
  removeGreekVariants as utilRmGreekVariants
} from './utils';

export function toTransliteration(
  str: string,
  fromType: KeyType,
  settings: Preset | MixedPreset | IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const options = handleOptions(str, fromType, settings);
  const { removeDiacritics, removeExtraWhitespace, setTransliterationStyle } =
    options;
  const mapping = declaredMapping ?? new Mapping(options);

  if (setTransliterationStyle?.upsilon_y) str = flagDiaereses(str, fromType);

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = bcFlagRoughBreathings(str, options);
      if (removeDiacritics) str = utilRmDiacritics(str, KeyType.BETA_CODE);
      str = mapping.apply(str, KeyType.BETA_CODE, KeyType.TRANSLITERATION);
      str = bcConvertBreathings(str, options);
      break;

    case KeyType.GREEK:
      str = grConvertBreathings(str, options);
      if (removeDiacritics) str = utilRmDiacritics(str, KeyType.GREEK);
      str = utilRmGreekVariants(str);
      str = normalizeGreek(str);
      str = mapping.apply(str, KeyType.GREEK, KeyType.TRANSLITERATION);
      break;

    case KeyType.TRANSLITERATION:
      const {
        useCxOverMacron,
        xi_ks,
        chi_kh,
        rho_rh,
        upsilon_y,
        lunatesigma_s
      } = setTransliterationStyle ?? {};

      if (useCxOverMacron) {
        const re = new RegExp(`([${mapping.trLettersWithCxOrMacron()}])(${MACRON})`, 'g'); // prettier-ignore
        str = str.normalize('NFD').replace(re, `$1${CIRCUMFLEX}`).normalize();
      }

      if (xi_ks) {
        str = str.replace(/x/gi, (match) => {
          if (options.isUpperCase) return 'KS';
          else return match.charAt(0).toUpperCase() === match ? 'Ks' : 'ks';
        });
      }

      if (chi_kh) {
        str = str.replace(/ch/gi, (match) => {
          if (options.isUpperCase) return 'KH';
          else return match.charAt(0).toUpperCase() === match ? 'Kh' : 'kh';
        });
      }

      if (rho_rh) {
        str = str
          .replace(/(?<!^)rr(?!$)/gim, (match) =>
            match.toUpperCase() === match ? match + 'H' : match + 'h'
          )
          .replace(/(?<=\p{P}|\s|^)r/gimu, (match) =>
            options.isUpperCase ? match + 'H' : match + 'h'
          );
      }

      if (upsilon_y) {
        str = str
          .normalize('NFD')
          .replace(/U/g, 'Y')
          .replace(/u/g, 'y')
          .normalize();
      }

      if (lunatesigma_s) {
        str = str.replace(/c(?!h)/gi, (match) =>
          match.toUpperCase() === match ? 'S' : 's'
        );
      }

      if (removeDiacritics) {
        str = utilRmDiacritics(
          str,
          KeyType.TRANSLITERATION,
          mapping.trLettersWithCxOrMacron(),
          useCxOverMacron
        );
      }

      str = mapping.apply(
        str,
        KeyType.TRANSLITERATION,
        KeyType.TRANSLITERATION
      );
      break;
  }

  if (setTransliterationStyle?.upsilon_y) {
    str = applyUpsilonDiphthongs(str);
    str = str.replace(/@/gm, '');
  }

  if (removeExtraWhitespace) str = utilRmExtraWhitespace(str);

  return str.normalize();
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
  const reUpsilonDiphthongs = new RegExp(`([${vowels}\\p{M}@]{2,})`, 'gimu'); // prettier-ignore

  return transliteratedStr
    .normalize('NFD')
    .replace(reUpsilonDiphthongs, (match, vowelsGroup) => {
      if (!/y/i.test(vowelsGroup)) return vowelsGroup;
      if (/* flagged diaeresis */ /@/.test(vowelsGroup)) return vowelsGroup;
      if (vowelsGroup.normalize().length === 1) return vowelsGroup;

      return vowelsGroup.replace(/Y/, 'U').replace(/y/, 'u');
    })
    .normalize();
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
        // @fixme(v0.14): case should be checked against the current word.
        isUpperCase ? match + 'H' : match + 'h'
      );
  }

  const vowels = 'aeēiouyō';
  const reInitialSmooth = new RegExp(`(?<=\\p{P}|\\s|^)([${vowels}]{1,2})(${SMOOTH_BREATHING})`, 'gimu'); // prettier-ignore

  transliteratedStr = transliteratedStr
    .replace(reInitialSmooth, '$1')
    .replace(new RegExp(`(r)${SMOOTH_BREATHING}`, 'gi'), '$1');

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
      // @fixme(v0.14): case should be checked against the current word too.
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
        .normalize();
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

  const reInitialSmooth = new RegExp(`(?<=\\p{P}|\\s|^)([αεηιουω]{1,2})(${SMOOTH_BREATHING})`, 'gimu'); // prettier-ignore
  const reInitialRough = new RegExp(`([αεηιοωυ]{1,2})(${ROUGH_BREATHING})`, 'gi'); // prettier-ignore
  const reDoubleRhoLazy = new RegExp(`(ρ${SMOOTH_BREATHING}?ρ)${ROUGH_BREATHING}?`, 'gi'); //prettier-ignore
  const reInitialRho = new RegExp(`(ρ)${ROUGH_BREATHING}`, 'gi');
  const reInitialRhoLazy = new RegExp(`(?<=\\p{P}|\\s|^)(ρ)${ROUGH_BREATHING}?`, 'gimu'); // prettier-ignore

  // Change the coronis form after `reInitialSmooth`,
  // by replacing the remaining smooth breathings (e. g.
  // `.replace(new RegExp(SMOOTH_BREATHING, 'g'), CORONIS)`).
  return greekStr
    .normalize('NFD')
    .replace(reInitialSmooth, '$1')
    .replace(reInitialRough, (match, vowelsGroup) => {
      // @fixme(v0.14): case should be checked against the current word too.
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
    .normalize();
}
