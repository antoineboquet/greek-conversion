# Migrating from 0.14.x

The `1.0.0` prerelease series is a rewrite. It does not provide compatibility
aliases for the `0.14.x` API.

## Installation

The prerelease will be available from JSR and npm after publication:

```sh
deno add jsr:@humanities/greek-conversion@1.0.0-beta.3
npm install @humanities/greek-conversion@beta
```

The package is ESM-only.

## Updating from `1.0.0-beta.2`

Beta Code ASCII letter case no longer represents Greek letter case. Only a
preceding `*` marks an uppercase Greek grapheme, so uppercase ASCII input such
as `A)/NQRWPOS` now converts to lowercase `ἄνθρωπος`. Canonical output uses
lowercase ASCII by default and places uppercase diacritics between `*` and the
letter, following TLG ordering.

Use `orthography.betaCodeCase: "uppercase"` when an integration requires
uppercase ASCII without changing the represented Greek case. The `tlg-core`
and `perseus` presets select uppercase and lowercase ASCII respectively.

## Formats and conversion functions

Replace the `KeyType` runtime enum with literal format names:

```ts
// 0.14.x
toTransliteration(input, KeyType.GREEK);

// 1.0 prerelease
convert(input, "greek", "transliteration");
// or greekToTransliteration(input)
```

| 0.14.x | 1.0 prerelease |
| --- | --- |
| `KeyType.GREEK` | `"greek"` |
| `KeyType.BETA_CODE` | `"beta-code"` |
| `KeyType.TLG_BETA_CODE` | `"beta-code"` with `preset: "tlg-core"` |
| `KeyType.TRANSLITERATION` | `"transliteration"` |
| `toGreek()` | `convert(..., ..., "greek")` or a directional helper |
| `toBetaCode()` | `convert(..., ..., "beta-code")` or a directional helper |
| `toTransliteration()` | `convert(..., ..., "transliteration")` or a directional helper |

## Presets and custom options

Preset identifiers are string literals. A preset and custom overrides now share
one options object instead of an array:

```ts
// 0.14.x
toTransliteration(input, KeyType.GREEK, [
  Preset.ALA_LC,
  { removeDiacritics: false },
]);

// 1.0 prerelease
convert(input, "greek", "transliteration", {
  preset: "ala-lc-ancient",
  removeDiacritics: false,
});
```

Custom fields override corresponding preset fields while unrelated preset
fields remain active. See [docs/presets.md](docs/presets.md) for the exact
configuration table.

## Reusable text objects

`GreekString` is replaced by immutable `GreekText`:

```ts
// 0.14.x
const text = new GreekString(input, KeyType.GREEK, settings);

// 1.0 prerelease
const text = new GreekText(input, "greek", options);
```

`source`, `greek`, `betaCode`, and `transliteration` remain conceptually
similar. `GreekText` additionally exposes `to()`, `toDetailed()`, detached
resolved options, and a detached canonical document.

## Canonical-document API

Advanced parsing, validation, transformation, and encoding are isolated in the
experimental `./document` entry point:

```ts
import {
  encode,
  parse,
  validateDocument,
} from "@humanities/greek-conversion/document";
```

The representation may still change during the `1.0.0` prerelease series.

## Behavioral differences

- Unknown characters are preserved instead of being removed by sanitization.
- Output is canonical and idempotent for fixed formats and options.
- `convertDetailed()` reports losses from the actual input.
- Monotonic conversion is explicit and mechanical.
- Missing rough breathings and transformations requiring lexical or
  morphological knowledge are not inferred.
- TLG and BnF presets cover only the rules and characters implemented by the
  current engine.
