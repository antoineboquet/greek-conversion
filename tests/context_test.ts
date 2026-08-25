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

Deno.test("makes nasal-gamma transliteration optional", () => {
  const literal = { orthography: { nasalGamma: "literal" } } as const;

  assertNfcEquals(
    convert("γγ γκ γξ γχ", "greek", "transliteration", literal),
    "gg gk gx gch",
  );
  assertNfcEquals(
    convert("ΓΓ ΓΚ ΓΞ ΓΧ", "greek", "transliteration", literal),
    "GG GK GX GCh",
  );
  assertNfcEquals(
    convert("gg gk gx gch", "transliteration", "greek", literal),
    "γγ γκ γξ γχ",
  );
  assertNfcEquals(
    convert("ng nk nx nch", "transliteration", "greek", literal),
    "νγ νκ νξ νχ",
  );
});

Deno.test("aspirates an elided final mute before a rough breathing", () => {
  assertNfcEquals(
    convert("ap’ hēmō̃n", "transliteration", "greek"),
    "ἀφ’ ἡμῶν",
  );
  assertNfcEquals(
    convert("t’ hḗde", "transliteration", "greek"),
    "θ’ ἥδε",
  );
  assertNfcEquals(
    convert("dek’ hén", "transliteration", "greek"),
    "δεχ’ ἕν",
  );
});

Deno.test("recognizes common Unicode elision marks", () => {
  for (const mark of ["'", "\u02BC", "\u1FBD", "\u2019"]) {
    assertNfcEquals(
      convert(`ap${mark} hēmō̃n`, "transliteration", "greek"),
      `ἀφ${mark} ἡμῶν`,
    );
  }
});

Deno.test("does not aspirate outside the elision context", () => {
  assertNfcEquals(
    convert("ap’ emoũ", "transliteration", "greek"),
    "ἀπ’ ἐμοῦ",
  );
  assertNfcEquals(
    convert("ap hēmō̃n", "transliteration", "greek"),
    "ἀπ ἡμῶν",
  );
  assertNfcEquals(
    convert("ap’ hēmō̃n", "transliteration", "beta-code"),
    "a)p’ h(mw=n",
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

Deno.test("handles rare omega-upsilon as an initial diphthong", () => {
  assertNfcEquals(
    convert("hōu", "transliteration", "greek"),
    "ωὑ",
  );
  assertNfcEquals(
    convert("ωὑ", "greek", "transliteration"),
    "hōu",
  );
});

Deno.test("normalizes a misplaced initial diphthong breathing", () => {
  assertNfcEquals(convert("ἁι", "greek", "greek"), "αἱ");
  assertNfcEquals(convert("a(i", "beta-code", "beta-code"), "ai(");
  assertNfcEquals(convert("a)i", "beta-code", "greek"), "αἰ");
});

Deno.test("does not infer breathings on internal vowel groups", () => {
  assertNfcEquals(convert("kau", "transliteration", "greek"), "καυ");
  assertNfcEquals(convert("καὑ", "greek", "transliteration"), "kahu");
  assertNfcEquals(convert("kahu", "transliteration", "greek"), "καὑ");
});

Deno.test("iota subscript prevents grouping with a following vowel", () => {
  assertNfcEquals(
    encode([
      grapheme("alpha", false, ["rough", "iota-subscript"]),
      grapheme("upsilon"),
    ], "greek"),
    "ᾁυ",
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
