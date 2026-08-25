import { convert } from "../src/mod.ts";
import { assertNfcEquals } from "./assertions.ts";

Deno.test("classifies diphthongs before removing their diacritics", () => {
  const options = {
    removeDiacritics: true,
    orthography: { upsilon: "y-with-diphthong-u" },
  } as const;

  assertNfcEquals(
    convert("αϋ αυ ᾳυ", "greek", "transliteration", options),
    "ay au ay",
  );
});

Deno.test("does not create contractions by removing blocking marks", () => {
  const options = {
    removeDiacritics: true,
    orthography: { dentalSigma: "assimilate" },
  } as const;

  assertNfcEquals(
    convert("βσ́ τσ́", "greek", "greek", options),
    "βς τς",
  );
});

Deno.test("combines transliteration policies deterministically", () => {
  const options = {
    removeDiacritics: true,
    orthography: {
      coronis: "apostrophe",
      longVowels: "circumflex-macron",
      nasalGamma: "literal",
      upsilon: "y-with-diphthong-u",
    },
  } as const;

  assertNfcEquals(
    convert(
      "κἀγώ ἄγγελος υ αυ αϋ ῆ",
      "greek",
      "transliteration",
      options,
    ),
    "kagô̄ aggelos y au ay ê̄",
  );
});

Deno.test("numerals override interacting Greek glyph policies", () => {
  const options = {
    removeDiacritics: true,
    orthography: {
      dentalSigma: "assimilate",
      medialBeta: "symbol",
      numerals: "decimal",
      sigma: "lunate",
    },
  } as const;

  assertNfcEquals(
    convert("βίος βʹ ατσα", "greek", "greek", options),
    "βιοϲ 2 αϲα",
  );
});

Deno.test("diacritic removal dominates optional double-rho marks", () => {
  const options = {
    removeDiacritics: true,
    orthography: { doubleRho: "smooth-rough" },
  } as const;

  assertNfcEquals(
    convert("πολύρριζος", "greek", "greek", options),
    "πολυρριζος",
  );
  assertNfcEquals(
    convert("πολύρριζος", "greek", "beta-code", options),
    "polurrizos",
  );
  assertNfcEquals(
    convert("πολύρριζος", "greek", "transliteration", options),
    "polurrhizos",
  );
});
