import { ALPHABET, BETA_FOR, GREEK_FOR, ORDER } from "./alphabet.ts";
import {
  ARISTERI_KERAIA,
  breathingTarget,
  contractedSigma,
  DEXIA_KERAIA,
  elidedAspirate,
  initialBreathingStart,
  isGreekNumeralContext,
  isNasalGamma,
  isWordFinal,
  isWordInitial,
} from "./context.ts";
import type { Diacritic, Document, Grapheme } from "./model.ts";
import type { ConversionOptions } from "./options.ts";
import { encodePunctuation } from "./punctuation.ts";

const marks = (token: Grapheme) =>
  ORDER.filter((mark) => token.diacritics.has(mark));

export function encodeGreek(doc: Document, options: ConversionOptions = {}) {
  let out = "";

  for (let i = 0; i < doc.length; i++) {
    const token = doc[i];

    if (token.kind === "literal") {
      out += encodePunctuation(token.value, "greek") ?? token.value;
      continue;
    }

    const contraction = contractedSigma(
      doc,
      i,
      options.orthography?.dentalSigma === "assimilate",
    );

    if (contraction !== undefined) {
      let base = ALPHABET[contraction.letter].greek;
      if (contraction.letter === "sigma") {
        if (options.orthography?.sigma === "lunate") base = "ϲ";
        else if (isWordFinal(doc, i + 1)) base = "ς";
      }
      out += contraction.uppercase ? base.toLocaleUpperCase("el") : base;
      i++;
      continue;
    }

    const outputLetter = elidedAspirate(doc, i) ?? token.letter;
    let base = ALPHABET[outputLetter].greek;

    if (
      token.letter === "sigma" &&
      options.orthography?.sigma === "lunate" &&
      !isGreekNumeralContext(doc, i)
    ) {
      base = "ϲ";
    } else if (
      token.letter === "sigma" &&
      isWordFinal(doc, i) &&
      !isGreekNumeralContext(doc, i)
    ) {
      base = "ς";
    }
    if (
      token.letter === "beta" &&
      !token.uppercase &&
      options.orthography?.medialBeta === "symbol" &&
      !isGreekNumeralContext(doc, i) &&
      !isWordInitial(doc, i)
    ) {
      base = "ϐ";
    }
    if (token.uppercase) base = base.toLocaleUpperCase("el");

    out += base + marks(token).map((mark) => GREEK_FOR[mark]).join("");
  }

  return out.normalize("NFC");
}

export function encodeBetaCode(
  doc: Document,
  options: ConversionOptions = {},
) {
  return doc.map((token, index) => {
    if (token.kind === "literal") {
      if (token.value === DEXIA_KERAIA) return "#";
      if (token.value === ARISTERI_KERAIA) return "#22";
      return encodePunctuation(token.value, "beta-code") ?? token.value;
    }
    if (
      token.letter === "sigma" &&
      options.orthography?.sigma === "lunate" &&
      !isGreekNumeralContext(doc, index)
    ) {
      return token.uppercase ? "*S3" : "S3";
    }
    let base = ALPHABET[token.letter].beta;
    if (token.uppercase) {
      base = base.startsWith("#") ? `*${base}` : base.toUpperCase();
    }
    return base + marks(token).map((mark) => BETA_FOR[mark]).join("");
  }).join("");
}

export function encodeTransliteration(
  doc: Document,
  options: ConversionOptions = {},
) {
  return doc.map((token, index) => {
    if (token.kind === "literal") {
      return encodePunctuation(token.value, "transliteration") ?? token.value;
    }

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
    let base = options.orthography?.nasalGamma !== "literal" &&
        isNasalGamma(doc, index)
      ? "n"
      : ALPHABET[token.letter].tr;
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
