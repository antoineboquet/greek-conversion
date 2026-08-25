export type DoubleRhoOrthography = "unmarked" | "smooth-rough";

export interface OrthographyOptions {
  doubleRho?: DoubleRhoOrthography;
}

export interface ConversionOptions {
  orthography?: OrthographyOptions;
}
