import type { Document } from "./model.ts";

/** Removes canonical diacritics without mutating the source document. */
export function stripDiacritics(document: Document): Document {
  let changed = false;
  const stripped = document.map((token) => {
    if (token.kind === "literal" || token.diacritics.size === 0) return token;

    changed = true;
    return { ...token, diacritics: new Set() };
  });

  return changed ? stripped : document;
}
