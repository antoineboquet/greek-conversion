import {
  encodeBetaCode,
  encodeGreek,
  encodeTransliteration,
} from "./encode.ts";
import type { Document, Format } from "./model.ts";
import type { ConversionOptions } from "./options.ts";
import { applyNumeralOrthography, applyOrthography } from "./orthography.ts";
import { parseBetaCode } from "./parsers/beta_code.ts";
import { parseGreek } from "./parsers/greek.ts";
import { parseTransliteration } from "./parsers/transliteration.ts";
import { resolveConversionOptions } from "./presets.ts";

/**
 * Parses one supported representation into the canonical document model.
 *
 * Unknown input is retained as literal tokens. Presets and custom options are
 * resolved before parsing because some transliteration spellings are
 * option-dependent.
 */
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

/**
 * Encodes a canonical document in one supported representation.
 *
 * This function does not validate manually constructed documents. Call
 * `validateDocument()` first when the document did not originate from
 * {@link parse}.
 */
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
