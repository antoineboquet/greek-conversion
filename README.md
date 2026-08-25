# gc-next

A deterministic conversion engine for polytonic Greek, Beta Code and scientific
transliteration.

The engine separates parsers, a canonical grapheme model, and encoders. It
supports every direction between the three formats, uses one canonical spelling
per output format, normalizes output to NFC, and preserves unknown characters.

```ts
import { betaCodeToGreek, convert } from "./src/mod.ts";

betaCodeToGreek("a)/nqrwpos"); // ἄνθρωπος
convert("ἄνθρωπος", "greek", "transliteration"); // ánthrōpos
```

Double rho is unmarked in canonical Greek and Beta Code output. Apply the
optional polytonic convention when needed:

```ts
transliterationToGreek("polúrrhizos", {
  orthography: { doubleRho: "smooth-rough" },
}); // πολύῤῥιζος
```

Run `deno task check` and `deno task test`.
