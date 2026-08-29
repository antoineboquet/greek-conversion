import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  convert,
  convertDetailed,
  createConverter,
  GreekText,
} from "../npm/esm/mod.js";
import { encode, parse, validateDocument } from "../npm/esm/document.js";

const packageJson = JSON.parse(
  await readFile(new URL("../npm/package.json", import.meta.url), "utf8"),
);
assert.equal(packageJson.name, "@humanities/greek-conversion");
assert.equal(packageJson.license, "AGPL-3.0-or-later");

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

const restricted = createConverter({ exclude: ["stigma"] });
assert.equal(
  restricted.convert("αϛβ", "greek", "transliteration"),
  "aϛb",
);

const text = new GreekText("a)/nqrwpos", "beta-code");
assert.equal(text.transliteration, "ánthrōpos");

const document = parse("a)/nqrwpos", "beta-code");
assert.deepEqual(validateDocument(document), []);
assert.equal(encode(document, "greek"), "ἄνθρωπος");

console.log("npm ESM smoke test passed");
