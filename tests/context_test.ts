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
