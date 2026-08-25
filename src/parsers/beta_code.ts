import { BETA_MARKS, BY_BETA } from "../alphabet.ts";
import { classifyCoronides } from "../context.ts";
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

  classifyCoronides(out);

  return out;
}
