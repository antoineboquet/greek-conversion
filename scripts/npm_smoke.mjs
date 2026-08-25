import assert from "node:assert/strict";
import { convert, convertDetailed, GreekText } from "../npm/esm/mod.js";
import { encode, parse, validateDocument } from "../npm/esm/document.js";

assert.equal(convert("a)/nqrwpos", "beta-code", "greek"), "ἄνθρωπος");
assert.equal(
  convert("Βίος Μπάλα", "greek", "transliteration", {
    preset: "ala-lc-modern",
  }),
  "Vios Bala",
);

const detailed = convertDetailed("ἄνθρωπος", "greek", "greek", {
  orthography: { accentuation: "monotonic" },
});
assert.equal(detailed.lossy, true);

const text = new GreekText("a)/nqrwpos", "beta-code");
assert.equal(text.transliteration, "ánthrōpos");

const document = parse("a)/nqrwpos", "beta-code");
assert.deepEqual(validateDocument(document), []);
assert.equal(encode(document, "greek"), "ἄνθρωπος");

console.log("npm ESM smoke test passed");
