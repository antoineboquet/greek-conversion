import type { Diacritic, Document } from "./model.ts";
import type { ConversionOptions, DiacriticDisposition } from "./options.ts";

export function diacriticDisposition(
  diacritic: Diacritic,
  options: ConversionOptions,
): DiacriticDisposition {
  if (options.removeDiacritics) return "remove";

  const policy = options.diacritics;
  switch (diacritic) {
    case "acute":
    case "grave":
    case "circumflex":
      return policy?.accents ?? "preserve";
    case "smooth":
      return policy?.smoothBreathing ?? "preserve";
    case "rough":
      return policy?.roughBreathing ?? "preserve";
    case "coronis":
      return policy?.coronis ?? "preserve";
    case "diaeresis":
      return policy?.diaeresis ?? "preserve";
    case "iota-subscript":
      return policy?.iotaSubscript ?? "preserve";
    case "macron":
    case "breve":
      return policy?.quantity ?? "preserve";
  }
}

export function preservesDiacritic(
  diacritic: Diacritic,
  options: ConversionOptions,
): boolean {
  return diacriticDisposition(diacritic, options) === "preserve";
}

/** Removes canonical diacritics without mutating the source document. */
export function stripDiacritics(document: Document): Document {
  let changed = false;
  const stripped = document.map((token) => {
    if (token.kind === "literal" || token.diacritics.size === 0) return token;

    changed = true;
    return { ...token, diacritics: new Set<Diacritic>() };
  });

  return changed ? stripped : document;
}
