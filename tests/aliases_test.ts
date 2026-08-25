import { convert } from "../src/mod.ts";
import { assertNfcEquals } from "./assertions.ts";
import { ACCEPTED_ALIASES } from "./fixtures.ts";

Deno.test("accepted aliases converge to canonical transliteration", () => {
  for (const { format, input, transliteration } of ACCEPTED_ALIASES) {
    assertNfcEquals(
      convert(input, format, "transliteration"),
      transliteration,
    );
  }
});
