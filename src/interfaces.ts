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
  useTLGStyle?: boolean;
}

export interface IGreekStyle {
  disableBetaVariant?: boolean;
  useGreekQuestionMark?: boolean;
  useLunateSigma?: boolean;
}

export interface IMappingProperty {
  gr: string;
  bc?: string;
  tr?: string;
}

export interface ITransliterationStyle {
  setCoronisStyle?: Coronis;
  useCxOverMacron?: boolean;
  beta_v?: boolean;
  eta_i?: boolean;
  xi_ks?: boolean;
  rho_rh?: boolean;
  phi_f?: boolean;
  chi_kh?: boolean;
  upsilon_y?: boolean | Preset.ISO; // (¹)
  lunatesigma_s?: boolean;
}

// ¹ Preset.ISO: only preserve 'au', 'eu', 'ou'.
//   Note that this is undoubtedly poorly designed.
