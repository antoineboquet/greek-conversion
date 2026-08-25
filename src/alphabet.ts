import type { Diacritic, Letter } from "./model.ts";

export interface Forms {
  greek: string;
  beta: string;
  tr: string;
}

export const ALPHABET: Record<Letter, Forms> = {
  alpha: { greek: "α", beta: "a", tr: "a" },
  beta: { greek: "β", beta: "b", tr: "b" },
  gamma: { greek: "γ", beta: "g", tr: "g" },
  delta: { greek: "δ", beta: "d", tr: "d" },
  epsilon: { greek: "ε", beta: "e", tr: "e" },
  zeta: { greek: "ζ", beta: "z", tr: "z" },
  eta: { greek: "η", beta: "h", tr: "ē" },
  theta: { greek: "θ", beta: "q", tr: "th" },
  iota: { greek: "ι", beta: "i", tr: "i" },
  kappa: { greek: "κ", beta: "k", tr: "k" },
  lambda: { greek: "λ", beta: "l", tr: "l" },
  mu: { greek: "μ", beta: "m", tr: "m" },
  nu: { greek: "ν", beta: "n", tr: "n" },
  xi: { greek: "ξ", beta: "c", tr: "x" },
  omicron: { greek: "ο", beta: "o", tr: "o" },
  pi: { greek: "π", beta: "p", tr: "p" },
  rho: { greek: "ρ", beta: "r", tr: "r" },
  sigma: { greek: "σ", beta: "s", tr: "s" },
  tau: { greek: "τ", beta: "t", tr: "t" },
  upsilon: { greek: "υ", beta: "u", tr: "u" },
  phi: { greek: "φ", beta: "f", tr: "ph" },
  chi: { greek: "χ", beta: "x", tr: "ch" },
  psi: { greek: "ψ", beta: "y", tr: "ps" },
  omega: { greek: "ω", beta: "w", tr: "ō" },
  digamma: { greek: "ϝ", beta: "v", tr: "w" },
  stigma: { greek: "ϛ", beta: "#2", tr: "c\u0304" },
  koppa: { greek: "ϟ", beta: "#1", tr: "q" },
  "archaic-koppa": { greek: "ϙ", beta: "#3", tr: "q" },
  sampi: { greek: "ϡ", beta: "#5", tr: "s\u0304" },
};

const reverse = (key: keyof Forms) =>
  new Map(
    Object.entries(ALPHABET).map((
      [letter, forms],
    ) => [forms[key], letter as Letter]),
  );

export const BY_GREEK = reverse("greek");
export const BY_BETA = reverse("beta");

BY_GREEK.set("ϐ", "beta");
BY_GREEK.set("ϲ", "sigma");

export const GREEK_MARKS = new Map<string, Diacritic>([
  ["\u0313", "smooth"],
  ["\u0314", "rough"],
  ["\u0301", "acute"],
  ["\u0300", "grave"],
  ["\u0342", "circumflex"],
  ["\u0302", "circumflex"],
  ["\u0308", "diaeresis"],
  ["\u0345", "iota-subscript"],
  ["\u0304", "macron"],
  ["\u0306", "breve"],
]);

export const GREEK_FOR: Record<Diacritic, string> = {
  smooth: "\u0313",
  coronis: "\u0313",
  rough: "\u0314",
  acute: "\u0301",
  grave: "\u0300",
  circumflex: "\u0342",
  diaeresis: "\u0308",
  "iota-subscript": "\u0345",
  macron: "\u0304",
  breve: "\u0306",
};

export const BETA_FOR: Record<Diacritic, string> = {
  smooth: ")",
  coronis: ")",
  rough: "(",
  acute: "/",
  grave: "\\",
  circumflex: "=",
  diaeresis: "+",
  "iota-subscript": "|",
  macron: "&",
  breve: "'",
};

export const BETA_MARKS = new Map(
  Object.entries(BETA_FOR).map(([name, mark]) => [mark, name as Diacritic]),
);

BETA_MARKS.set(")", "smooth");

export const ORDER: readonly Diacritic[] = [
  "smooth",
  "coronis",
  "rough",
  "diaeresis",
  "acute",
  "grave",
  "circumflex",
  "macron",
  "breve",
  "iota-subscript",
];
