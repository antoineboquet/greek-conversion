import type { Document, Letter } from "./model.ts";

const NASAL_GAMMA_FOLLOWERS = new Set<Letter>([
  "gamma",
  "kappa",
  "xi",
  "chi",
]);

const VOWELS = new Set<Letter>([
  "alpha",
  "epsilon",
  "eta",
  "iota",
  "omicron",
  "upsilon",
  "omega",
]);

const DIPHTHONGS = new Set([
  "alpha-iota",
  "alpha-upsilon",
  "epsilon-iota",
  "epsilon-upsilon",
  "eta-upsilon",
  "omicron-iota",
  "omicron-upsilon",
  "upsilon-iota",
]);

export function isWordInitial(document: Document, index: number): boolean {
  return index === 0 || document[index - 1].kind === "literal";
}

export function isWordFinal(document: Document, index: number): boolean {
  return index === document.length - 1 ||
    document[index + 1].kind === "literal";
}

export function isVowel(letter: Letter): boolean {
  return VOWELS.has(letter);
}

export function breathingTarget(document: Document, start: number): number {
  const first = document[start];
  const second = document[start + 1];

  if (
    first?.kind === "grapheme" &&
    second?.kind === "grapheme" &&
    DIPHTHONGS.has(`${first.letter}-${second.letter}`) &&
    !second.diacritics.has("diaeresis")
  ) {
    return start + 1;
  }

  return start;
}

export function initialBreathingStart(
  document: Document,
  index: number,
): number | undefined {
  if (
    isWordInitial(document, index) &&
    document[index].kind === "grapheme" &&
    isVowel(document[index].letter)
  ) {
    return index;
  }

  const previous = index - 1;
  if (
    previous >= 0 &&
    isWordInitial(document, previous) &&
    breathingTarget(document, previous) === index
  ) {
    return previous;
  }

  return undefined;
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

export function contractedPsiUppercase(
  document: Document,
  index: number,
): boolean | undefined {
  const pi = document[index];
  const sigma = document[index + 1];

  if (
    pi.kind !== "grapheme" ||
    pi.letter !== "pi" ||
    pi.diacritics.size > 0 ||
    sigma?.kind !== "grapheme" ||
    sigma.letter !== "sigma" ||
    sigma.diacritics.size > 0
  ) {
    return undefined;
  }

  if (pi.uppercase) return true;
  return sigma.uppercase ? undefined : false;
}
