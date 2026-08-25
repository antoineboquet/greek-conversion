export type Format = "greek" | "beta-code" | "transliteration";

export type Letter =
  | "alpha"
  | "beta"
  | "gamma"
  | "delta"
  | "epsilon"
  | "zeta"
  | "eta"
  | "theta"
  | "iota"
  | "kappa"
  | "lambda"
  | "mu"
  | "nu"
  | "xi"
  | "omicron"
  | "pi"
  | "rho"
  | "sigma"
  | "tau"
  | "upsilon"
  | "phi"
  | "chi"
  | "psi"
  | "omega"
  | "digamma"
  | "yot"
  | "stigma"
  | "koppa"
  | "archaic-koppa"
  | "sampi";

export type Diacritic =
  | "smooth"
  | "coronis"
  | "rough"
  | "acute"
  | "grave"
  | "circumflex"
  | "diaeresis"
  | "iota-subscript"
  | "macron"
  | "breve";

export interface Grapheme {
  kind: "grapheme";
  letter: Letter;
  uppercase: boolean;
  diacritics: Set<Diacritic>;
}

export interface Literal {
  kind: "literal";
  value: string;
}

export type Token = Grapheme | Literal;

export type Document = readonly Token[];

export const grapheme = (
  letter: Letter,
  uppercase = false,
  diacritics: Iterable<Diacritic> = [],
): Grapheme => ({
  kind: "grapheme",
  letter,
  uppercase,
  diacritics: new Set(diacritics),
});

export const literal = (value: string): Literal => ({ kind: "literal", value });
