import { additionalChars, keyType, style } from './enums';

export interface IConversionOptions {
  preserveWhitespace?: boolean;
  removeDiacritics?: boolean;
  useAdditionalChars?: additionalChars | additionalChars[];
  setBetaCodeStyle?: style.MODERN | style.TLG;
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?:
    | style.ALA_LC
    | style.BNF
    | style.SBL
    | ITransliterationStyle;
}

export interface IGreekStyle {
  disableBetaVariant?: boolean;
}

export interface ITransliterationStyle {
  useCxOverMacron?: boolean;
  xi_ks?: boolean;
  chi_kh?: boolean;
  upsilon_y?: boolean;
}
