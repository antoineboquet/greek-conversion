import type { Diacritic, Document, Grapheme, Token } from "./model.ts";
import type { ConversionOptions } from "./options.ts";

export function applyOrthography(
  document: Document,
  options: ConversionOptions = {},
): Document {
  if (options.orthography?.doubleRho !== "smooth-rough") return document;

  return document.map((token, index) => {
    if (token.kind !== "grapheme" || token.letter !== "rho") return token;

    const previous = document[index - 1];
    const next = document[index + 1];

    if (isRho(next)) return withDiacritic(token, "smooth");
    if (isRho(previous)) return withDiacritic(token, "rough");

    return token;
  });
}

function isRho(token: Token | undefined): token is Grapheme {
  return token?.kind === "grapheme" && token.letter === "rho";
}

function withDiacritic(token: Grapheme, diacritic: Diacritic): Grapheme {
  return {
    ...token,
    diacritics: new Set([...token.diacritics, diacritic]),
  };
}
