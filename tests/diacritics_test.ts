import { assertEquals } from "@std/assert";
import { convert, removeDiacritics } from "../src/mod.ts";
import { stripDiacritics } from "../src/diacritics.ts";
import { grapheme, literal } from "../src/model.ts";
import { assertNfcEquals } from "./assertions.ts";

const WITHOUT_DIACRITICS = { removeDiacritics: true } as const;

Deno.test("removes canonical diacritics from every output format", () => {
  const greek = "ἄνθρωπος ᾆ ῑ";

  assertNfcEquals(
    convert(greek, "greek", "greek", WITHOUT_DIACRITICS),
    "ανθρωπος α ι",
  );
  assertNfcEquals(
    convert(greek, "greek", "beta-code", WITHOUT_DIACRITICS),
    "anqrwpos a i",
  );
  assertNfcEquals(
    convert(greek, "greek", "transliteration", WITHOUT_DIACRITICS),
    "anthrōpos a i",
  );
});

Deno.test("exposes format-aware diacritic removal as a public helper", () => {
  assertNfcEquals(
    removeDiacritics("ἄνθρωπος· ἀπ’", "greek"),
    "ανθρωπος· απ’",
  );
  assertNfcEquals(
    removeDiacritics("a)/nqrwpos a)=| i& ap'", "beta-code"),
    "anqrwpos a i ap'",
  );
  assertNfcEquals(
    removeDiacritics("hánthrōpos aĩ ī ḳ c̄ s̄", "transliteration"),
    "anthrōpos ai i ḳ c̄ s̄",
  );
});

Deno.test("retains structural marks required to identify letters", () => {
  assertNfcEquals(
    convert("ῆ ῶ ϛ ϡ ϙ", "greek", "transliteration", {
      removeDiacritics: true,
      orthography: { longVowels: "circumflex-macron" },
    }),
    "ê̄ ô̄ ĉ̄ ŝ̄ ḳ",
  );
  assertNfcEquals(
    removeDiacritics("ý", "transliteration", {
      orthography: { upsilon: "y" },
    }),
    "y",
  );
});

Deno.test("removes coronis regardless of its output policy", () => {
  assertNfcEquals(
    convert("κἀγώ", "greek", "transliteration", {
      removeDiacritics: true,
      orthography: { coronis: "apostrophe" },
    }),
    "kagō",
  );
});

Deno.test("diacritic removal is immutable", () => {
  const source = [
    literal("["),
    grapheme("alpha", false, ["smooth", "acute"]),
    literal("]"),
  ];
  const stripped = stripDiacritics(source);

  assertEquals(source[1], grapheme("alpha", false, ["smooth", "acute"]));
  assertEquals(stripped[1], grapheme("alpha"));
  assertEquals(stripped === source, false);
  assertEquals(stripDiacritics([grapheme("alpha")])[0], grapheme("alpha"));
});
