import { BETA_MARKS, BY_BETA } from "../alphabet.ts";
import {
  ARISTERI_KERAIA,
  classifyCoronides,
  DEXIA_KERAIA,
  normalizeInitialDiphthongBreathings,
} from "../context.ts";
import {
  type Diacritic,
  type Document,
  grapheme,
  literal,
  type Token,
} from "../model.ts";

export function parseBetaCode(input: string): Document {
  const chars = Array.from(input);
  const out: Token[] = [];

  for (let i = 0; i < chars.length;) {
    let upper = false;

    if (chars[i] === "*" && i + 1 < chars.length) {
      upper = true;
      i++;
    }

    if (chars[i]?.toLowerCase() === "s" && chars[i + 1] === "3") {
      out.push(grapheme("sigma", upper));
      i += 2;
      continue;
    }

    const additional = additionalCharacter(chars, i);
    if (additional) {
      out.push(grapheme(additional.letter, upper));
      i += additional.length;
      continue;
    }

    if (chars[i] === "#") {
      if (chars[i + 1] === "2" && chars[i + 2] === "2") {
        out.push(literal(ARISTERI_KERAIA));
        i += 3;
      } else {
        out.push(literal(DEXIA_KERAIA));
        i++;
      }
      continue;
    }

    const source = chars[i];
    const letter = source && BY_BETA.get(source.toLowerCase());

    if (!letter) {
      if (upper) out.push(literal("*"));
      if (source) out.push(literal(source));
      i++;
      continue;
    }

    upper ||= source === source.toUpperCase();
    i++;

    const marks = new Set<Diacritic>();

    while (i < chars.length) {
      const mark = BETA_MARKS.get(chars[i]);
      if (!mark) break;
      marks.add(mark);
      i++;
    }

    out.push(grapheme(letter, upper, marks));
  }

  normalizeInitialDiphthongBreathings(out);
  classifyCoronides(out);

  return out;
}

function additionalCharacter(
  chars: readonly string[],
  start: number,
):
  | { letter: "stigma" | "koppa" | "archaic-koppa" | "sampi"; length: 2 }
  | undefined {
  if (chars[start] !== "#") return undefined;

  switch (chars[start + 1]) {
    case "1":
      return { letter: "koppa", length: 2 };
    case "2":
      if (chars[start + 2] === "2") return undefined;
      return { letter: "stigma", length: 2 };
    case "3":
      return { letter: "archaic-koppa", length: 2 };
    case "5":
      return { letter: "sampi", length: 2 };
    default:
      return undefined;
  }
}
