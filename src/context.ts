import type { Document, Grapheme, Letter, Token } from "./model.ts";

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
  "omega-upsilon",
]);

const ELISION_MARKS = new Set(["'", "\u02BC", "\u1FBD", "\u2019"]);

const ELIDED_ASPIRATES = new Map<Letter, Letter>([
  ["pi", "phi"],
  ["tau", "theta"],
  ["kappa", "chi"],
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

/**
 * A quantity sign in transliteration preserves metrical information but does
 * not say whether a word-initial vowel bore a smooth breathing.  In
 * particular, this lets forms such as `ā` round-trip as `ᾱ`, rather than
 * inventing `ἀ̄`.
 */
export function hasQuantity(token: Grapheme): boolean {
  return token.diacritics.has("macron") || token.diacritics.has("breve");
}

export function breathingTarget(document: Document, start: number): number {
  const first = document[start];
  const second = document[start + 1];

  if (
    first?.kind === "grapheme" &&
    second?.kind === "grapheme" &&
    DIPHTHONGS.has(`${first.letter}-${second.letter}`) &&
    !first.diacritics.has("iota-subscript") &&
    !second.diacritics.has("diaeresis")
  ) {
    return start + 1;
  }

  return start;
}

/** Moves an initial breathing supplied on the first half of a diphthong. */
export function normalizeInitialDiphthongBreathings(tokens: Token[]): void {
  for (let start = 0; start < tokens.length; start++) {
    const first = tokens[start];
    if (
      first.kind !== "grapheme" ||
      !isWordInitial(tokens, start) ||
      !isVowel(first.letter)
    ) {
      continue;
    }

    const targetIndex = breathingTarget(tokens, start);
    if (targetIndex === start) continue;

    const target = tokens[targetIndex];
    if (target.kind !== "grapheme") continue;

    for (const breathing of ["smooth", "rough"] as const) {
      if (
        first.diacritics.has(breathing) &&
        !target.diacritics.has("smooth") &&
        !target.diacritics.has("rough")
      ) {
        first.diacritics.delete(breathing);
        target.diacritics.add(breathing);
      }
    }
  }
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

/** Classifies the shared smooth mark as a coronis on an internal vowel. */
export function classifyCoronides(tokens: Token[]): void {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (
      token.kind === "grapheme" &&
      isVowel(token.letter) &&
      token.diacritics.has("smooth") &&
      initialBreathingStart(tokens, i) === undefined
    ) {
      token.diacritics.delete("smooth");
      token.diacritics.add("coronis");
    }
  }
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

/**
 * Returns the aspirated spelling of an elided final mute before a word with a
 * rough breathing. The apostrophe itself and any intervening whitespace remain
 * literal tokens, so the transformation is confined to Greek output.
 */
export function elidedAspirate(
  document: Document,
  index: number,
): Letter | undefined {
  const token = document[index];
  if (token.kind !== "grapheme") return undefined;

  const aspirate = ELIDED_ASPIRATES.get(token.letter);
  if (!aspirate || !isElisionMark(document[index + 1])) return undefined;

  let nextIndex = index + 2;
  while (isWhitespace(document[nextIndex])) nextIndex++;

  const next = document[nextIndex];
  if (next?.kind !== "grapheme") return undefined;

  const targetIndex = isVowel(next.letter)
    ? breathingTarget(document, nextIndex)
    : nextIndex;
  const target = document[targetIndex];

  return target?.kind === "grapheme" && target.diacritics.has("rough")
    ? aspirate
    : undefined;
}

function isElisionMark(token: Token | undefined): boolean {
  return token?.kind === "literal" && ELISION_MARKS.has(token.value);
}

function isWhitespace(token: Token | undefined): boolean {
  return token?.kind === "literal" && /^\p{White_Space}$/u.test(token.value);
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
