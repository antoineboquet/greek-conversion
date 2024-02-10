import { AdditionalChars, Style } from './enums';

export interface IConversionOptions {
  preserveWhitespace?: boolean;
  removeDiacritics?: boolean;
  useAdditionalChars?: AdditionalChars[] | AdditionalChars;
  setBetaCodeStyle?: BetaCodeStyle;
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?:
    | Style.ALA_LC
    | Style.BNF
    | Style.SBL
    | ITransliterationStyle;
}

export type BetaCodeStyle = Style.MODERN | Style.TLG;

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
  chi_kh?: boolean;
  upsilon_y?: boolean;
}
