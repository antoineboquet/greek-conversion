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

Deno.test("preserved unknown literals remain lossless", () => {
  const result = convertDetailed("😀 𝄞 𐀀", "greek", "transliteration");

  assertEquals(result.output, "😀 𝄞 𐀀");
  assertEquals(result.lossy, false);
});
