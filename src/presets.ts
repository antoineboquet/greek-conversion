import { AdditionalChar, Coronis, Preset } from './enums';
import { IConversionOptions, MixedPreset } from './interfaces';

const ALA_LC_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: true,
  transliterationStyle: {
    gammaNasal_n: true,
    rho_rh: true,
    upsilon_y: true,
    lunatesigma_s: true
  },
  additionalChars: [
    AdditionalChar.DIGAMMA,
    AdditionalChar.ARCHAIC_KOPPA,
    AdditionalChar.LUNATE_SIGMA
  ]
});

const BNF_OPTIONS = (): IConversionOptions => ({
  greekStyle: {
    useGreekQuestionMark: true
  },
  transliterationStyle: {
    upsilon_y: Preset.ISO
  },
  additionalChars: [
    AdditionalChar.DIGAMMA,
    AdditionalChar.YOT,
    AdditionalChar.LUNATE_SIGMA,
    AdditionalChar.STIGMA,
    AdditionalChar.KOPPA,
    AdditionalChar.SAMPI
  ]
});

const ISO_OPTIONS = (): IConversionOptions => ({
  transliterationStyle: {
    setCoronisStyle: Coronis.APOSTROPHE,
    beta_v: true,
    eta_i: true,
    phi_f: true,
    upsilon_y: Preset.ISO,
    lunatesigma_s: true
  },
  additionalChars: [
    AdditionalChar.DIGAMMA,
    AdditionalChar.YOT,
    AdditionalChar.LUNATE_SIGMA
  ]
});

const MODERN_BC_OPTIONS = (): IConversionOptions => ({
  additionalChars: AdditionalChar.ALL
});

const SBL_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: true,
  transliterationStyle: {
    gammaNasal_n: true,
    rho_rh: true,
    upsilon_y: true
  }
});

const TLG_OPTIONS = (): IConversionOptions => ({
  betaCodeStyle: {
    useTLGStyle: true
  },
  additionalChars: AdditionalChar.ALL
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

    case Preset.ISO:
      options = ISO_OPTIONS();
      break;

    case Preset.MODERN_BC:
      options = MODERN_BC_OPTIONS();
      break;

    case Preset.SBL:
      options = SBL_OPTIONS();
      break;

    case Preset.TLG:
      options = TLG_OPTIONS();
      break;

    default:
      throw new RangeError(`Preset '${preset}' is not implemented.`);
  }

  if (Object.keys(mixedOptions).length !== 0) {
    mergeOptions(options, mixedOptions);
  }

  return options;
}

function mergeOptions(target: IConversionOptions, source: IConversionOptions) {
  const isObject = (obj: object) => obj && typeof obj === 'object';

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
