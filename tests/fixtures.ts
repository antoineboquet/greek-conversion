import type { ConversionOptions, Format } from "../src/mod.ts";

export interface Equivalence {
  greek: string;
  betaCode: string;
  transliteration: string;
}

export const EQUIVALENCES = [
  { greek: "ἄνθρωπος", betaCode: "a)/nqrwpos", transliteration: "ánthrōpos" },
  { greek: "Ἄϊδα", betaCode: "A)/i+da", transliteration: "Áïda" },
  { greek: "Ῥόδος", betaCode: "R(o/dos", transliteration: "Rhódos" },
  { greek: "αἴσθησις", betaCode: "ai)/sqhsis", transliteration: "aísthēsis" },
  { greek: "αἵρεσις", betaCode: "ai(/resis", transliteration: "haíresis" },
  { greek: "εὕρηκα", betaCode: "eu(/rhka", transliteration: "heúrēka" },
  { greek: "οὗτος", betaCode: "ou(=tos", transliteration: "hoũtos" },
  { greek: "ἄϋλος", betaCode: "a)/u+los", transliteration: "áülos" },
  { greek: "ὑΐδιον", betaCode: "u(i+/dion", transliteration: "huḯdion" },
  {
    greek: "πολύρριζος",
    betaCode: "polu/rrizos",
    transliteration: "polúrrhizos",
  },
  { greek: "ῥήτωρ", betaCode: "r(h/twr", transliteration: "rhḗtōr" },
  { greek: "ἄγγελος", betaCode: "a)/ggelos", transliteration: "ángelos" },
  { greek: "ἀγκών", betaCode: "a)gkw/n", transliteration: "ankṓn" },
  { greek: "σάλπιγξ", betaCode: "sa/lpigc", transliteration: "sálpinx" },
  { greek: "ἔλεγχος", betaCode: "e)/legxos", transliteration: "élenchos" },
  { greek: "ποιῇ", betaCode: "poih=|", transliteration: "poiȩ̄̃" },
  { greek: "ΠΟΙῌ͂", betaCode: "POIH=|", transliteration: "POIȨ̄̃" },
  { greek: "Αἶα", betaCode: "Ai)=a", transliteration: "Aĩa" },
  { greek: "Ἠώς", betaCode: "H)w/s", transliteration: "Ēṓs" },
  {
    greek: "ἀφ’, ἀλλ’.",
    betaCode: "a)f’, a)ll’.",
    transliteration: "aph’, all’.",
  },
  {
    greek: "Φίληβος ἢ Περὶ ἡδονῆς",
    betaCode: "Fi/lhbos h)\\ Peri\\ h(donh=s",
    transliteration: "Phílēbos ḕ Perì hēdonē̃s",
  },
  {
    greek: "Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων,",
    betaCode: "E(/llhsin e)ge/neto kai\\ me/rei tini\\ tw=n barba/rwn,",
    transliteration: "Héllēsin egéneto kaì mérei tinì tō̃n barbárōn,",
  },
  {
    greek: "ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.",
    betaCode: "w(s de\\ ei)pei=n kai\\ e)pi\\ plei=ston a)nqrw/pwn.",
    transliteration: "hōs dè eipeĩn kaì epì pleĩston anthrṓpōn.",
  },
] as const satisfies readonly Equivalence[];

export const ACCEPTED_ALIASES = [
  { format: "greek", input: "βάρϐαρος", transliteration: "bárbaros" },
  { format: "greek", input: "πολύῤῥιζος", transliteration: "polúrrhizos" },
  {
    format: "beta-code",
    input: "polu/r)r(izos",
    transliteration: "polúrrhizos",
  },
] as const satisfies readonly {
  format: Format;
  input: string;
  transliteration: string;
}[];

export interface LossyConversion {
  name: string;
  sourceFormat: Format;
  intermediateFormat: Format;
  source: string;
  intermediate: string;
  canonicalRoundTrip: string;
}

export const LOSSY_CONVERSIONS = [
  {
    name: "marked Greek double rho becomes canonical unmarked Greek",
    sourceFormat: "greek",
    intermediateFormat: "transliteration",
    source: "πολύῤῥιζος",
    intermediate: "polúrrhizos",
    canonicalRoundTrip: "πολύρριζος",
  },
  {
    name: "marked Beta Code double rho becomes canonical unmarked Beta Code",
    sourceFormat: "beta-code",
    intermediateFormat: "transliteration",
    source: "polu/r)r(izos",
    intermediate: "polúrrhizos",
    canonicalRoundTrip: "polu/rrizos",
  },
  {
    name: "medial coronis is not represented in transliteration",
    sourceFormat: "greek",
    intermediateFormat: "transliteration",
    source: "κἀγώ",
    intermediate: "kagṓ",
    canonicalRoundTrip: "καγώ",
  },
  {
    name:
      "crasis is preserved but its coronis is not represented in transliteration",
    sourceFormat: "greek",
    intermediateFormat: "transliteration",
    source: "τοὔνομα",
    intermediate: "toúnoma",
    canonicalRoundTrip: "τούνομα",
  },
  {
    name:
      "a smooth breathing on a quantity-marked vowel is not represented in transliteration",
    sourceFormat: "greek",
    intermediateFormat: "transliteration",
    source: "ἀ̄",
    intermediate: "ā",
    canonicalRoundTrip: "ᾱ",
  },
  {
    name: "nu before a velar converges to canonical nasal gamma",
    sourceFormat: "greek",
    intermediateFormat: "transliteration",
    source: "νγ",
    intermediate: "ng",
    canonicalRoundTrip: "γγ",
  },
  {
    name: "pi-sigma converges to psi through canonical Greek",
    sourceFormat: "beta-code",
    intermediateFormat: "greek",
    source: "ps",
    intermediate: "ψ",
    canonicalRoundTrip: "y",
  },
  {
    name: "beta-sigma converges to psi through canonical Greek",
    sourceFormat: "beta-code",
    intermediateFormat: "greek",
    source: "bs",
    intermediate: "ψ",
    canonicalRoundTrip: "y",
  },
  {
    name: "gamma-sigma converges to xi through canonical Greek",
    sourceFormat: "beta-code",
    intermediateFormat: "greek",
    source: "gs",
    intermediate: "ξ",
    canonicalRoundTrip: "c",
  },
  {
    name: "an elided smooth mute is aspirated before a rough breathing",
    sourceFormat: "transliteration",
    intermediateFormat: "greek",
    source: "ap’ hēmō̃n",
    intermediate: "ἀφ’ ἡμῶν",
    canonicalRoundTrip: "aph’ hēmō̃n",
  },
  {
    name: "archaic koppa converges to numeric koppa in transliteration",
    sourceFormat: "greek",
    intermediateFormat: "transliteration",
    source: "ϙ",
    intermediate: "q",
    canonicalRoundTrip: "ϟ",
  },
] as const satisfies readonly LossyConversion[];

export const SMOOTH_ROUGH_DOUBLE_RHO = {
  orthography: { doubleRho: "smooth-rough" },
} as const satisfies ConversionOptions;

export const MEDIAL_BETA_SYMBOL = {
  orthography: { medialBeta: "symbol" },
} as const satisfies ConversionOptions;

export const FORMATS = ["greek", "beta-code", "transliteration"] as const;

export function valueFor(equivalence: Equivalence, format: Format): string {
  switch (format) {
    case "greek":
      return equivalence.greek;
    case "beta-code":
      return equivalence.betaCode;
    case "transliteration":
      return equivalence.transliteration;
  }
}
