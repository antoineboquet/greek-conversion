/** Controls marks added to a pair of consecutive rho in Greek output. */
export type DoubleRhoOrthography = "unmarked" | "smooth-rough";

/** Selects standard beta or the medial lowercase symbol `ϐ` in Greek output. */
export type MedialBetaOrthography = "standard" | "symbol";

/** Selects how a semantic coronis is represented in transliteration. */
export type CoronisOrthography = "omit" | "apostrophe" | "greek";

/** Selects contextual nasal gamma (`n`) or literal gamma (`g`). */
export type NasalGammaOrthography = "nasal" | "literal";

/** Selects standard or lunate sigma in Greek and Beta Code output. */
export type SigmaOrthography = "standard" | "lunate";

/** Selects contextual final sigma or a uniform medial sigma in Greek output. */
export type FinalSigmaOrthography = "contextual" | "medial";

/** Preserves marked alphabetic numerals or renders valid groups as decimals. */
export type NumeralOrthography = "alphabetic" | "decimal";

/** Preserves a dental before sigma or applies the lossy assimilation. */
export type DentalSigmaOrthography = "preserve" | "assimilate";

/** Selects the transliterated spelling of upsilon. */
export type UpsilonOrthography = "u" | "y" | "y-with-diphthong-u";

/**
 * Selects whether structural eta and omega length is shown by macron or
 * circumflex in transliteration. Explicit philological macrons remain
 * independent semantic marks.
 */
export type LongVowelOrthography =
  | "macron"
  | "circumflex";

/** Selects polytonic output or a mechanical, lossy monotonic transformation. */
export type GreekAccentuation = "polytonic" | "monotonic";

/** Selects composed or canonically decomposed Greek Unicode output. */
export type UnicodeComposition = "composed" | "decomposed";

/** Selects the composed Unicode form used for eligible acute vowels. */
export type GreekAcuteForm = "system" | "tonos" | "oxia";

/** Selects the Unicode scalar used for Greek question marks. */
export type GreekQuestionMarkForm = "canonical" | "semicolon" | "greek";

/** Selects the Unicode scalar used for Greek ano teleia. */
export type GreekAnoTeleiaForm = "canonical" | "middle-dot" | "greek";

/** Preserves whitespace or collapses each Unicode whitespace run. */
export type WhitespaceOrthography = "preserve" | "collapse";

/** Selects `b` or modern `v` for beta in transliteration. */
export type BetaTransliteration = "b" | "v";

/** Selects `ē` or `ī` for eta in transliteration. */
export type EtaTransliteration = "ē" | "ī";

/** Selects `x` or `ks` for xi in transliteration. */
export type XiTransliteration = "x" | "ks";

/** Selects `ph` or `f` for phi in transliteration. */
export type PhiTransliteration = "ph" | "f";

/** Selects `ch` or `kh` for chi in transliteration. */
export type ChiTransliteration = "ch" | "kh";

/** Selects preservation or a supported modern-Greek digraph policy. */
export type ModernDigraphOrthography = "preserve" | "phonetic" | "ala-lc";

/** Selects contextual rho spelling or one final `h` per contiguous rho group. */
export type RhoTransliteration = "contextual" | "systematic";

/** Selects the mechanical case transformation applied during rendering. */
export type LetterCaseOrthography =
  | "preserve"
  | "lowercase"
  | "uppercase"
  | "title";

/** Preserves or removes one semantic class of diacritics. */
export type DiacriticDisposition = "preserve" | "remove";

/** Identifies a bundled, standards-oriented conversion configuration. */
export type Preset =
  | "iso-843-type-1"
  | "ala-lc-ancient"
  | "ala-lc-modern"
  | "sbl-academic"
  | "sbl-general"
  | "tlg-core"
  | "bnf-core";

/** Granular rendering policy for semantic diacritic classes. */
export interface DiacriticOptions {
  /** Accent marks: acute, grave, and circumflex. Defaults to `"preserve"`. */
  accents?: DiacriticDisposition;
  /** Initial smooth breathing marks. Defaults to `"preserve"`. */
  smoothBreathing?: DiacriticDisposition;
  /** Initial rough breathing marks. Defaults to `"preserve"`. */
  roughBreathing?: DiacriticDisposition;
  /** Internal coronides marking crasis. Defaults to `"preserve"`. */
  coronis?: DiacriticDisposition;
  /** Diaeresis marks. Defaults to `"preserve"`. */
  diaeresis?: DiacriticDisposition;
  /** Iota subscripts. Defaults to `"preserve"`. */
  iotaSubscript?: DiacriticDisposition;
  /** Explicit macron and breve quantity marks. Defaults to `"preserve"`. */
  quantity?: DiacriticDisposition;
}

/** Orthographic and transliteration policies applied during rendering. */
export interface OrthographyOptions {
  /** Double-rho marks in Greek output. Defaults to `"unmarked"`. */
  doubleRho?: DoubleRhoOrthography;
  /** Medial lowercase beta glyph. Defaults to `"standard"`. */
  medialBeta?: MedialBetaOrthography;
  /** Coronis representation in transliteration. Defaults to `"omit"`. */
  coronis?: CoronisOrthography;
  /** Nasal gamma spelling. Defaults to `"nasal"`. */
  nasalGamma?: NasalGammaOrthography;
  /** Sigma glyph policy. Defaults to `"standard"`. */
  sigma?: SigmaOrthography;
  /** Lowercase final sigma policy in Greek output. Defaults to `"contextual"`. */
  finalSigma?: FinalSigmaOrthography;
  /** Alphabetic or decimal numeral output. Defaults to `"alphabetic"`. */
  numerals?: NumeralOrthography;
  /** Dental assimilation before sigma. Defaults to `"preserve"`. */
  dentalSigma?: DentalSigmaOrthography;
  /** Upsilon transliteration. Defaults to `"u"`. */
  upsilon?: UpsilonOrthography;
  /** Structural long-vowel marker: `"macron"` or `"circumflex"`. */
  longVowels?: LongVowelOrthography;
  /** Greek accentuation system. Defaults to `"polytonic"`. */
  accentuation?: GreekAccentuation;
  /** Whitespace rendering. Defaults to `"preserve"`. */
  whitespace?: WhitespaceOrthography;
  /** Beta transliteration. Defaults to `"b"`. */
  beta?: BetaTransliteration;
  /** Eta transliteration. Defaults to `"ē"`. */
  eta?: EtaTransliteration;
  /** Xi transliteration. Defaults to `"x"`. */
  xi?: XiTransliteration;
  /** Phi transliteration. Defaults to `"ph"`. */
  phi?: PhiTransliteration;
  /** Chi transliteration. Defaults to `"ch"`. */
  chi?: ChiTransliteration;
  /** Modern-Greek digraph policy. Defaults to `"preserve"`. */
  modernDigraphs?: ModernDigraphOrthography;
  /** Rho transliteration. Defaults to `"contextual"`. */
  rho?: RhoTransliteration;
  /** Mechanical output case. Defaults to `"preserve"`. */
  letterCase?: LetterCaseOrthography;
}

/** Unicode representation preferences for Greek output. */
export interface GreekUnicodeOptions {
  /** Composed or decomposed output. Defaults to `"composed"`. */
  composition?: UnicodeComposition;
  /** Tonos/oxia preference for eligible acute vowels. Defaults to `"system"`. */
  acute?: GreekAcuteForm;
  /** Greek question-mark scalar. Defaults to `"canonical"`. */
  questionMark?: GreekQuestionMarkForm;
  /** Greek ano-teleia scalar. Defaults to `"canonical"`. */
  anoTeleia?: GreekAnoTeleiaForm;
}

/** Options shared by conversion functions, helpers, and {@link GreekText}. */
export interface ConversionOptions {
  /** Named configuration applied before custom fields. */
  preset?: Preset;
  /** Orthographic and transliteration policies. */
  orthography?: OrthographyOptions;
  /** Greek Unicode representation preferences. */
  unicode?: GreekUnicodeOptions;
  /** Selective diacritic rendering policies. */
  diacritics?: DiacriticOptions;
  /**
   * Removes every removable diacritic. This shorthand overrides selective
   * preservation in {@link diacritics}.
   */
  removeDiacritics?: boolean;
}
