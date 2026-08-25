import { assertEquals } from "@std/assert";
import {
  betaCodeToGreek,
  betaCodeToTransliteration,
  greekToBetaCode,
  greekToTransliteration,
  transliterationToBetaCode,
  transliterationToGreek,
} from "../src/mod.ts";

Deno.test("Greek and Beta Code", () => {
  assertEquals(greekToBetaCode("ἄνθρωπος"), "a)/nqrwpos");
  assertEquals(betaCodeToGreek("a)/nqrwpos"), "ἄνθρωπος");

  assertEquals(greekToBetaCode("Ἄϊδα"), "A)/i+da");
  assertEquals(betaCodeToGreek("A)/i+da"), "Ἄϊδα");
});

Deno.test("Greek and transliteration", () => {
  assertEquals(greekToTransliteration("ἄνθρωπος"), "ánthrōpos".normalize("NFC"));
  assertEquals(transliterationToGreek("ánthrōpos"), "ἄνθρωπος");

  assertEquals(greekToTransliteration("Ῥόδος"), "Rhódos".normalize("NFC"));
  assertEquals(transliterationToGreek("Rhódos"), "Ῥόδος");
});

Deno.test("Beta Code and transliteration", () => {
  assertEquals(betaCodeToTransliteration("a)/nqrwpos"), "ánthrōpos".normalize("NFC"));
  assertEquals(transliterationToBetaCode("ánthrōpos"), "a)/nqrwpos");
});

Deno.test("preserves literals", () =>
  assertEquals(transliterationToGreek("logos 🙂 123"), "λογος 🙂 123"));
