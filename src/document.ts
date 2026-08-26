/**
 * Advanced access to the canonical document used by the conversion engine.
 *
 * This entry point is experimental during the `1.0.0` prerelease series. It is
 * intended for validation, custom analysis, and controlled transformations.
 * Ordinary conversions should use the package's main entry point instead.
 *
 * A document may be constructed manually, but {@link validateDocument} should
 * be used before encoding data that did not originate from {@link parse}.
 *
 * @module
 */

export { encode, parse } from "./conversion.ts";
export { applyGreekOrthography } from "./orthography.ts";
export {
  type Diacritic,
  type Document,
  type Format,
  type GlyphVariant,
  type Grapheme,
  grapheme,
  type Letter,
  type Literal,
  literal,
  type Token,
} from "./model.ts";
export type { ConversionOptions } from "./options.ts";
export {
  validateDocument,
  type ValidationCode,
  type ValidationDiagnostic,
} from "./validation.ts";
