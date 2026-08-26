# greek-conversion

Convert polytonic or monotonic Greek, Beta Code, and scientific transliteration
in every direction.

`greek-conversion` provides predictable output, named standards-oriented
presets, and diagnostics when a conversion loses information. Unknown
characters are preserved instead of being silently discarded.

## Installation

The `1.0.0-beta.1` prerelease is ESM-only and targets JSR and npm:

```sh
deno add jsr:@humanities/greek-conversion@1.0.0-beta.1
npm install greek-conversion@beta
```

Import the public module from JSR:

```ts
import {
  betaCodeToGreek,
  convert,
  convertDetailed,
  GreekText,
} from "@humanities/greek-conversion";
```

The same named exports are available from `"greek-conversion"` in npm-based
projects.

## Quick start

Use `convert()` for any pair of supported formats:

```ts
convert("a)/nqrwpos", "beta-code", "greek");
// ἄνθρωπος

convert("ἄνθρωπος", "greek", "transliteration");
// ánthrōpos

convert("ánthrōpos", "transliteration", "beta-code");
// a)/nqrwpos
```

Directional helpers are also available when they make application code easier
to read:

```ts
betaCodeToGreek("a)/nqrwpos"); // ἄνθρωπος
```

The supported format names are `"greek"`, `"beta-code"`, and
`"transliteration"`.

## Choose the right API

| Need | API |
| --- | --- |
| Convert one string | `convert()` or a directional helper |
| Display a warning when information is lost | `convertDetailed()` |
| Reuse one parsed source in several formats | `GreekText` |
| Work directly with the canonical document | `parse()` and `encode()` |

All of these APIs use the same parser, canonical Greek document, conversion
options, and encoders.

## Use a preset

Presets collect coherent options for a published convention or a practical
interchange profile:

```ts
convert("Βίος Μπάλα", "greek", "transliteration", {
  preset: "ala-lc-modern",
});
// Vios Bala
```

Available presets:

| Preset | Intended use |
| --- | --- |
| `iso-843-type-1` | ISO 843:1997 Type 1 transliteration |
| `ala-lc-ancient` | ALA-LC conventions for Ancient Greek |
| `ala-lc-modern` | ALA-LC conventions and contextual rules for Modern Greek |
| `sbl-academic` | SBL academic transliteration |
| `sbl-general` | SBL general-purpose transliteration |
| `tlg-core` | The currently supported core of common TLG Beta Code |
| `bnf-core` | A conservative extension point for the supported BnF rules |

Custom options override only the corresponding fields of a preset:

```ts
convert("Βίος Μπάλα", "greek", "transliteration", {
  preset: "ala-lc-modern",
  orthography: { beta: "b" },
});
// Bios Bala
```

The priority is: library defaults, then preset options, then custom options.
See the complete [preset configuration table](https://github.com/antoineboquet/greek-conversion/blob/main/docs/presets.md), including the
precise scope and known limitations of each preset.

## Common recipes

### Produce monotonic Greek

```ts
convert("Ἄνθρωπὸς ᾆ", "greek", "greek", {
  orthography: { accentuation: "monotonic" },
});
// Άνθρωπός ά
```

The transformation is mechanical: it does not use a lexicon or infer missing
breathings. Polytonic Greek remains the default.

### Remove all or selected diacritics

Use the shortcut to remove every non-structural diacritic:

```ts
convert("ἄνθρωπος ᾆ ῑ", "greek", "transliteration", {
  removeDiacritics: true,
});
// anthrōpos a i
```

Or select semantic classes independently:

```ts
convert("ἄνθρωπος ἅγιος κἀγώ", "greek", "transliteration", {
  diacritics: {
    accents: "remove",
    smoothBreathing: "remove",
    roughBreathing: "preserve",
    coronis: "remove",
  },
});
// anthrōpos hagios kagō
```

`removeDiacritics()` exposes the same operation as a standalone helper.
Structural distinctions such as `η → ē` and `ω → ō` are retained.

### Fold Greek letter variants

Use `foldGreekVariants()` to obtain a uniform Greek spelling for comparison:

```ts
import { foldGreekVariants } from "@humanities/greek-conversion";

foldGreekVariants("ϐίος λόγος ϲῶμα");
// βίοσ λόγοσ σῶμα
```

The helper maps medial beta `ϐ` to `β`, lunate sigma `ϲ` to `σ`, and final
sigma `ς` to medial `σ`. It parses and re-encodes Greek rather than relying on
`NFKC`, so the same semantic rules and numeral exceptions apply as during a
conversion. Diacritics and case are preserved unless their independent options
are supplied:

```ts
foldGreekVariants("ϐΊΟΣ", {
  orthography: { letterCase: "lowercase" },
  removeDiacritics: true,
});
// βιοσ
```

### Normalize case and whitespace

```ts
convert("  ΦΙΛΗΒΟΣ\nΗΔΟΝΗ  ", "greek", "transliteration", {
  orthography: {
    letterCase: "lowercase",
    whitespace: "collapse",
  },
});
// philēbos ēdonē
```

Case values are `"preserve"`, `"lowercase"`, `"uppercase"`, and `"title"`.
Whitespace can be `"preserve"` or `"collapse"`; the latter trims the output
and replaces each Unicode whitespace run with one ASCII space.

### Select transliteration spellings

```ts
convert("βηξφχυ", "greek", "transliteration", {
  orthography: {
    beta: "v",
    eta: "ī",
    xi: "ks",
    phi: "f",
    chi: "kh",
    upsilon: "y",
  },
});
// vīksfkhy
```

Other policies cover long-vowel spelling, nasal gamma, modern digraphs,
systematic `rh`, double rho, medial beta, sigma style, contextual or uniform
final sigma, coronis, and alphabetic numerals. The selected spellings are
recognized on transliteration input when the same options are supplied.

`longVowels` accepts `"macron"` (the default) or `"circumflex"`. It controls
only the structural representation of inherently long eta and omega. An
explicit macron alongside a circumflex, such as in `ê̄`, is treated separately
as a philological mark and is reproduced without changing the identified
letter.

### Control Greek Unicode output

```ts
import {
  formatGreekUnicode,
  toUnicodeCodePoints,
} from "@humanities/greek-conversion";

formatGreekUnicode("ά;·", {
  acute: "oxia",
  questionMark: "greek",
  anoTeleia: "greek",
});
// ά;·

toUnicodeCodePoints("ά;😀");
// ["U+1F71", "U+037E", "U+1F600"]
```

Greek output supports composed or decomposed text, tonos or oxia, and explicit
Greek punctuation scalars. These are representation choices, not linguistic
transformations. See [Greek accentuation and Unicode output](https://github.com/antoineboquet/greek-conversion/blob/main/docs/greek-unicode.md).

## Detect information loss

Some conversions necessarily merge distinctions. `convertDetailed()` returns
the output and diagnostics from the same conversion request:

```ts
const result = convertDetailed("ἄνθρωπος", "greek", "greek", {
  orthography: { accentuation: "monotonic" },
});

result.output; // άνθρωπος
result.lossy; // true
result.losses;
// [{ code: "removed-diacritic", ... }]
```

Loss is evaluated on the canonical document. Unicode composition, tonos/oxia,
and alternate glyphs are therefore not reported as destructive. Examples of
actual loss include removing diacritics, decimalizing alphabetic numerals, and
using context-dependent spellings that merge distinct source sequences.

See the [conversion-analysis contract](https://github.com/antoineboquet/greek-conversion/blob/main/docs/conversion-analysis.md) and the
[information-loss matrix](https://github.com/antoineboquet/greek-conversion/blob/main/docs/information-loss.md).

## Reuse one parsed text

`GreekText` is useful when one source must be displayed or exported in several
formats. It parses once and caches each representation:

```ts
const text = new GreekText("a)/nqrwpos", "beta-code", {
  preset: "sbl-academic",
});

text.greek; // ἄνθρωπος
text.betaCode; // a)/nqrwpos
text.transliteration; // ánthrōpos
text.toDetailed("transliteration");
```

Instances are immutable, and exposed documents and resolved options are
detached copies. See the complete [`GreekText` contract](https://github.com/antoineboquet/greek-conversion/blob/main/docs/greek-text.md).

## Guarantees and scope

- Every format pair is supported in both directions.
- For fixed formats and options, canonical output is stable and idempotent.
- Unknown literals are preserved.
- Greek punctuation and contextual Greek rules are handled semantically where
  the canonical document contains enough information.
- The engine does not infer a missing rough breathing and does not perform
  transformations that intrinsically require lexical or morphological
  knowledge.
- A reverse conversion is not necessarily lossless; use `convertDetailed()`
  when that distinction matters.

The engine currently covers polytonic and monotonic accentuation, contextual
diphthongs and breathings, crasis and coronis provenance, elision aspiration,
sigma and beta variants, archaic letters, Greek punctuation, and marked
alphabetic numerals. Presets are limited to the rules and characters implemented
by the engine today.

## Advanced API

Applications can work directly with the experimental canonical representation:

```ts
import {
  encode,
  parse,
  validateDocument,
} from "@humanities/greek-conversion/document";

const document = parse("a)/nqrwpos", "beta-code");
const diagnostics = validateDocument(document);
const output = encode(document, "greek");
```

Validation deliberately remains a separate diagnostic step instead of changing
the contract of `convert()`. The `./document` entry point may still evolve
during the `1.0.0` prerelease series. See [validation](https://github.com/antoineboquet/greek-conversion/blob/main/docs/validation.md).

## Documentation

| Topic | Document |
| --- | --- |
| Presets and exact option values | [Presets](https://github.com/antoineboquet/greek-conversion/blob/main/docs/presets.md) |
| Greek orthography and Unicode | [Greek Unicode](https://github.com/antoineboquet/greek-conversion/blob/main/docs/greek-unicode.md) |
| Detailed conversion results | [Conversion analysis](https://github.com/antoineboquet/greek-conversion/blob/main/docs/conversion-analysis.md) |
| Loss by format pair | [Information loss](https://github.com/antoineboquet/greek-conversion/blob/main/docs/information-loss.md) |
| Reusable immutable text objects | [`GreekText`](https://github.com/antoineboquet/greek-conversion/blob/main/docs/greek-text.md) |
| Canonical document validation | [Validation](https://github.com/antoineboquet/greek-conversion/blob/main/docs/validation.md) |

## Development

```sh
deno task check
deno task test
```

## License

Copyright © 2021–2026 Antoine Boquet and contributors.

`greek-conversion` is licensed under the
[GNU Affero General Public License v3.0 or later](https://github.com/antoineboquet/greek-conversion/blob/main/LICENSE).
