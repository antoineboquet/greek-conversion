import { convert, encode } from "../src/mod.ts";
import { grapheme } from "../src/model.ts";
import { assertNfcEquals } from "./assertions.ts";

const CIRCUMFLEX = {
  orthography: { longVowels: "circumflex" },
} as const;

const CIRCUMFLEX_MACRON = {
  orthography: { longVowels: "circumflex-macron" },
} as const;

Deno.test("selects the transliterated spelling of structural long vowels", () => {
  const greek = "βη βω βᾱ βῑ βῡ";

  assertNfcEquals(
    convert(greek, "greek", "transliteration"),
    "bē bō bā bī bū",
  );
  assertNfcEquals(
    convert(greek, "greek", "transliteration", CIRCUMFLEX),
    "bê bô bā bī bū",
  );
  assertNfcEquals(
    convert(greek, "greek", "transliteration", CIRCUMFLEX_MACRON),
    "bê̄ bô̄ bā bī bū",
  );
});

Deno.test("accepts every structural long-vowel spelling on input", () => {
  assertNfcEquals(
    convert(
      "be bê bē bê̄ bo bô bō bô̄",
      "transliteration",
      "greek",
    ),
    "βε βη βη βη βο βω βω βω",
  );
});

Deno.test("applies the structural marker policy to stigma and sampi", () => {
  const greek = "ϛ ϡ ϛʹ ϡʹ";

  assertNfcEquals(
    convert(greek, "greek", "transliteration"),
    "c̄ s̄ c̄ʹ s̄ʹ",
  );
  assertNfcEquals(
    convert(greek, "greek", "transliteration", CIRCUMFLEX),
    "ĉ ŝ ĉʹ ŝʹ",
  );
  assertNfcEquals(
    convert(greek, "greek", "transliteration", CIRCUMFLEX_MACRON),
    "ĉ̄ ŝ̄ ĉ̄ʹ ŝ̄ʹ",
  );

  for (const transliteration of ["c̄ s̄", "ĉ ŝ", "ĉ̄ ŝ̄", "c̄̂ s̄̂"]) {
    assertNfcEquals(
      convert(transliteration, "transliteration", "greek"),
      "ϛ ϡ",
    );
  }
});

Deno.test("keeps structural length distinct from Greek circumflex accent", () => {
  const greek = "βῆ βῶ βᾶ βᾱ";

  assertNfcEquals(
    convert(greek, "greek", "transliteration"),
    "bē̃ bō̃ bã bā",
  );
  assertNfcEquals(
    convert(greek, "greek", "transliteration", CIRCUMFLEX),
    "bễ bỗ bã bā",
  );
  assertNfcEquals(
    convert(greek, "greek", "transliteration", CIRCUMFLEX_MACRON),
    "bê̄̃ bô̄̃ bã bā",
  );

  assertNfcEquals(
    encode(
      [grapheme("alpha", false, ["macron", "circumflex"])],
      "transliteration",
      CIRCUMFLEX_MACRON,
    ),
    "ã̄",
  );
});
