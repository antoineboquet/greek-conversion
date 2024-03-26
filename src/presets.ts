import { AdditionalChar, Coronis, Preset } from './enums';
import { IConversionOptions, MixedPreset } from './interfaces';
import { notImplemented } from './utils';

const ALA_LC_SHARED_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: true,
  transliterationStyle: {
    gammaNasal_n: Preset.ALA_LC,
    upsilon_y: true,
    lunatesigma_s: true
  },
  additionalChars: [
    AdditionalChar.DIGAMMA,
    AdditionalChar.ARCHAIC_KOPPA,
    AdditionalChar.LUNATE_SIGMA
  ]
});

const ALA_LC_OPTIONS = (): IConversionOptions =>
  mergeOptions(ALA_LC_SHARED_OPTIONS(), {
    transliterationStyle: {
      rho_rh: true
    }
  });

const ALA_LC_MODERN_OPTIONS = (): IConversionOptions =>
  mergeOptions(ALA_LC_SHARED_OPTIONS(), {
    transliterationStyle: {
      beta_v: true,
      muPi_b: true,
      nuTau_d: true
    }
  });

const BNF_ADAPTED_OPTIONS = (): IConversionOptions => ({
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

const SBL_OPTIONS = (): IConversionOptions => ({
  removeDiacritics: true,
  transliterationStyle: {
    gammaNasal_n: true,
    rho_rh: true,
    upsilon_y: true
  }
});

const SIMPLE_BC_OPTIONS = (): IConversionOptions => ({
  additionalChars: AdditionalChar.ALL
});

const TLG_OPTIONS = (): IConversionOptions => ({
  betaCodeStyle: {
    useTLGStyle: true
  },
  additionalChars: AdditionalChar.ALL
});

export const applyPreset = (
  preset: Preset | MixedPreset
): IConversionOptions => {
  let options: IConversionOptions = {};
  let mixedOptions: IConversionOptions = {};

  if (Array.isArray(preset)) [preset, mixedOptions] = preset;

  switch (preset) {
    case Preset.ALA_LC:
      options = ALA_LC_OPTIONS();
      break;

    case Preset.ALA_LC_MODERN:
      options = ALA_LC_MODERN_OPTIONS();
      break;

    case Preset.BNF_ADAPTED:
      options = BNF_ADAPTED_OPTIONS();
      break;

    case Preset.ISO:
      options = ISO_OPTIONS();
      break;

    case Preset.SIMPLE_BC:
      options = SIMPLE_BC_OPTIONS();
      break;

    case Preset.SBL:
      options = SBL_OPTIONS();
      break;

    case Preset.TLG:
      options = TLG_OPTIONS();
      break;

    default:
      notImplemented('Preset', preset);
  }

  return Object.keys(mixedOptions).length
    ? mergeOptions(options, mixedOptions)
    : options;
};

const mergeOptions = (
  target: IConversionOptions,
  source: IConversionOptions
): IConversionOptions => {
  const isObject = (obj: object): boolean => obj && typeof obj === 'object';

  for (const key in source) {
    if (Array.isArray(target[key]) && Array.isArray(source[key])) {
      target[key] = target[key].concat(source[key]);
    } else if (isObject(target[key]) && isObject(source[key])) {
      target[key] = { ...target[key], ...source[key] };
    } else {
      target[key] = source[key];
    }
  }

  return target;
};
