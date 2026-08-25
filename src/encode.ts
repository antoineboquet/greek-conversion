import { ALPHABET, BETA_FOR, GREEK_FOR, ORDER } from "./alphabet.ts";
import {
  breathingTarget,
  contractedPsiUppercase,
  initialBreathingStart,
  isNasalGamma,
  isWordFinal,
  isWordInitial,
} from "./context.ts";
import type { Diacritic, Document, Grapheme } from "./model.ts";
import type { ConversionOptions } from "./options.ts";

const marks = (token: Grapheme) =>
  ORDER.filter((mark) => token.diacritics.has(mark));

export function encodeGreek(doc: Document, options: ConversionOptions = {}) {
  let out = "";

  for (let i = 0; i < doc.length; i++) {
    const token = doc[i];

    if (token.kind === "literal") {
      out += token.value;
      continue;
    }

    const psiUppercase = contractedPsiUppercase(doc, i);

    if (psiUppercase !== undefined) {
      const psi = ALPHABET.psi.greek;
      out += psiUppercase ? psi.toLocaleUpperCase("el") : psi;
      i++;
      continue;
    }

    let base = ALPHABET[token.letter].greek;

    if (token.letter === "sigma" && isWordFinal(doc, i)) base = "ς";
    if (
      token.letter === "beta" &&
      !token.uppercase &&
      options.orthography?.medialBeta === "symbol" &&
      !isWordInitial(doc, i)
    ) {
      base = "ϐ";
    }
    if (token.uppercase) base = base.toLocaleUpperCase("el");

    out += base + marks(token).map((mark) => GREEK_FOR[mark]).join("");
  }

  return out.normalize("NFC");
}

export function encodeBetaCode(doc: Document) {
  return doc.map((token) => {
    if (token.kind === "literal") return token.value;
    let base = ALPHABET[token.letter].beta;
    if (token.uppercase) base = base.toUpperCase();
    return base + marks(token).map((mark) => BETA_FOR[mark]).join("");
  }).join("");
}

export function encodeTransliteration(
  doc: Document,
  options: ConversionOptions = {},
) {
  return doc.map((token, index) => {
    if (token.kind === "literal") return token.value;

    const previous = doc[index - 1];
    const breathingStart = initialBreathingStart(doc, index);
    const breathingIndex = breathingStart === undefined
      ? undefined
      : breathingTarget(doc, breathingStart);
    const breathingToken = breathingIndex === undefined
      ? undefined
      : doc[breathingIndex];
    const initialRough = breathingToken?.kind === "grapheme" &&
      breathingToken.diacritics.has("rough");
    const groupUppercase = initialRough && breathingStart !== undefined &&
      (doc[breathingStart].kind === "grapheme" &&
          doc[breathingStart].uppercase ||
        breathingToken.uppercase);
    let base = isNasalGamma(doc, index) ? "n" : ALPHABET[token.letter].tr;
    if (token.uppercase && !groupUppercase) {
      base = base[0].toUpperCase() + base.slice(1);
    }
    if (initialRough && index === breathingStart) {
      base = (groupUppercase ? "H" : "h") + base.toLowerCase();
    } else if (
      token.diacritics.has("rough") && index !== breathingIndex
    ) {
      if (token.letter === "rho") base = base + "h";
      else if (token.uppercase) base = "H" + base.toLowerCase();
      else base = "h" + base;
    } else if (
      token.letter === "rho" &&
      previous?.kind === "grapheme" &&
      previous.letter === "rho"
    ) {
      base += "h";
    }
    const tokenMarks = marks(token);
    const transliteratedMarks = tokenMarks
      .filter((mark) => mark !== "coronis")
      .map((mark) => trMark(mark, options))
      .join("");
    const coronis = tokenMarks.includes("coronis")
      ? trMark("coronis", options)
      : "";

    return base + transliteratedMarks + coronis;
  }).join("").normalize("NFC");
}

function trMark(mark: Diacritic, options: ConversionOptions) {
  switch (mark) {
    case "acute":
      return "\u0301";
    case "grave":
      return "\u0300";
    case "circumflex":
      return "\u0303";
    case "diaeresis":
      return "\u0308";
    case "iota-subscript":
      return "\u0327";
    case "macron":
      return "\u0304";
    case "breve":
      return "\u0306";
    case "coronis":
      switch (options.orthography?.coronis) {
        case "apostrophe":
          return "\u2019";
        case "greek":
          return "\u1FBD";
        default:
          return "";
      }
    default:
      return "";
  }
}
