import { ALPHABET, GREEK_MARKS } from "../alphabet.ts";
import {
  breathingTarget,
  followsNasalGamma,
  hasQuantity,
  isGreekNumeralContext,
  isVowel,
} from "../context.ts";
import {
  type Diacritic,
  type Document,
  grapheme,
  type Letter,
  literal,
  type Token,
} from "../model.ts";
import type { ConversionOptions } from "../options.ts";
import { parsePunctuation } from "../punctuation.ts";
import { Trie } from "../trie.ts";

const TRIE = new Trie<Letter>(
  Object.entries(ALPHABET)
    .filter(([letter]) =>
      letter !== "eta" &&
      letter !== "omega" &&
      letter !== "stigma" &&
      letter !== "sampi" &&
      letter !== "archaic-koppa"
    )
    .map(([letter, forms]) =>
      [
        forms.tr.normalize("NFD").replaceAll(/\p{M}/gu, ""),
        letter as Letter,
      ] as const
    ),
);

export function parseTransliteration(
  input: string,
  options: ConversionOptions = {},
): Document {
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

    const match = markedArchaicLetter(chars, i) ?? TRIE.longest(chars, i);

    if (!match) {
      if (rough) out.push(literal(roughUppercase ? "H" : "h"));
      out.push(
        literal(parsePunctuation(chars[i], "transliteration") ?? chars[i]),
      );
      i++;
      continue;
    }

    const source = chars[i];

    i += match.length;

    if (match.value === "rho" && chars[i]?.toLowerCase() === "h") {
      const previous = out.at(-1);

      if (previous?.kind !== "grapheme" || previous.letter !== "rho") {
        rough = true;
      }

      i++;
    }

    const marks = new Set<Diacritic>();
    let structuralCircumflex = false;

    if (rough) marks.add("rough");

    while (i < chars.length) {
      if (
        chars[i] === "\u0302" &&
        (match.value === "epsilon" || match.value === "omicron")
      ) {
        structuralCircumflex = true;
        i++;
        continue;
      }
      const mark = trMark(chars[i]);
      if (!mark) break;
      marks.add(mark);
      i++;
    }

    const letter = resolveLongVowel(
      match.value,
      marks,
      structuralCircumflex,
    );

    out.push(
      grapheme(
        letter,
        roughUppercase || source !== source.toLowerCase(),
        marks,
      ),
    );
  }

  if (options.orthography?.nasalGamma !== "literal") {
    inferNasalGammas(out);
  }
  inferInitialBreathings(out);

  return out;
}

function markedArchaicLetter(
  chars: readonly string[],
  start: number,
):
  | { value: "archaic-koppa"; length: 2 }
  | { value: "stigma" | "sampi"; length: number }
  | undefined {
  if (
    chars[start]?.toLowerCase() === "k" &&
    chars[start + 1] === "\u0323"
  ) {
    return { value: "archaic-koppa", length: 2 };
  }

  const firstMark = chars[start + 1];
  if (firstMark !== "\u0304" && firstMark !== "\u0302") return undefined;

  const secondMark = chars[start + 2];
  const length = secondMark !== firstMark &&
      (secondMark === "\u0304" || secondMark === "\u0302")
    ? 3
    : 2;

  switch (chars[start].toLowerCase()) {
    case "c":
      return { value: "stigma", length };
    case "s":
      return { value: "sampi", length };
    default:
      return undefined;
  }
}

function inferNasalGammas(tokens: Token[]) {
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const next = tokens[i + 1];

    if (
      token.kind === "grapheme" &&
      token.letter === "nu" &&
      next.kind === "grapheme" &&
      followsNasalGamma(next.letter)
    ) {
      token.letter = "gamma";
    }
  }
}

function startsVowel(chars: readonly string[], start: number) {
  const match = TRIE.longest(chars, start);
  return !!match && isVowel(match.value);
}

function trMark(char: string): Diacritic | undefined {
  if (char === "\u0303" || char === "\u0342") return "circumflex";
  if (char === "\u0327") return "iota-subscript";
  return GREEK_MARKS.get(char);
}

function resolveLongVowel(
  letter: Letter,
  marks: Set<Diacritic>,
  structuralCircumflex: boolean,
): Letter {
  if (!marks.has("macron") && !structuralCircumflex) return letter;

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

function inferInitialBreathings(tokens: Token[]) {
  let wordStart = true;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.kind === "literal") {
      wordStart = true;
      continue;
    }

    if (!wordStart) continue;
    wordStart = false;

    if (!isVowel(token.letter) || isGreekNumeralContext(tokens, i)) continue;

    const target = tokens[breathingTarget(tokens, i)];
    if (target.kind !== "grapheme") continue;

    if (token.diacritics.has("rough") && target !== token) {
      token.diacritics.delete("rough");
      target.diacritics.add("rough");
    } else if (
      !target.diacritics.has("rough") &&
      !hasQuantity(token) &&
      !hasQuantity(target)
    ) {
      target.diacritics.add("smooth");
    }
  }
}
