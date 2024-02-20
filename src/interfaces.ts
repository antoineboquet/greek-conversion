import { AdditionalChars } from './enums';

export interface IConversionOptions {
  removeDiacritics?: boolean;
  removeExtraWhitespace?: boolean;
  //setBetaCodeStyle?: IBetaCodeStyle;
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?: ITransliterationStyle;
  useAdditionalChars?: AdditionalChars[] | AdditionalChars;
}

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
  xi_ks?: boolean;
  rho_rh?: boolean;
  chi_kh?: boolean;
  upsilon_y?: boolean;
  lunatesigma_s?: boolean;
}
