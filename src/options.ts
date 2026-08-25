export type DoubleRhoOrthography = "unmarked" | "smooth-rough";
export type MedialBetaOrthography = "standard" | "symbol";

export interface OrthographyOptions {
  doubleRho?: DoubleRhoOrthography;
  medialBeta?: MedialBetaOrthography;
}

export interface ConversionOptions {
  orthography?: OrthographyOptions;
}
