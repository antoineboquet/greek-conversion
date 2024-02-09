import { additionalLetters, keyType, style } from './enums';

export interface IConversionOptions {
  preserveWhitespace?: boolean;
  removeDiacritics?: boolean;
  useAdditionalLetters?: additionalLetters | additionalLetters[];
  setBetaCodeStyle?: style.MODERN | style.TLG;
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?:
    | ITransliterationStyle
    | style.ALA_LC
    | style.BNF
    | style.SBL;
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
