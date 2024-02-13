import { AdditionalChars } from './enums';

export interface IConversionOptions {
  preserveWhitespace?: boolean;
  removeDiacritics?: boolean;
  useAdditionalChars?: AdditionalChars[] | AdditionalChars;
  setBetaCodeStyle?: IBetaCodeStyle;
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?: ITransliterationStyle;
}

export interface IBetaCodeStyle {
  useTLGStyle?: boolean;
}

export interface IGreekStyle {
  disableBetaVariant?: boolean;
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
