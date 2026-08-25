import { assertEquals } from "@std/assert";
import {
  betaCodeToGreek,
  betaCodeToTransliteration,
  type ConversionOptions,
  convert,
  encode,
  type Format,
  greekToBetaCode,
  greekToTransliteration,
  parse,
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
    greek: "αἴσθησις",
    betaCode: "ai)/sqhsis",
    transliteration: "aísthēsis",
  },
  {
    greek: "ἄϋλος",
    betaCode: "a)/u+los",
    transliteration: "áülos",
  },
  {
    greek: "ὑΐδιον",
    betaCode: "u(i+/dion",
    transliteration: "huḯdion",
  },
  {
    greek: "πολύρριζος",
    betaCode: "polu/rrizos",
    transliteration: "polúrrhizos",
  },
  {
    greek: "ῥήτωρ",
    betaCode: "r(h/twr",
    transliteration: "rhḗtōr",
  },
  {
    greek: "ποιῇ",
    betaCode: "poih=|",
    transliteration: "poiȩ̄̃",
  },
  {
    greek: "ΠΟΙῌ͂",
    betaCode: "POIH=|",
    transliteration: "POIȨ̄̃",
  },
  {
    greek: "Αἶα",
    betaCode: "Ai)=a",
    transliteration: "Aĩa",
  },
  {
    greek: "Ἠώς",
    betaCode: "H)w/s",
    transliteration: "Ēṓs",
  },
  {
    greek: "ἀφ’, ἀλλ’.",
    betaCode: "a)f’, a)ll’.",
    transliteration: "aph’, all’.",
  },
  {
    greek: "Φίληβος ἢ Περὶ ἡδονῆς",
    betaCode: "Fi/lhbos h)\\ Peri\\ h(donh=s",
    transliteration: "Phílēbos ḕ Perì hēdonē̃s",
  },
  {
    greek: "Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων,",
    betaCode: "E(/llhsin e)ge/neto kai\\ me/rei tini\\ tw=n barba/rwn,",
    transliteration: "Héllēsin egéneto kaì mérei tinì tō̃n barbárōn,",
  },
  {
    greek: "ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.",
    betaCode: "w(s de\\ ei)pei=n kai\\ e)pi\\ plei=ston a)nqrw/pwn.",
    transliteration: "hōs dè eipeĩn kaì epì pleĩston anthrṓpōn.",
  },
] as const satisfies readonly Equivalence[];

const ACCEPTED_ALIASES = [
  {
    format: "greek",
    input: "πολύῤῥιζος",
    transliteration: "polúrrhizos",
  },
  {
    format: "beta-code",
    input: "polu/r)r(izos",
    transliteration: "polúrrhizos",
  },
] as const satisfies readonly {
  format: Format;
  input: string;
  transliteration: string;
}[];

const FORMATS = ["greek", "beta-code", "transliteration"] as const;

const SMOOTH_ROUGH_DOUBLE_RHO = {
  orthography: {
    doubleRho: "smooth-rough",
  },
} as const satisfies ConversionOptions;

function valueFor(equivalence: Equivalence, format: Format): string {
  switch (format) {
    case "greek":
      return equivalence.greek;
    case "beta-code":
      return equivalence.betaCode;
    case "transliteration":
      return equivalence.transliteration;
  }
}

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

Deno.test("canonical documents survive encode-parse round trips", () => {
  for (const equivalence of EQUIVALENCES) {
    for (const format of FORMATS) {
      const document = parse(valueFor(equivalence, format), format);
      const reparsed = parse(encode(document, format), format);

      assertEquals(reparsed, document);
    }
  }
});

Deno.test("accepts non-canonical aliases", () => {
  for (const { format, input, transliteration } of ACCEPTED_ALIASES) {
    assertNfcEquals(
      convert(input, format, "transliteration"),
      transliteration,
    );
  }
});

Deno.test("applies double-rho orthography on demand", () => {
  assertNfcEquals(
    transliterationToGreek("polúrrhizos", SMOOTH_ROUGH_DOUBLE_RHO),
    "πολύῤῥιζος",
  );
  assertNfcEquals(
    transliterationToBetaCode("polúrrhizos", SMOOTH_ROUGH_DOUBLE_RHO),
    "polu/r)r(izos",
  );
  assertNfcEquals(
    convert(
      "πολύρριζος",
      "greek",
      "greek",
      SMOOTH_ROUGH_DOUBLE_RHO,
    ),
    "πολύῤῥιζος",
  );
});

Deno.test("preserves literals", () =>
  assertNfcEquals(transliterationToGreek("logos 🙂 123"), "λογος 🙂 123"));
