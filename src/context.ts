import type { Document, Letter } from "./model.ts";

const NASAL_GAMMA_FOLLOWERS = new Set<Letter>([
  "gamma",
  "kappa",
  "xi",
  "chi",
]);

export function isWordInitial(document: Document, index: number): boolean {
  return index === 0 || document[index - 1].kind === "literal";
}

export function isWordFinal(document: Document, index: number): boolean {
  return index === document.length - 1 ||
    document[index + 1].kind === "literal";
}

export function isNasalGamma(document: Document, index: number): boolean {
  const token = document[index];
  const next = document[index + 1];

  return token.kind === "grapheme" &&
    token.letter === "gamma" &&
    next?.kind === "grapheme" &&
    NASAL_GAMMA_FOLLOWERS.has(next.letter);
}

export function followsNasalGamma(letter: Letter): boolean {
  return NASAL_GAMMA_FOLLOWERS.has(letter);
}
