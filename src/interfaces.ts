import { additionalLetters } from './enums';

export interface IConversionOptions {
  preserveWhitespace?: boolean;
  removeDiacritics?: boolean;
  useAdditionalLetters?: additionalLetters | additionalLetters[];
  setBetaCodeStyle?: IBetaCodeStyle;
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?: ITransliterationStyle;
}

export interface IBetaCodeStyle {
  //useClassical?: boolean;
}

export interface IGreekStyle {
  disableBetaVariant?: boolean;
}

export interface ITransliterationStyle {
  useCxOverMacron?: boolean;
  xi_ks?: boolean;
  chi_kh?: boolean;
  //upsilon_y?: boolean;
}
