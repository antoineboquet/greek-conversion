export type DoubleRhoOrthography = "unmarked" | "smooth-rough";
export type MedialBetaOrthography = "standard" | "symbol";
export type CoronisOrthography = "omit" | "apostrophe" | "greek";

export interface OrthographyOptions {
  doubleRho?: DoubleRhoOrthography;
  medialBeta?: MedialBetaOrthography;
  coronis?: CoronisOrthography;
}

export interface ConversionOptions {
  orthography?: OrthographyOptions;
}
