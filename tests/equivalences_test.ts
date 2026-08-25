import { assertEquals } from "@std/assert";
import {
  betaCodeToGreek,
  betaCodeToTransliteration,
  encode,
  greekToBetaCode,
  greekToTransliteration,
  parse,
  transliterationToBetaCode,
  transliterationToGreek,
} from "../src/mod.ts";
import { assertNfcEquals } from "./assertions.ts";
import { EQUIVALENCES, FORMATS, valueFor } from "./fixtures.ts";

Deno.test("canonical Greek and Beta Code equivalences", () => {
  for (const { greek, betaCode } of EQUIVALENCES) {
    assertNfcEquals(greekToBetaCode(greek), betaCode);
    assertNfcEquals(betaCodeToGreek(betaCode), greek);
  }
});

Deno.test("canonical Greek and transliteration equivalences", () => {
  for (const { greek, transliteration } of EQUIVALENCES) {
    assertNfcEquals(greekToTransliteration(greek), transliteration);
    assertNfcEquals(transliterationToGreek(transliteration), greek);
  }
});

Deno.test("canonical Beta Code and transliteration equivalences", () => {
  for (const { betaCode, transliteration } of EQUIVALENCES) {
    assertNfcEquals(betaCodeToTransliteration(betaCode), transliteration);
    assertNfcEquals(transliterationToBetaCode(transliteration), betaCode);
  }
});

Deno.test("canonical documents survive encode-parse round trips", () => {
  for (const equivalence of EQUIVALENCES) {
    for (const format of FORMATS) {
      const document = parse(valueFor(equivalence, format), format);
      assertEquals(parse(encode(document, format), format), document);
    }
  }
});

Deno.test("preserves literals", () =>
  assertNfcEquals(transliterationToGreek("logos 🙂 123"), "λογος 🙂 123"));
