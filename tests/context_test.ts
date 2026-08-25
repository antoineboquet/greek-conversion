import { convert, encode, greekToBetaCode } from "../src/mod.ts";
import { grapheme } from "../src/model.ts";
import { assertNfcEquals } from "./assertions.ts";

Deno.test("preserves case when transliterating nasal gamma", () => {
  assertNfcEquals(
    convert("ΓΓ ΓΚ ΓΞ ΓΧ", "greek", "transliteration"),
    "NG NK NX NCh",
  );
  assertNfcEquals(
    convert("NG NK NX NCh", "transliteration", "greek"),
    "ΓΓ ΓΚ ΓΞ ΓΧ",
  );
});

Deno.test("places initial breathings on the diphthong target", () => {
  assertNfcEquals(
    convert("haíresis", "transliteration", "greek"),
    "αἵρεσις",
  );
  assertNfcEquals(
    convert("αἵρεσις", "greek", "transliteration"),
    "haíresis",
  );
  assertNfcEquals(
    convert("Haíresis", "transliteration", "greek"),
    "Αἵρεσις",
  );
  assertNfcEquals(
    convert("Αἵρεσις", "greek", "transliteration"),
    "Haíresis",
  );
});

Deno.test("diaeresis prevents an initial diphthong", () => {
  assertNfcEquals(
    convert("huḯdion", "transliteration", "greek"),
    "ὑΐδιον",
  );
  assertNfcEquals(
    convert("ὑΐδιον", "greek", "transliteration"),
    "huḯdion",
  );
});

Deno.test("quantity marks do not infer an initial smooth breathing", () => {
  assertNfcEquals(
    convert("ā ĭ ī ŭ ū", "transliteration", "greek"),
    "ᾱ ῐ ῑ ῠ ῡ",
  );
  assertNfcEquals(
    convert("ᾱ ῐ ῑ ῠ ῡ", "greek", "transliteration"),
    "ā ĭ ī ŭ ū",
  );
  assertNfcEquals(
    convert("ā", "transliteration", "beta-code"),
    "a&",
  );
  assertNfcEquals(
    convert("hā", "transliteration", "greek"),
    "ἁ̄",
  );
});

Deno.test(
  "distinguishes internal coronis from initial smooth breathing",
  () => {
    assertNfcEquals(convert("κἀγώ", "greek", "beta-code"), "ka)gw/");
    assertNfcEquals(convert("ka)gw/", "beta-code", "greek"), "κἀγώ");
    assertNfcEquals(
      convert("a)nqrwpos", "beta-code", "greek"),
      "ἀνθρωπος",
    );
  },
);

Deno.test("preserves crasis while transliteration remains lossy", () => {
  assertNfcEquals(convert("τοὔνομα", "greek", "beta-code"), "tou)/noma");
  assertNfcEquals(convert("tou)/noma", "beta-code", "greek"), "τοὔνομα");
  assertNfcEquals(convert("τοὔνομα", "greek", "transliteration"), "toúnoma");
  assertNfcEquals(convert("toúnoma", "transliteration", "greek"), "τούνομα");
});

Deno.test("contracts pi-sigma in canonical Greek output", () => {
  assertNfcEquals(convert("πσ ΠΣ Πσ πΣ", "greek", "greek"), "ψ Ψ Ψ πΣ");
  assertNfcEquals(convert("ps PS Ps", "beta-code", "greek"), "ψ Ψ Ψ");
  assertNfcEquals(greekToBetaCode("πσ"), "ps");
});

Deno.test("does not contract separated or marked pi-sigma", () => {
  assertNfcEquals(convert("π σ", "greek", "greek"), "π ς");
  assertNfcEquals(
    encode(
      [grapheme("pi"), grapheme("sigma", false, ["acute"])],
      "greek",
    ),
    "πς́",
  );
});
