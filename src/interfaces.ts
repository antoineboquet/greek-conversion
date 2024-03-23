import { AdditionalChar, Coronis, Preset } from './enums';

export interface IConversionOptions {
  removeDiacritics?: boolean;
  removeExtraWhitespace?: boolean;
  betaCodeStyle?: IBetaCodeStyle;
  greekStyle?: IGreekStyle;
  transliterationStyle?: ITransliterationStyle;
  additionalChars?: AdditionalChar[] | AdditionalChar;
}

export interface IInternalConversionOptions extends IConversionOptions {
  isUpperCase?: boolean;
}

export type MixedPreset = [Preset, IConversionOptions];

export interface IBetaCodeStyle {
  skipSanitization?: boolean;
  useTLGStyle?: boolean;
}

export interface IGreekStyle {
  disableBetaVariant?: boolean;
  useGreekQuestionMark?: boolean;
  useLunateSigma?: boolean;
  useMonotonicOrthography?: boolean;
}

export interface IMappingProperty {
  gr: string;
  bc?: string;
  tr?: string;
  trBase?: string; // self-conversion: transliterated chars without alteration.
}

export interface ITransliterationStyle {
  setCoronisStyle?: Coronis;
  useCxOverMacron?: boolean;
  beta_v?: boolean;
  gammaNasal_n?: boolean | Preset.ALA_LC /* | Preset.ISO_T2*/; // (¹)
  eta_i?: boolean;
  muPi_b?: boolean;
  nuTau_d?: boolean;
  xi_ks?: boolean;
  rho_rh?: boolean;
  phi_f?: boolean;
  chi_kh?: boolean;
  upsilon_y?: boolean | Preset.ISO; // (²)
  lunatesigma_s?: boolean;
}

// ¹ `Preset.ALA_LC`: preserve 'gk' initially and finally;
//   `Preset.ISO_T2`: always preserve 'gk'.
//   (Note that this is undoubtedly poorly designed.)

// ² `Preset.ISO`: only preserve 'au', 'eu', 'ou' diphthongs.
//   (Note that this is undoubtedly poorly designed.)
