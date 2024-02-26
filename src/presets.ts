import { AdditionalChar, MixedPreset, Preset } from './enums';
import { IConversionOptions } from './interfaces';

const ALA_LC_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: true,
  useAdditionalChars: [
    AdditionalChar.DIGAMMA,
    AdditionalChar.ARCHAIC_KOPPA,
    AdditionalChar.LUNATE_SIGMA
  ],
  setTransliterationStyle: {
    rho_rh: true,
    upsilon_y: true,
    lunatesigma_s: true
  }
});

const BNF_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: false,
  useAdditionalChars: [
    AdditionalChar.DIGAMMA,
    AdditionalChar.YOT,
    AdditionalChar.LUNATE_SIGMA,
    AdditionalChar.STIGMA,
    AdditionalChar.KOPPA,
    AdditionalChar.SAMPI
  ]
});

const MODERN_BC_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: false,
  useAdditionalChars: AdditionalChar.ALL
});

const SBL_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: true,
  setTransliterationStyle: {
    rho_rh: true,
    upsilon_y: true
  }
});

const TLG_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: false,
  useAdditionalChars: AdditionalChar.ALL
  /*setBetaCodeStyle: {
    useTLGStyle: true
  }*/
});

export function applyPreset(preset: Preset | MixedPreset): IConversionOptions {
  let options: IConversionOptions = {};
  let mixedOptions: IConversionOptions = {};

  if (Array.isArray(preset)) {
    [preset, mixedOptions] = preset;
  }

  switch (preset) {
    case Preset.ALA_LC:
      options = ALA_LC_OPTIONS();
      break;

    case Preset.BNF:
      options = BNF_OPTIONS();
      break;

    case Preset.MODERN_BC:
      options = MODERN_BC_OPTIONS();
      break;

    case Preset.SBL:
      options = SBL_OPTIONS();
      break;

    // v0.13
    /*case Preset.TLG:
      options = TLG_OPTIONS();
      break;*/

    default:
      console.warn(`preset '${options}' is not implemented.`);
  }

  if (Object.keys(mixedOptions).length !== 0) {
    mergeOptions(options, mixedOptions);
  }

  return options;
}

function mergeOptions(target: IConversionOptions, source: IConversionOptions) {
  const isObject = (obj) => obj && typeof obj === 'object';

  for (const key in source) {
    if (Array.isArray(target[key]) && Array.isArray(source[key])) {
      target[key] = target[key].concat(source[key]);
    } else if (isObject(target[key]) && isObject(source[key])) {
      mergeOptions(Object.assign({}, target[key]), source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}
