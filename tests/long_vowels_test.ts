import { convert } from "../src/mod.ts";
import { encode } from "../src/document.ts";
import { grapheme } from "../src/model.ts";
import { assertNfcEquals } from "./assertions.ts";

const CIRCUMFLEX = {
  orthography: { longVowels: "circumflex" },
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
});

Deno.test("accepts every structural long-vowel spelling on input", () => {
  assertNfcEquals(
    convert(
      "be bê bē bê̄ bo bô bō bô̄",
      "transliteration",
      "greek",
    ),
    "βε βη βη βη̄ βο βω βω βω̄",
  );
  assertNfcEquals(
    convert("bê̄ bô̄", "transliteration", "greek"),
    "βη̄ βω̄",
  );
  assertNfcEquals(
    convert("bê̄ bô̄", "transliteration", "transliteration", CIRCUMFLEX),
    "bê̄ bô̄",
  );
  assertNfcEquals(
    convert("η̄ ω̄", "greek", "transliteration", CIRCUMFLEX),
    "ê̄ ô̄",
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
    encode(
      [grapheme("alpha", false, ["macron", "circumflex"])],
      "transliteration",
      CIRCUMFLEX,
    ),
    "ã̄",
  );

  assertNfcEquals(
    encode(
      [grapheme("eta", false, ["macron", "circumflex"])],
      "transliteration",
      CIRCUMFLEX,
    ),
    "ễ̄",
  );
});
