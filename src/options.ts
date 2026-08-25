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
export type GreekAccentuation = "polytonic" | "monotonic";
export type UnicodeComposition = "composed" | "decomposed";
export type GreekAcuteForm = "system" | "tonos" | "oxia";
export type GreekQuestionMarkForm = "canonical" | "semicolon" | "greek";
export type GreekAnoTeleiaForm = "canonical" | "middle-dot" | "greek";
export type WhitespaceOrthography = "preserve" | "collapse";
export type BetaTransliteration = "b" | "v";
export type EtaTransliteration = "ē" | "ī";
export type XiTransliteration = "x" | "ks";
export type PhiTransliteration = "ph" | "f";
export type ChiTransliteration = "ch" | "kh";
export type ModernDigraphOrthography = "preserve" | "phonetic" | "ala-lc";
export type RhoTransliteration = "contextual" | "systematic";

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
  accentuation?: GreekAccentuation;
  whitespace?: WhitespaceOrthography;
  beta?: BetaTransliteration;
  eta?: EtaTransliteration;
  xi?: XiTransliteration;
  phi?: PhiTransliteration;
  chi?: ChiTransliteration;
  modernDigraphs?: ModernDigraphOrthography;
  rho?: RhoTransliteration;
}

export interface GreekUnicodeOptions {
  composition?: UnicodeComposition;
  acute?: GreekAcuteForm;
  questionMark?: GreekQuestionMarkForm;
  anoTeleia?: GreekAnoTeleiaForm;
}

export interface ConversionOptions {
  orthography?: OrthographyOptions;
  unicode?: GreekUnicodeOptions;
  removeDiacritics?: boolean;
}
