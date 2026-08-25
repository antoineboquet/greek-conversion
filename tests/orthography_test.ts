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
