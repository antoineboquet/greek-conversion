import { assertEquals } from "@std/assert";
import {
  type Diacritic,
  type Letter,
  parse,
  validateDocument,
  type ValidationCode,
} from "../src/mod.ts";
import { grapheme, literal } from "../src/model.ts";
import { EQUIVALENCES, FORMATS, valueFor } from "./fixtures.ts";

interface InvalidCase {
  letter: Letter;
  diacritics: readonly Diacritic[];
  codes: readonly ValidationCode[];
}

const INVALID_CASES = [
  {
    letter: "alpha",
    diacritics: ["acute", "grave"],
    codes: ["conflicting-accents"],
  },
  {
    letter: "alpha",
    diacritics: ["smooth", "rough"],
    codes: ["conflicting-breathings"],
  },
  {
    letter: "alpha",
    diacritics: ["coronis"],
    codes: ["invalid-coronis"],
  },
  {
    letter: "alpha",
    diacritics: ["coronis", "rough"],
    codes: ["conflicting-coronis-breathing", "invalid-coronis"],
  },
  {
    letter: "alpha",
    diacritics: ["macron", "breve"],
    codes: ["conflicting-quantities"],
  },
  {
    letter: "beta",
    diacritics: ["acute"],
    codes: ["invalid-accent"],
  },
  {
    letter: "beta",
    diacritics: ["rough"],
    codes: ["invalid-breathing"],
  },
  {
    letter: "epsilon",
    diacritics: ["circumflex"],
    codes: ["invalid-circumflex"],
  },
  {
    letter: "alpha",
    diacritics: ["diaeresis"],
    codes: ["invalid-diaeresis"],
  },
  {
    letter: "iota",
    diacritics: ["smooth", "diaeresis"],
    codes: ["incompatible-diaeresis-breathing"],
  },
  {
    letter: "iota",
    diacritics: ["iota-subscript"],
    codes: ["invalid-iota-subscript"],
  },
  {
    letter: "eta",
    diacritics: ["macron"],
    codes: ["invalid-quantity"],
  },
] as const satisfies readonly InvalidCase[];

Deno.test("canonical fixtures produce no validation diagnostics", () => {
  for (const equivalence of EQUIVALENCES) {
    for (const format of FORMATS) {
      assertEquals(
        validateDocument(parse(valueFor(equivalence, format), format)),
        [],
      );
    }
  }

  assertEquals(validateDocument(parse("κἀγώ", "greek")), []);
  assertEquals(validateDocument(parse("ka)gw/", "beta-code")), []);
});

Deno.test("invalid graphemes produce structured diagnostics", async (t) => {
  for (const invalid of INVALID_CASES) {
    await t.step(`${invalid.letter}: ${invalid.codes.join(", ")}`, () => {
      const diagnostics = validateDocument([
        literal("prefix"),
        grapheme(invalid.letter, false, invalid.diacritics),
      ]);

      assertEquals(diagnostics.map(({ code }) => code), [...invalid.codes]);
      assertEquals(diagnostics.map(({ index }) => index), [1]);
      assertEquals(
        diagnostics.every(({ message }) => message.length > 0),
        true,
      );
    });
  }
});

Deno.test("validation is pure", () => {
  const document = [grapheme("alpha", false, ["acute", "grave"])];
  const before = new Set(document[0].diacritics);

  validateDocument(document);

  assertEquals(document[0].diacritics, before);
});
