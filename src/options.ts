export type DoubleRhoOrthography = "unmarked" | "smooth-rough";
export type MedialBetaOrthography = "standard" | "symbol";
export type CoronisOrthography = "omit" | "apostrophe" | "greek";
export type NasalGammaOrthography = "nasal" | "literal";
export type SigmaOrthography = "standard" | "lunate";
export type NumeralOrthography = "alphabetic" | "decimal";
export type DentalSigmaOrthography = "preserve" | "assimilate";
export type UpsilonOrthography = "u" | "y" | "y-with-diphthong-u";
export type LongVowelOrthography =
  | "macron"
  | "circumflex"
  | "circumflex-macron";

export interface OrthographyOptions {
  doubleRho?: DoubleRhoOrthography;
  medialBeta?: MedialBetaOrthography;
  coronis?: CoronisOrthography;
  nasalGamma?: NasalGammaOrthography;
  sigma?: SigmaOrthography;
  numerals?: NumeralOrthography;
  dentalSigma?: DentalSigmaOrthography;
  upsilon?: UpsilonOrthography;
  longVowels?: LongVowelOrthography;
}

export interface ConversionOptions {
  orthography?: OrthographyOptions;
}
