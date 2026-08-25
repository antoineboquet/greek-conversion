import {
  encodeBetaCode,
  encodeGreek,
  encodeTransliteration,
} from "./encode.ts";
import type { Document, Format } from "./model.ts";
import type { ConversionOptions } from "./options.ts";
import {
  applyNumeralOrthography,
  applyOrthography,
} from "./orthography.ts";
import { parseBetaCode } from "./parsers/beta_code.ts";
import { parseGreek } from "./parsers/greek.ts";
import { parseTransliteration } from "./parsers/transliteration.ts";
import { resolveConversionOptions } from "./presets.ts";

export function parse(
  input: string,
  format: Format,
  options: ConversionOptions = {},
): Document {
  const resolved = resolveConversionOptions(options);
  switch (format) {
    case "greek":
      return parseGreek(input);
    case "beta-code":
      return parseBetaCode(input);
    case "transliteration":
      return parseTransliteration(input, resolved);
  }
}

export function encode(
  document: Document,
  format: Format,
  options: ConversionOptions = {},
): string {
  const resolved = resolveConversionOptions(options);
  const prepared = format === "transliteration"
    ? applyNumeralOrthography(document, resolved)
    : applyOrthography(document, resolved);

  switch (format) {
    case "greek":
      return encodeGreek(prepared, resolved);
    case "beta-code":
      return encodeBetaCode(prepared, resolved);
    case "transliteration":
      return encodeTransliteration(prepared, resolved);
  }
}
