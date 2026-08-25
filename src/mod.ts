/**
 * Bidirectional conversion between Greek, Beta Code, and scientific
 * transliteration.
 *
 * Use {@link convert} for ordinary conversions, {@link convertDetailed} when
 * information-loss diagnostics are required, and {@link GreekText} when the
 * same source is needed in several representations. Advanced access to the
 * canonical document is available from the `./document` entry point.
 *
 * @module
 */

import { encode, parse } from "./conversion.ts";
import { type ConversionResult, findConversionLosses } from "./losses.ts";
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
  DentalSigmaOrthography,
  DiacriticDisposition,
  DiacriticOptions,
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
export { toUnicodeCodePoints } from "./unicode.ts";

/**
 * Removes every removable diacritic and returns the canonical spelling of the
 * selected format.
 *
 * Structural distinctions required to identify a letter, such as `η → ē` and
 * `ω → ō`, are retained. Context is analyzed before marks are hidden.
 *
 * @example
 * ```ts
 * removeDiacritics("a)/nqrwpos", "beta-code"); // "anqrwpos"
 * ```
 */
export function removeDiacritics(
  input: string,
  format: Format,
  options: ConversionOptions = {},
): string {
  const resolved = resolveConversionOptions(options);
  return encode(parse(input, format, resolved), format, {
    ...resolved,
    removeDiacritics: true,
  });
}

/**
 * Re-encodes Greek text with explicit Unicode representation preferences.
 *
 * This helper does not change the Greek orthography. Forced oxia and Greek
 * punctuation scalars are applied after composition and may therefore produce
 * text that is canonically equivalent to NFC without itself being NFC.
 */
export function formatGreekUnicode(
  input: string,
  options: GreekUnicodeOptions = {},
): string {
  return encode(parse(input, "greek"), "greek", { unicode: options });
}

/**
 * Converts text between Greek, Beta Code, and scientific transliteration.
 *
 * Unknown literals are preserved. The result is canonical and idempotent for
 * fixed formats and options, but a reverse conversion is not necessarily
 * lossless; use {@link convertDetailed} when that distinction matters.
 */
export function convert(
  input: string,
  from: Format,
  to: Format,
  options: ConversionOptions = {},
): string {
  return runConversion(input, from, to, options).output;
}

/**
 * Converts text and reports information that the target representation cannot
 * retain.
 *
 * Unicode composition, tonos/oxia, and alternate glyphs are representational
 * differences and are not reported as loss. The conversion itself is executed
 * once; only the rendered target is parsed again for comparison.
 */
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

/** Converts Greek text to canonical Beta Code. */
export function greekToBetaCode(
  input: string,
  options: ConversionOptions = {},
): string {
  return convert(input, "greek", "beta-code", options);
}

/** Converts Greek text to scientific transliteration. */
export function greekToTransliteration(
  input: string,
  options: ConversionOptions = {},
): string {
  return convert(input, "greek", "transliteration", options);
}

/** Converts Beta Code to canonical Greek text. */
export function betaCodeToGreek(
  input: string,
  options: ConversionOptions = {},
): string {
  return convert(input, "beta-code", "greek", options);
}

/** Converts Beta Code to scientific transliteration. */
export function betaCodeToTransliteration(
  input: string,
  options: ConversionOptions = {},
): string {
  return convert(input, "beta-code", "transliteration", options);
}

/** Converts scientific transliteration to canonical Greek text. */
export function transliterationToGreek(
  input: string,
  options: ConversionOptions = {},
): string {
  return convert(input, "transliteration", "greek", options);
}

/** Converts scientific transliteration to canonical Beta Code. */
export function transliterationToBetaCode(
  input: string,
  options: ConversionOptions = {},
): string {
  return convert(input, "transliteration", "beta-code", options);
}
