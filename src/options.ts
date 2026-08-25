export type DoubleRhoOrthography = "unmarked" | "smooth-rough";
export type MedialBetaOrthography = "standard" | "symbol";
export type CoronisOrthography = "omit" | "apostrophe" | "greek";
export type NasalGammaOrthography = "nasal" | "literal";
export type SigmaOrthography = "standard" | "lunate";

export interface OrthographyOptions {
  doubleRho?: DoubleRhoOrthography;
  medialBeta?: MedialBetaOrthography;
  coronis?: CoronisOrthography;
  nasalGamma?: NasalGammaOrthography;
  sigma?: SigmaOrthography;
}

export interface ConversionOptions {
  orthography?: OrthographyOptions;
}
