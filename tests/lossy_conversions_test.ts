import { convert } from "../src/mod.ts";
import { assertNfcEquals } from "./assertions.ts";
import { LOSSY_CONVERSIONS } from "./fixtures.ts";

Deno.test("lossy conversions return their documented canonical form", async (t) => {
  for (const conversion of LOSSY_CONVERSIONS) {
    await t.step(conversion.name, () => {
      const intermediate = convert(
        conversion.source,
        conversion.sourceFormat,
        conversion.intermediateFormat,
      );

      assertNfcEquals(intermediate, conversion.intermediate);
      assertNfcEquals(
        convert(
          intermediate,
          conversion.intermediateFormat,
          conversion.sourceFormat,
        ),
        conversion.canonicalRoundTrip,
      );
    });
  }
});
