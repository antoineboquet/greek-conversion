import {
  convert,
  transliterationToBetaCode,
  transliterationToGreek,
} from "../src/mod.ts";
import { assertNfcEquals } from "./assertions.ts";
import { MEDIAL_BETA_SYMBOL, SMOOTH_ROUGH_DOUBLE_RHO } from "./fixtures.ts";

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

Deno.test("applies the beta symbol only to medial lowercase beta", () => {
  assertNfcEquals(transliterationToGreek("bárbaros"), "βάρβαρος");
  assertNfcEquals(
    transliterationToGreek("bárbaros", MEDIAL_BETA_SYMBOL),
    "βάρϐαρος",
  );
  assertNfcEquals(
    convert("β β βββ", "greek", "greek", MEDIAL_BETA_SYMBOL),
    "β β βϐϐ",
  );
  assertNfcEquals(
    convert("ΒΒ", "greek", "greek", MEDIAL_BETA_SYMBOL),
    "ΒΒ",
  );
});

Deno.test("applies the requested coronis transliteration", () => {
  assertNfcEquals(convert("κἀγώ", "greek", "transliteration"), "kagṓ");
  assertNfcEquals(
    convert("κἀγώ", "greek", "transliteration", {
      orthography: { coronis: "omit" },
    }),
    "kagṓ",
  );
  assertNfcEquals(
    convert("κἀγώ", "greek", "transliteration", {
      orthography: { coronis: "apostrophe" },
    }),
    "ka\u2019gṓ",
  );
  assertNfcEquals(
    convert("κἀγώ", "greek", "transliteration", {
      orthography: { coronis: "greek" },
    }),
    "ka\u1FBDgṓ",
  );
  assertNfcEquals(
    convert("τοὔνομα", "greek", "transliteration", {
      orthography: { coronis: "apostrophe" },
    }),
    "toú\u2019noma",
  );
  assertNfcEquals(
    convert("τοὔνομα", "greek", "transliteration", {
      orthography: { coronis: "greek" },
    }),
    "toú\u1FBDnoma",
  );
  assertNfcEquals(
    convert("ἄνθρωπος", "greek", "transliteration", {
      orthography: { coronis: "apostrophe" },
    }),
    "ánthrōpos",
  );
});

Deno.test("applies lunate sigma orthography on demand", () => {
  const lunate = { orthography: { sigma: "lunate" } } as const;

  assertNfcEquals(convert("σος ΣΟΣ", "greek", "greek"), "σος ΣΟΣ");
  assertNfcEquals(
    convert("σος ΣΟΣ", "greek", "greek", lunate),
    "ϲοϲ ϹΟϹ",
  );
  assertNfcEquals(
    convert("σος ΣΟΣ", "greek", "beta-code", lunate),
    "S3oS3 *S3O*S3",
  );
  assertNfcEquals(
    convert("S3oS3 *S3O*S3", "beta-code", "greek"),
    "σος ΣΟΣ",
  );
  assertNfcEquals(
    convert("S3oS3 *S3O*S3", "beta-code", "greek", lunate),
    "ϲοϲ ϹΟϹ",
  );
  assertNfcEquals(
    convert("sos", "transliteration", "greek", lunate),
    "ϲοϲ",
  );
  assertNfcEquals(convert("ϲοϲ", "greek", "transliteration"), "sos");
});

Deno.test("converts marked alphabetic numerals to decimal on demand", () => {
  const decimal = { orthography: { numerals: "decimal" } } as const;
  const greek = "αʹ ͵βκγʹ ϛʹ ϝʹ ϟʹ ϙʹ ϡʹ σʹ";

  assertNfcEquals(convert(greek, "greek", "greek"), greek);
  for (const format of ["greek", "beta-code", "transliteration"] as const) {
    assertNfcEquals(
      convert(greek, "greek", format, decimal),
      "1 2023 6 6 90 90 900 200",
    );
  }
  assertNfcEquals(
    convert("#22bkg#", "beta-code", "greek", decimal),
    "2023",
  );
  assertNfcEquals(
    convert("͵bkgʹ", "transliteration", "greek", decimal),
    "2023",
  );

  assertNfcEquals(
    convert("αβγ αβʹ ͵ιʹ", "greek", "greek", decimal),
    "αβγ αβʹ ͵ιʹ",
  );
});

Deno.test("numeral glyphs override contextual letter styling", () => {
  const styled = {
    orthography: { medialBeta: "symbol", sigma: "lunate" },
  } as const;

  assertNfcEquals(convert("βίος σός", "greek", "greek", styled), "βίοϲ ϲόϲ");
  assertNfcEquals(convert("βʹ σʹ", "greek", "greek", styled), "βʹ σʹ");
  assertNfcEquals(convert("βʹ σʹ", "greek", "beta-code", styled), "b# s#");
});
