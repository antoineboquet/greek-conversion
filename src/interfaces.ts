import { additionalLetters } from './enums';

export interface IConversionOptions {
  preserveWhitespace?: boolean;
  removeDiacritics?: boolean;
  useAdditionalLetters?: additionalLetters | additionalLetters[];
  setGreekStyle?: IGreekStyle;
  setTransliterationStyle?: ITransliterationStyle;
}

export interface IGreekStyle {
  disableBetaVariant?: boolean;
  useSemicolonAsQuestionMark?: boolean;
}

export interface ITransliterationStyle {
  useCxOverMacron?: boolean;
  xi_ks?: boolean;
  chi_kh?: boolean;
  //upsilon_y?: boolean;
}
