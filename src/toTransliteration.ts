import { Coronis, KeyType, Preset } from './enums';
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
  bcReorderDiacritics,
  fromTLG,
  handleOptions,
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
  const { removeDiacritics, removeExtraWhitespace, transliterationStyle } =
    options;
  const {
    setCoronisStyle,
    useCxOverMacron,
    beta_v,
    eta_i,
    xi_ks,
    phi_f,
    chi_kh,
    rho_rh,
    upsilon_y,
    lunatesigma_s
  } = transliterationStyle ?? {};
  const mapping = declaredMapping ?? new Mapping(options);

  if (upsilon_y) str = flagDiaereses(str, fromType);

  if (fromType === KeyType.TLG_BETA_CODE) {
    str = fromTLG(str);
    fromType = KeyType.BETA_CODE;
  }

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = bcReorderDiacritics(str);
      str = bcFlagRoughBreathings(str, options);
      if (removeDiacritics) str = utilRmDiacritics(str, fromType);
      str = mapping.apply(str, fromType, KeyType.TRANSLITERATION);
      str = bcConvertBreathings(str, options);
      break;

    case KeyType.GREEK:
      str = grConvertBreathings(str, options);
      if (removeDiacritics) str = utilRmDiacritics(str, fromType);
      str = utilRmGreekVariants(str);
      str = mapping.apply(str, fromType, KeyType.TRANSLITERATION);
      break;

    case KeyType.TRANSLITERATION:
      if (useCxOverMacron) {
        const re = new RegExp(`([${mapping.trLettersWithCxOrMacron()}])(${MACRON})`, 'g'); // prettier-ignore
        str = str.normalize('NFD').replace(re, `$1${CIRCUMFLEX}`).normalize();
      }

      if (beta_v) {
        str = str.replace(/b/gi, (m) => (m.toUpperCase() === m ? 'V' : 'v'));
      }

      if (eta_i) {
        str = str
          .normalize('NFD')
          .replace(/(e)(\p{M}+)/giu, (m, $1, $2) => {
            if ((useCxOverMacron && /\u0302/.test(m)) || /\u0304/.test(m)) {
              return $1.toUpperCase() === $1 ? 'I' + $2 : 'i' + $2;
            }
            return m;
          })
          .normalize();
      }

      if (xi_ks) {
        str = str.replace(/x/gi, (m) => {
          if (options.isUpperCase) return 'KS';
          else return m.charAt(0).toUpperCase() === m.charAt(0) ? 'Ks' : 'ks';
        });
      }

      if (phi_f) {
        str = str.replace(/ph/gi, (m) =>
          m.charAt(0).toUpperCase() === m.charAt(0) ? 'F' : 'f'
        );
      }

      if (chi_kh) {
        str = str.replace(/ch/gi, (m) => {
          if (options.isUpperCase) return 'KH';
          else return m.charAt(0).toUpperCase() === m.charAt(0) ? 'Kh' : 'kh';
        });
      }

      if (rho_rh) {
        str = str
          .replace(/(?<!^)rr(?!h)/gim, (m) =>
            m.toUpperCase() === m ? m + 'H' : m + 'h'
          )
          .replace(/(?<=\p{P}|\s|^)r/gimu, (m) =>
            options.isUpperCase ? m + 'H' : m + 'h'
          );
      }

      if (upsilon_y) {
        str = str
          .normalize('NFD')
          .replace(/U/g, 'Y')
          .replace(/u/g, 'y')
          .normalize();
      }

      // @fixme: lunatesigma_s should work only with `additionalChars` set to
      // `AdditionalChar.LUNATE_SIGMA`, `AdditionalChar.ALL` & `[...AdditionalChar.LUNATE_SIGMA]`.
      if (lunatesigma_s) {
        str = str.replace(/c(?!h)/gi, (m) =>
          m.toUpperCase() === m ? 'S' : 's'
        );
      }

      if (removeDiacritics) {
        str = utilRmDiacritics(
          str,
          fromType,
          mapping.trLettersWithCxOrMacron(),
          useCxOverMacron
        );
      }

      str = mapping.apply(str, fromType, fromType);
      break;
  }

  if (upsilon_y) {
    str = applyUpsilonDiphthongs(str, options, mapping).replace(/@/gm, '');
  }

  if (removeExtraWhitespace) str = utilRmExtraWhitespace(str);

  str = trApplyCoronis(str, setCoronisStyle);

  return str.normalize();
}

/**
 * Returns a transliterated string with correct upsilon forms.
 *
 * @remarks
 * This applies to the `transliterationStyle.upsilon_y` option. If its
 * value has been set to `Preset.ISO`, diphthongs 'au', 'eu', 'ou' only
 * will be preserved.
 *
 * @privateRemarks
 * (1) The expected input form of the upsilon is 'y'.
 * (2) Upsilon diphthongs to preserve are: 'au', 'eu', 'ēu', 'ou', 'ui', 'ōu'.
 * (2) The given string's diaereses should have been flagged as '@' using
 * the `flagDiaereses()` function.
 */
function applyUpsilonDiphthongs(
  transliteratedStr: string,
  options: IInternalConversionOptions,
  mapping: Mapping
): string {
  const { transliterationStyle } = options;
  const reUpsilonDiphthongs = new RegExp(`([aeēioyō\\p{M}@]{2,})`, 'gimu');

  return transliteratedStr
    .normalize('NFD')
    .replace(reUpsilonDiphthongs, (m, vowelsGroup) => {
      if (!/y/i.test(vowelsGroup)) return vowelsGroup;
      if (/* flagged diaeresis */ /@/.test(vowelsGroup)) return vowelsGroup;
      if (vowelsGroup.normalize().length === 1) return vowelsGroup;

      if (transliterationStyle?.upsilon_y === Preset.ISO) {
        const unaccentedGroup = utilRmDiacritics(
          vowelsGroup,
          KeyType.TRANSLITERATION,
          mapping.trLettersWithCxOrMacron(),
          transliterationStyle?.useCxOverMacron
        );
        if (!/ay|ey|oy/i.test(unaccentedGroup)) return vowelsGroup;
      }

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
 *   2. enforce rough breathings on rhos if `transliterationStyle.rho_rh` is enabled;
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
  const { isUpperCase, transliterationStyle } = options;

  transliteratedStr = transliteratedStr
    .replace(/\$\$/g, 'H')
    .replace(/\$/g, 'h');

  if (transliterationStyle?.rho_rh) {
    transliteratedStr = transliteratedStr
      .replace(new RegExp(`(r${SMOOTH_BREATHING}?r)(?!h)`, 'gi'), (m) =>
        m.toUpperCase() === m ? 'RRH' : 'rrh'
      )
      .replace(/(?<=\p{P}|\\s|^)(r)(?!h)/gimu, (m) =>
        // @fixme(v0.14): case should be checked against the current word.
        isUpperCase ? m + 'H' : m + 'h'
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
    .replace(/([aehiouw]{1,2})\(/gi, (m, vowelsGroup) => {
      // @fixme(v0.14): case should be checked against the current word too.
      if (isUpperCase) return '$$' + vowelsGroup;
      else {
        return vowelsGroup.charAt(0).toUpperCase() === vowelsGroup.charAt(0)
          ? '$$' + vowelsGroup.toLowerCase()
          : '$' + vowelsGroup;
      }
    })
    .replace(/(r{1,2})\(/gi, (m, rho) =>
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
  const { isUpperCase, transliterationStyle } = options;
  const { rho_rh } = transliterationStyle ?? {};

  const reInitialSmooth = new RegExp(`(?<=\\p{P}|\\s|^)([αεηιουω]{1,2})(${SMOOTH_BREATHING})`, 'gimu'); // prettier-ignore
  const reInitialRough = new RegExp(`([αεηιοωυ]{1,2})(${ROUGH_BREATHING})`, 'gi'); // prettier-ignore
  const reDoubleRhoLazy = new RegExp(`(ρ${SMOOTH_BREATHING}?ρ)${ROUGH_BREATHING}?`, 'gi'); //prettier-ignore
  const reInitialRho = new RegExp(`(ρ)${ROUGH_BREATHING}`, 'gi');
  const reInitialRhoLazy = new RegExp(`(?<=\\p{P}|\\s|^)(ρ)${ROUGH_BREATHING}?`, 'gimu'); // prettier-ignore

  return greekStr
    .normalize('NFD')
    .replace(reInitialSmooth, '$1')
    .replace(reInitialRough, (m, vowelsGroup) => {
      // @fixme(v0.14): case should be checked against the current word too.
      if (isUpperCase) return 'H' + vowelsGroup;
      else {
        return vowelsGroup.charAt(0).toUpperCase() === vowelsGroup.charAt(0)
          ? 'H' + vowelsGroup.toLowerCase()
          : 'h' + vowelsGroup;
      }
    })
    .replace(reDoubleRhoLazy, (m, doubleRho) =>
      doubleRho.toUpperCase() === doubleRho ? 'RRH' : 'rrh'
    )
    .replace(rho_rh ? reInitialRhoLazy : reInitialRho, (m, initialRho) =>
      isUpperCase ? initialRho + 'H' : initialRho + 'h'
    )
    .normalize();
}

/**
 * Returns a transliterated string with converted coronides,
 * following the given `coronisStyle`.
 */
function trApplyCoronis(
  transliteratedStr: string,
  coronisStyle?: Coronis
): string {
  transliteratedStr = transliteratedStr
    .normalize('NFD')
    .replace(
      new RegExp(`(?<=\\S)${Coronis.APOSTROPHE}(?=\\S)`, 'gu'),
      SMOOTH_BREATHING
    );

  switch (coronisStyle) {
    case Coronis.APOSTROPHE:
      transliteratedStr = transliteratedStr.replace(
        new RegExp(`(${SMOOTH_BREATHING})(\\p{M}*)`, 'gu'),
        (m, $1, $2) => $2 + Coronis.APOSTROPHE
      );
      break;

    case Coronis.NO:
      transliteratedStr = transliteratedStr.replace(
        new RegExp(SMOOTH_BREATHING, 'g'),
        ''
      );
      break;

    case Coronis.PSILI:
    default:
      transliteratedStr = transliteratedStr.replace(
        new RegExp(`(\\p{M}*)(${SMOOTH_BREATHING})`, 'gu'),
        (m, $1, $2) => $2 + $1
      );
      break;
  }

  return transliteratedStr.normalize();
}
