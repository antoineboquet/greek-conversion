import { encode, parse } from "./conversion.ts";
import {
  type ConversionResult,
  findConversionLosses,
} from "./losses.ts";
import type { Document, Format } from "./model.ts";
import type { ConversionOptions, GreekUnicodeOptions } from "./options.ts";
import { resolveConversionOptions } from "./presets.ts";

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
  ConversionLoss,
  ConversionLossCode,
  ConversionResult,
} from "./losses.ts";
export type {
  BetaTransliteration,
  ChiTransliteration,
  ConversionOptions,
  CoronisOrthography,
  DiacriticDisposition,
  DiacriticOptions,
  DentalSigmaOrthography,
  DoubleRhoOrthography,
  EtaTransliteration,
  GreekAccentuation,
  GreekAcuteForm,
  GreekAnoTeleiaForm,
  GreekQuestionMarkForm,
  GreekUnicodeOptions,
  LetterCaseOrthography,
  LongVowelOrthography,
  MedialBetaOrthography,
  ModernDigraphOrthography,
  NasalGammaOrthography,
  NumeralOrthography,
  OrthographyOptions,
  PhiTransliteration,
  Preset,
  RhoTransliteration,
  SigmaOrthography,
  UnicodeComposition,
  UpsilonOrthography,
  WhitespaceOrthography,
  XiTransliteration,
} from "./options.ts";
export {
  getPresetOptions,
  PRESETS,
  resolveConversionOptions,
} from "./presets.ts";
export type { PresetOptions } from "./presets.ts";
export { GreekText } from "./greek_text.ts";
export { encode, parse } from "./conversion.ts";
export { applyGreekOrthography, applyOrthography } from "./orthography.ts";
export {
  ANO_TELEIA,
  APOSTROPHE,
  ENOTIKON,
  EROTIMATIKO,
  HYPHEN,
} from "./punctuation.ts";
export type { ValidationCode, ValidationDiagnostic } from "./validation.ts";
export { validateDocument } from "./validation.ts";
export { toUnicodeCodePoints } from "./unicode.ts";

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

export function formatGreekUnicode(
  input: string,
  options: GreekUnicodeOptions = {},
): string {
  return encode(parse(input, "greek"), "greek", { unicode: options });
}

export const convert = (
  input: string,
  from: Format,
  to: Format,
  options: ConversionOptions = {},
) => runConversion(input, from, to, options).output;

export function convertDetailed(
  input: string,
  from: Format,
  to: Format,
  options: ConversionOptions = {},
): ConversionResult {
  const { source, output } = runConversion(input, from, to, options);
  const target = parse(output, to, options);
  const losses = findConversionLosses(source, target);

  return { output, lossy: losses.length > 0, losses };
}

function runConversion(
  input: string,
  from: Format,
  to: Format,
  options: ConversionOptions,
): { source: Document; output: string } {
  const resolved = resolveConversionOptions(options);
  const source = parse(input, from, resolved);
  return { source, output: encode(source, to, resolved) };
}

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
