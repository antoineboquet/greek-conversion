import { assertEquals } from "@std/assert";
import {
  convert,
  convertDetailed,
  getPresetOptions,
  PRESETS,
  resolveConversionOptions,
} from "../src/mod.ts";
import { parse } from "../src/document.ts";
import { assertNfcEquals } from "./assertions.ts";

Deno.test("exposes the complete stable preset identifiers", () => {
  assertEquals(PRESETS, [
    "iso-843-type-1",
    "ala-lc-ancient",
    "ala-lc-modern",
    "sbl-academic",
    "sbl-general",
    "tlg-core",
    "bnf-core",
  ]);
});

Deno.test("resolves custom options after nested preset options", () => {
  assertEquals(
    resolveConversionOptions({
      preset: "ala-lc-modern",
      diacritics: { accents: "preserve" },
      orthography: { beta: "b", letterCase: "uppercase" },
    }),
    {
      diacritics: {
        accents: "preserve",
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
    },
  );
});

Deno.test("returns detached preset option objects", () => {
  const first = getPresetOptions("ala-lc-modern");
  const second = getPresetOptions("ala-lc-modern");

  first.orthography!.beta = "b";
  assertEquals(second.orthography!.beta, "v");
});

Deno.test("rejects unknown preset names at runtime", () => {
  let error: unknown;
  try {
    resolveConversionOptions({ preset: "unknown" as never });
  } catch (caught) {
    error = caught;
  }

  assertEquals(error instanceof RangeError, true);
  assertEquals((error as Error).message, "Unknown conversion preset: unknown");
});

Deno.test("applies ISO 843 Type 1 spellings", () => {
  assertNfcEquals(
    convert("βήτα ἄγγελος φύσις κἀγώ", "greek", "transliteration", {
      preset: "iso-843-type-1",
    }),
    "vī́ta ággelos fýsis ka’gṓ",
  );
});

Deno.test("applies ancient ALA-LC policies without inferring breathings", () => {
  assertNfcEquals(
    convert(
      "Ἡσίοδου ἄϋλος υἱός κἀγώ βʹ",
      "greek",
      "transliteration",
      { preset: "ala-lc-ancient" },
    ),
    "Hēsiodou aylos huios kagō 2",
  );
});

Deno.test("contextual y retains an omitted diaeresis semantically", () => {
  const options = { preset: "ala-lc-ancient" } as const;
  const once = convert("ἄϋλος", "greek", "transliteration", options);

  assertEquals(once, "aylos");
  assertEquals(
    convert(once, "transliteration", "transliteration", options),
    once,
  );
  const reparsed = parse(once, "transliteration", options);
  assertEquals(reparsed[1].kind, "grapheme");
  if (reparsed[1].kind === "grapheme") {
    assertEquals(reparsed[1].diacritics.has("diaeresis"), true);
  }
});

Deno.test("applies modern ALA-LC contextual spellings", () => {
  assertNfcEquals(
    convert(
      "Βίος Μπάλα ΝΤΟ αγκά αγκ βʹ",
      "greek",
      "transliteration",
      { preset: "ala-lc-modern" },
    ),
    "Vios Bala D̲O anka agk 2",
  );
});

Deno.test("distinguishes academic and general SBL diacritics", () => {
  assertNfcEquals(
    convert("ἄϋλος ὑιός", "greek", "transliteration", {
      preset: "sbl-academic",
    }),
    "áÿlos huiós",
  );
  assertNfcEquals(
    convert("ἄϋλος ὑιός", "greek", "transliteration", {
      preset: "sbl-general",
    }),
    "aÿlos huios",
  );
});

Deno.test("core presets remain conservative and mixable", () => {
  assertNfcEquals(
    convert("ϲοϲ", "greek", "beta-code", { preset: "tlg-core" }),
    "sos",
  );
  assertNfcEquals(
    convert("κἀγώ", "greek", "transliteration", {
      preset: "bnf-core",
      orthography: { coronis: "greek" },
    }),
    "ka᾽gṓ",
  );
});

Deno.test("convertDetailed reports losses introduced by presets", () => {
  const result = convertDetailed(
    "ἄνθρωπος",
    "greek",
    "transliteration",
    { preset: "ala-lc-ancient" },
  );

  assertEquals(result.lossy, true);
  assertEquals(
    result.losses.map((loss) => loss.code),
    ["removed-diacritic"],
  );
});
