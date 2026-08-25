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

function assertNfcEquals(actual: string, expected: string): void {
  assertEquals(actual, actual.normalize("NFC"), "Output must be NFC");
  assertEquals(actual, expected.normalize("NFC"));
}

Deno.test("Greek and Beta Code", () => {
  for (const { greek, betaCode } of EQUIVALENCES) {
    assertNfcEquals(greekToBetaCode(greek), betaCode);
    assertNfcEquals(betaCodeToGreek(betaCode), greek);
  }
});

Deno.test("Greek and transliteration", () => {
  for (const { greek, transliteration } of EQUIVALENCES) {
    assertNfcEquals(greekToTransliteration(greek), transliteration);
    assertNfcEquals(transliterationToGreek(transliteration), greek);
  }
});

Deno.test("Beta Code and transliteration", () => {
  for (const { betaCode, transliteration } of EQUIVALENCES) {
    assertNfcEquals(betaCodeToTransliteration(betaCode), transliteration);
    assertNfcEquals(transliterationToBetaCode(transliteration), betaCode);
  }
});

Deno.test("preserves literals", () =>
  assertNfcEquals(transliterationToGreek("logos 🙂 123"), "λογος 🙂 123"));
