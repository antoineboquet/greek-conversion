import { additionalChars, style } from './enums';

export interface IConversionOptions {
  preserveWhitespace?: boolean;
  removeDiacritics?: boolean;
  useAdditionalChars?: additionalChars[] | additionalChars;
  setBetaCodeStyle?: BetaCodeStyle;
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?:
    | style.ALA_LC
    | style.BNF
    | style.SBL
    | ITransliterationStyle;
}

export type BetaCodeStyle = style.MODERN | style.TLG;

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
