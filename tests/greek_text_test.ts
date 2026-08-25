import { assertEquals } from "@std/assert";
import { convertDetailed, GreekText } from "../src/mod.ts";
import { assertNfcEquals } from "./assertions.ts";

Deno.test("GreekText exposes every representation from one canonical document", () => {
  const text = new GreekText("a)/nqrwpos", "beta-code");

  assertEquals(text.source, "a)/nqrwpos");
  assertEquals(text.sourceFormat, "beta-code");
  assertNfcEquals(text.greek, "ἄνθρωπος");
  assertEquals(text.betaCode, "a)/nqrwpos");
  assertNfcEquals(text.transliteration, "ánthrōpos");
  assertEquals(text.to("greek"), text.greek);
  assertEquals(text.to("beta-code"), text.betaCode);
  assertEquals(text.to("transliteration"), text.transliteration);
});

Deno.test("GreekText retains the raw source while canonicalizing its format", () => {
  const text = new GreekText("S3oS3", "beta-code");

  assertEquals(text.source, "S3oS3");
  assertEquals(text.betaCode, "sos");
  assertNfcEquals(text.greek, "σος");
});

Deno.test("GreekText resolves presets and custom overrides once", () => {
  const text = new GreekText("Βίος Μπάλα", "greek", {
    preset: "ala-lc-modern",
    orthography: { beta: "b", letterCase: "uppercase" },
  });

  assertEquals(text.transliteration, "BIOS BALA");
  assertEquals(text.options, {
    diacritics: {
      accents: "remove",
      smoothBreathing: "remove",
      roughBreathing: "preserve",
      coronis: "remove",
      diaeresis: "remove",
      iotaSubscript: "remove",
      quantity: "remove",
    },
    orthography: {
      beta: "b",
      modernDigraphs: "ala-lc",
      numerals: "decimal",
      upsilon: "y-with-diphthong-u",
      letterCase: "uppercase",
    },
  });
});

Deno.test("GreekText does not expose mutable internal state", () => {
  const text = new GreekText("ἄνθρωπος", "greek", {
    preset: "sbl-academic",
  });
  const document = text.document;
  const options = text.options;

  assertEquals(Object.isFrozen(text), true);

  if (document[0].kind === "grapheme") {
    document[0].letter = "omega";
    document[0].diacritics.clear();
  }
  options.orthography!.upsilon = "u";

  assertNfcEquals(text.greek, "ἄνθρωπος");
  assertNfcEquals(text.transliteration, "ánthrōpos");
  assertEquals(text.options.orthography!.upsilon, "y-with-diphthong-u");
});

Deno.test("GreekText detailed output shares the functional loss contract", () => {
  const options = { preset: "sbl-general" } as const;
  const text = new GreekText("ἄνθρωπος", "greek", options);
  const detailed = text.toDetailed("transliteration");

  assertEquals(detailed, convertDetailed(
    "ἄνθρωπος",
    "greek",
    "transliteration",
    options,
  ));
  assertEquals(detailed.output, "anthrōpos");
  assertEquals(detailed.lossy, true);
  assertEquals(
    detailed.losses.map(({ code, diacritic }) => ({ code, diacritic })),
    [{ code: "removed-diacritic", diacritic: "acute" }],
  );
});

Deno.test("GreekText handles empty and unknown literal input", () => {
  const empty = new GreekText("", "greek");
  const literals = new GreekText("😀 𝄞", "greek");

  assertEquals(empty.greek, "");
  assertEquals(empty.betaCode, "");
  assertEquals(empty.transliteration, "");
  assertEquals(literals.greek, "😀 𝄞");
  assertEquals(literals.betaCode, "😀 𝄞");
  assertEquals(literals.transliteration, "😀 𝄞");
});
