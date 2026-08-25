import { ALPHABET, GREEK_MARKS } from "../alphabet.ts";
import {
  type Diacritic,
  type Document,
  grapheme,
  type Letter,
  literal,
  type Token,
} from "../model.ts";
import { Trie } from "../trie.ts";

const TRIE = new Trie<Letter>(
  Object.entries(ALPHABET)
    .filter(([letter]) => letter !== "eta" && letter !== "omega")
    .map(([letter, forms]) =>
      [
        forms.tr.normalize("NFD").replaceAll(/\p{M}/gu, ""),
        letter as Letter,
      ] as const
    ),
);

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

export function parseTransliteration(input: string): Document {
  const chars = Array.from(input.normalize("NFD"));
  const out: Token[] = [];

  for (let i = 0; i < chars.length;) {
    let rough = false;
    let roughUppercase = false;

    if (chars[i].toLowerCase() === "h" && startsVowel(chars, i + 1)) {
      rough = true;
      roughUppercase = chars[i] !== chars[i].toLowerCase();
      i++;
    }

    const match = TRIE.longest(chars, i);

    if (!match) {
      if (rough) out.push(literal(roughUppercase ? "H" : "h"));
      out.push(literal(chars[i]));
      i++;
      continue;
    }

    const source = chars[i];

    i += match.length;

    if (match.value === "rho" && chars[i]?.toLowerCase() === "h") {
      rough = true;
      i++;
    }

    const marks = new Set<Diacritic>();

    if (rough) marks.add("rough");

    while (i < chars.length) {
      const mark = trMark(chars[i]);
      if (!mark) break;
      marks.add(mark);
      i++;
    }

    const letter = resolveLongVowel(match.value, marks);

    out.push(
      grapheme(
        letter,
        roughUppercase || source !== source.toLowerCase(),
        marks,
      ),
    );
  }

  inferSmooth(out);
  inferDoubleRhoBreathings(out);

  return out;
}

function inferDoubleRhoBreathings(tokens: Token[]) {
  for (let i = 0; i < tokens.length - 1; i++) {
    const first = tokens[i];
    const second = tokens[i + 1];

    if (
      first.kind === "grapheme" &&
      second.kind === "grapheme" &&
      first.letter === "rho" &&
      second.letter === "rho" &&
      second.diacritics.has("rough") &&
      !first.diacritics.has("rough")
    ) {
      first.diacritics.add("smooth");
    }
  }
}

function startsVowel(chars: readonly string[], start: number) {
  const match = TRIE.longest(chars, start);
  return !!match && VOWELS.has(match.value);
}

function trMark(char: string): Diacritic | undefined {
  if (char === "\u0303" || char === "\u0342") return "circumflex";
  if (char === "\u0327") return "iota-subscript";
  return GREEK_MARKS.get(char);
}

function resolveLongVowel(letter: Letter, marks: Set<Diacritic>): Letter {
  if (!marks.has("macron")) return letter;

  if (letter === "epsilon") {
    marks.delete("macron");
    return "eta";
  }

  if (letter === "omicron") {
    marks.delete("macron");
    return "omega";
  }

  return letter;
}

function inferSmooth(tokens: Token[]) {
  let wordStart = true;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.kind === "literal") {
      wordStart = true;
      continue;
    }

    if (!wordStart) continue;
    wordStart = false;

    if (!VOWELS.has(token.letter) || token.diacritics.has("rough")) continue;

    const next = tokens[i + 1];
    const target = next?.kind === "grapheme" &&
        DIPHTHONGS.has(`${token.letter}-${next.letter}`) &&
        !next.diacritics.has("diaeresis")
      ? next
      : token;

    target.diacritics.add("smooth");
  }
}
