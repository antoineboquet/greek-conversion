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

export type {
  Diacritic,
  Document,
  Format,
  Grapheme,
  Letter,
  Literal,
  Token,
} from "./model.ts";
export type {
  ConversionOptions,
  CoronisOrthography,
  DentalSigmaOrthography,
  DoubleRhoOrthography,
  LongVowelOrthography,
  MedialBetaOrthography,
  NasalGammaOrthography,
  NumeralOrthography,
  OrthographyOptions,
  SigmaOrthography,
  UpsilonOrthography,
} from "./options.ts";
export { applyOrthography } from "./orthography.ts";
export {
  ANO_TELEIA,
  APOSTROPHE,
  ENOTIKON,
  EROTIMATIKO,
  HYPHEN,
} from "./punctuation.ts";
export type { ValidationCode, ValidationDiagnostic } from "./validation.ts";
export { validateDocument } from "./validation.ts";

export function parse(
  input: string,
  format: Format,
  options: ConversionOptions = {},
): Document {
  switch (format) {
    case "greek":
      return parseGreek(input);
    case "beta-code":
      return parseBetaCode(input);
    case "transliteration":
      return parseTransliteration(input, options);
  }
}

export function encode(
  document: Document,
  format: Format,
  options: ConversionOptions = {},
): string {
  const prepared = format === "transliteration"
    ? applyNumeralOrthography(document, options)
    : applyOrthography(document, options);

  switch (format) {
    case "greek":
      return encodeGreek(prepared, options);
    case "beta-code":
      return encodeBetaCode(prepared, options);
    case "transliteration":
      return encodeTransliteration(prepared, options);
  }
}

export function removeDiacritics(
  input: string,
  format: Format,
  options: ConversionOptions = {},
): string {
  return encode(parse(input, format, options), format, {
    ...options,
    removeDiacritics: true,
  });
}

export const convert = (
  input: string,
  from: Format,
  to: Format,
  options: ConversionOptions = {},
) => encode(parse(input, from, options), to, options);

export const greekToBetaCode = (
  input: string,
  options: ConversionOptions = {},
) => convert(input, "greek", "beta-code", options);

export const greekToTransliteration = (
  input: string,
  options: ConversionOptions = {},
) => convert(input, "greek", "transliteration", options);

export const betaCodeToGreek = (
  input: string,
  options: ConversionOptions = {},
) => convert(input, "beta-code", "greek", options);

export const betaCodeToTransliteration = (
  input: string,
  options: ConversionOptions = {},
) => convert(input, "beta-code", "transliteration", options);

export const transliterationToGreek = (
  input: string,
  options: ConversionOptions = {},
) => convert(input, "transliteration", "greek", options);

export const transliterationToBetaCode = (
  input: string,
  options: ConversionOptions = {},
) => convert(input, "transliteration", "beta-code", options);
