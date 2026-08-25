import { assertEquals } from "@std/assert";
import {
  type ConversionOptions,
  convert,
  type Format,
} from "../src/mod.ts";
import {
  EQUIVALENCES,
  FORMATS,
  valueFor,
} from "./fixtures.ts";

interface OptionProfile {
  name: string;
  options: ConversionOptions;
}

const PROFILES = [
  { name: "defaults", options: {} },
  { name: "without diacritics", options: { removeDiacritics: true } },
  {
    name: "circumflex long vowels and contextual upsilon",
    options: {
      orthography: {
        longVowels: "circumflex",
        upsilon: "y-with-diphthong-u",
      },
    },
  },
  {
    name: "annotated long vowels and universal y",
    options: {
      orthography: {
        longVowels: "circumflex-macron",
        upsilon: "y",
      },
    },
  },
  {
    name: "Greek glyph policies",
    options: {
      orthography: {
        doubleRho: "smooth-rough",
        medialBeta: "symbol",
        sigma: "lunate",
      },
    },
  },
  {
    name: "literal transliteration policies",
    options: {
      orthography: {
        coronis: "apostrophe",
        nasalGamma: "literal",
        upsilon: "y",
      },
    },
  },
  {
    name: "lossy output policies",
    options: {
      removeDiacritics: true,
      orthography: {
        dentalSigma: "assimilate",
        numerals: "decimal",
      },
    },
  },
  {
    name: "monotonic Greek with system acute",
    options: {
      orthography: { accentuation: "monotonic" },
    },
  },
  {
    name: "decomposed Greek with forced punctuation",
    options: {
      unicode: {
        composition: "decomposed",
        acute: "oxia",
        questionMark: "greek",
        anoTeleia: "greek",
      },
    },
  },
] as const satisfies readonly OptionProfile[];

function assertStable(
  source: string,
  from: Format,
  to: Format,
  profile: OptionProfile,
): void {
  const once = convert(source, from, to, profile.options);
  const twice = convert(once, to, to, profile.options);

  assertEquals(
    twice,
    once,
    `${profile.name}: ${from} → ${to} output must be idempotent`,
  );
}

Deno.test("canonical outputs are idempotent for every format pair", () => {
  for (const equivalence of EQUIVALENCES) {
    for (const from of FORMATS) {
      for (const to of FORMATS) {
        const source = valueFor(equivalence, from);
        for (const profile of PROFILES) {
          assertStable(source, from, to, profile);
        }
      }
    }
  }
});

Deno.test("pathological Unicode remains stable under self-conversion", () => {
  const cases = [
    {
      format: "greek",
      source: "ἅ\u200Dσ\u0323—κἀγώ 😀",
    },
    {
      format: "beta-code",
      source: "a(/\u200Ds\u0323-ka)gw/ 😀",
    },
    {
      format: "transliteration",
      source: "há\u200Ds\u0323—ka’gṓ 😀",
    },
  ] as const satisfies readonly { format: Format; source: string }[];

  for (const { format, source } of cases) {
    for (const profile of PROFILES) {
      assertStable(source, format, format, profile);
    }
  }
});
