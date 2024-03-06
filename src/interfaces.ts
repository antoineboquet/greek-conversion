import { AdditionalChar, Preset } from './enums';

export interface IConversionOptions {
  removeDiacritics?: boolean;
  removeExtraWhitespace?: boolean;
  //setBetaCodeStyle?: IBetaCodeStyle;
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?: ITransliterationStyle;
  useAdditionalChars?: AdditionalChar[] | AdditionalChar;
}

export interface IInternalConversionOptions extends IConversionOptions {
  isUpperCase?: boolean;
}

export type MixedPreset = [Preset, IConversionOptions];

// v0.13
/*export interface IBetaCodeStyle {
  useTLGStyle?: boolean;
}*/

export interface IGreekStyle {
  disableBetaVariant?: boolean;
  useLunateSigma?: boolean;
}

export interface IMappingProperty {
  gr: string;
  bc?: string;
  tr?: string;
}

export interface ITransliterationStyle {
  useCxOverMacron?: boolean;
  beta_v?: boolean;
  eta_i?: boolean;
  xi_ks?: boolean;
  rho_rh?: boolean;
  phi_f?: boolean;
  chi_kh?: boolean;
  upsilon_y?: boolean;
  lunatesigma_s?: boolean;
}
