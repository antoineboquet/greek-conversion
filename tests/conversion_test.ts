import { assertEquals } from "@std/assert";
import {
  betaCodeToGreek,
  betaCodeToTransliteration,
  greekToBetaCode,
  greekToTransliteration,
  transliterationToBetaCode,
  transliterationToGreek,
} from "../src/mod.ts";

interface Equivalence {
  greek: string;
  betaCode: string;
  transliteration: string;
}

const EQUIVALENCES = [
  {
    greek: "ἄνθρωπος",
    betaCode: "a)/nqrwpos",
    transliteration: "ánthrōpos",
  },
  {
    greek: "Ἄϊδα",
    betaCode: "A)/i+da",
    transliteration: "Áïda",
  },
  {
    greek: "Ῥόδος",
    betaCode: "R(o/dos",
    transliteration: "Rhódos",
  },
  {
    greek: "Φίληβος ἢ Περὶ ἡδονῆς",
    betaCode: "Fi/lhbos h)\\ Peri\\ h(donh=s",
    transliteration: "Phílēbos ḕ Perì hēdonē̃s",
  },
  {
    greek: "ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.",
    betaCode: "w(s de\\ ei)pei=n kai\\ e)pi\\ plei=ston a)nqrw/pwn.",
    transliteration: "hōs dè eipeĩn kaì epì pleĩston anthrṓpōn.",
  },
] as const satisfies readonly Equivalence[];

Deno.test("Greek and Beta Code", () => {
  for (const { greek, betaCode } of EQUIVALENCES) {
    assertEquals(greekToBetaCode(greek), betaCode);
    assertEquals(betaCodeToGreek(betaCode), greek);
  }
});

Deno.test("Greek and transliteration", () => {
  for (const { greek, transliteration } of EQUIVALENCES) {
    assertEquals(greekToTransliteration(greek), transliteration);
    assertEquals(transliterationToGreek(transliteration), greek);
  }
});

Deno.test("Beta Code and transliteration", () => {
  for (const { betaCode, transliteration } of EQUIVALENCES) {
    assertEquals(betaCodeToTransliteration(betaCode), transliteration);
    assertEquals(transliterationToBetaCode(transliteration), betaCode);
  }
});

Deno.test("preserves literals", () =>
  assertEquals(transliterationToGreek("logos 🙂 123"), "λογος 🙂 123"));
