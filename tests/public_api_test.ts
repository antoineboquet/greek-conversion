import { assertEquals } from "@std/assert";
import * as documentApi from "../src/document.ts";
import * as mainApi from "../src/mod.ts";

Deno.test("the main runtime API stays deliberately small", () => {
  assertEquals(Object.keys(mainApi).sort(), [
    "GreekText",
    "PRESETS",
    "betaCodeToGreek",
    "betaCodeToTransliteration",
    "convert",
    "convertDetailed",
    "foldGreekVariants",
    "formatGreekUnicode",
    "getPresetOptions",
    "greekToBetaCode",
    "greekToTransliteration",
    "removeDiacritics",
    "resolveConversionOptions",
    "toUnicodeCodePoints",
    "transliterationToBetaCode",
    "transliterationToGreek",
  ]);
});

Deno.test("canonical-document runtime helpers stay in the advanced entry point", () => {
  assertEquals(Object.keys(documentApi).sort(), [
    "applyGreekOrthography",
    "encode",
    "grapheme",
    "literal",
    "parse",
    "validateDocument",
  ]);
});
