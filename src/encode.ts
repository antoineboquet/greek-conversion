import { ALPHABET, BETA_FOR, GREEK_FOR, ORDER } from "./alphabet.ts";
import type { Diacritic, Document, Grapheme, Token } from "./model.ts";

const marks = (token: Grapheme) =>
  ORDER.filter((mark) => token.diacritics.has(mark));

const wordEnd = (next: Token | undefined) =>
  next === undefined || next.kind === "literal";

export function encodeGreek(doc: Document) {
  let out = "";

  for (let i = 0; i < doc.length; i++) {
    const token = doc[i];

    if (token.kind === "literal") {
      out += token.value;
      continue;
    }

    let base = ALPHABET[token.letter].greek;

    if (token.letter === "sigma" && wordEnd(doc[i + 1])) base = "ς";
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

export function encodeTransliteration(doc: Document) {
  return doc.map((token, index) => {
    if (token.kind === "literal") return token.value;

    const previous = doc[index - 1];
    let base = ALPHABET[token.letter].tr;
    if (token.uppercase) base = base[0].toUpperCase() + base.slice(1);
    if (token.diacritics.has("rough")) {
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
    return base + marks(token).map(trMark).join("");
  }).join("").normalize("NFC");
}

function trMark(mark: Diacritic) {
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
    default:
      return "";
  }
}
