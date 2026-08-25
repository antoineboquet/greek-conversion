import { assertEquals } from "@std/assert";
import { convert, convertDetailed } from "../src/mod.ts";
import {
  EQUIVALENCES,
  FORMATS,
  LOSSY_CONVERSIONS,
  valueFor,
} from "./fixtures.ts";

Deno.test("canonical equivalences are reported as lossless", () => {
  for (const equivalence of EQUIVALENCES) {
    for (const from of FORMATS) {
      for (const to of FORMATS) {
        const input = valueFor(equivalence, from);
        const result = convertDetailed(input, from, to);

        assertEquals(result.output, convert(input, from, to));
        assertEquals(result.lossy, false, `${from} → ${to}: ${input}`);
        assertEquals(result.losses, []);
      }
    }
  }
});

Deno.test("every documented lossy conversion is detected", async (t) => {
  for (const conversion of LOSSY_CONVERSIONS) {
    await t.step(conversion.name, () => {
      const options = "options" in conversion
        ? conversion.options
        : undefined;
      const result = convertDetailed(
        conversion.source,
        conversion.sourceFormat,
        conversion.intermediateFormat,
        options,
      );

      assertEquals(result.lossy, true);
      assertEquals(result.losses.length > 0, true);
      assertEquals(
        result.output,
        convert(
          conversion.source,
          conversion.sourceFormat,
          conversion.intermediateFormat,
          options,
        ),
      );
    });
  }
});

Deno.test("reports each removed diacritic at its source token", () => {
  const result = convertDetailed("[ἄ]", "greek", "greek", {
    removeDiacritics: true,
  });

  assertEquals(result.output, "[α]");
  assertEquals(result.lossy, true);
  assertEquals(result.losses, [
    {
      code: "removed-diacritic",
      index: 1,
      diacritic: "smooth",
      message: "The target representation does not retain smooth.",
    },
    {
      code: "removed-diacritic",
      index: 1,
      diacritic: "acute",
      message: "The target representation does not retain acute.",
    },
  ]);
});

Deno.test("reports only selectively removed diacritics", () => {
  const result = convertDetailed("ἄ ἅ", "greek", "greek", {
    diacritics: { accents: "remove" },
  });

  assertEquals(result.output, "ἀ ἁ");
  assertEquals(result.lossy, true);
  assertEquals(
    result.losses.map(({ code, index, diacritic }) => ({
      code,
      index,
      diacritic,
    })),
    [
      { code: "removed-diacritic", index: 0, diacritic: "acute" },
      { code: "removed-diacritic", index: 2, diacritic: "acute" },
    ],
  );
});

Deno.test("reports case changes separately from removed diacritics", () => {
  const result = convertDetailed("Ἄβ", "greek", "greek", {
    diacritics: { accents: "remove" },
    orthography: { letterCase: "lowercase" },
  });

  assertEquals(result.output, "ἀβ");
  assertEquals(result.lossy, true);
  assertEquals(result.losses, [
    {
      code: "changed-case",
      index: 0,
      message: "The target representation does not retain letter case.",
    },
    {
      code: "removed-diacritic",
      index: 0,
      diacritic: "acute",
      message: "The target representation does not retain acute.",
    },
  ]);
});

Deno.test("canonical Unicode variants are not information loss", () => {
  const oxia = convertDetailed("ά;·", "greek", "greek", {
    unicode: {
      acute: "oxia",
      questionMark: "greek",
      anoTeleia: "greek",
    },
  });
  const decomposed = convertDetailed("ἄ", "greek", "greek", {
    unicode: { composition: "decomposed" },
  });

  assertEquals(oxia.lossy, false);
  assertEquals(decomposed.lossy, false);
});

Deno.test("Greek coronis scalar retains semantic provenance", () => {
  const result = convertDetailed(
    "κἀγώ",
    "greek",
    "transliteration",
    { orthography: { coronis: "greek" } },
  );

  assertEquals(result.output, "ka\u1FBDgṓ");
  assertEquals(result.lossy, false);
  assertEquals(result.losses, []);
});

Deno.test("deterministic added marks are not information loss", () => {
  const result = convertDetailed(
    "πολύρριζος",
    "greek",
    "greek",
    { orthography: { doubleRho: "smooth-rough" } },
  );

  assertEquals(result.output, "πολύῤῥιζος");
  assertEquals(result.lossy, false);
  assertEquals(result.losses, []);
});

Deno.test("selected transliteration variants retain recoverable letters", () => {
  const result = convertDetailed(
    "βηξφχυ ρρ μπ",
    "greek",
    "transliteration",
    {
      orthography: {
        beta: "v",
        chi: "kh",
        eta: "ī",
        modernDigraphs: "phonetic",
        phi: "f",
        rho: "systematic",
        upsilon: "y",
        xi: "ks",
      },
    },
  );

  assertEquals(result.output, "vīksfkhy rrh b");
  assertEquals(result.lossy, false);
  assertEquals(result.losses, []);
});

Deno.test("ALA-LC modern digraph spellings retain recoverable letters", () => {
  const result = convertDetailed(
    "μπ β ντ δ γκ αγκά αγκ",
    "greek",
    "transliteration",
    {
      orthography: {
        beta: "v",
        modernDigraphs: "ala-lc",
      },
    },
  );

  assertEquals(result.output, "b v d̲ d gk anká agk");
  assertEquals(result.lossy, false);
  assertEquals(result.losses, []);
});

Deno.test("reports destructive orthography policies from their actual input", () => {
  const whitespace = convertDetailed("  α\tβ  ", "greek", "greek", {
    orthography: { whitespace: "collapse" },
  });
  const modernNt = convertDetailed("ντο", "greek", "transliteration", {
    orthography: { modernDigraphs: "phonetic" },
  });
  const systematicRoughRho = convertDetailed(
    "ῥ",
    "greek",
    "transliteration",
    { orthography: { rho: "systematic" } },
  );

  assertEquals(whitespace.output, "α β");
  assertEquals(whitespace.lossy, true);
  assertEquals(modernNt.output, "do");
  assertEquals(modernNt.lossy, true);
  assertEquals(systematicRoughRho.output, "rh");
  assertEquals(systematicRoughRho.lossy, true);
});

Deno.test("preserved unknown literals remain lossless", () => {
  const result = convertDetailed("😀 𝄞 𐀀", "greek", "transliteration");

  assertEquals(result.output, "😀 𝄞 𐀀");
  assertEquals(result.lossy, false);
});
