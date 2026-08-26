# Conversion presets

A preset is a named, coherent set of ordinary `ConversionOptions`. Presets do
not introduce a separate conversion path: they are resolved before parsing and
encoding, and `convertDetailed()` observes the same information loss as if the
resolved options had been supplied individually.

```ts
convert(input, from, to, { preset: "ala-lc-modern" });
```

Custom options can refine or override a preset. Resolution is recursive for
the `orthography`, `diacritics`, and `unicode` groups:

```ts
convert(input, from, to, {
  preset: "ala-lc-modern",
  diacritics: { accents: "preserve" },
  orthography: { letterCase: "uppercase" },
});
```

The precedence is always:

```text
engine defaults < preset < custom options
```

An option only acts in the phases and output formats where it normally applies.
For example, ALA-LC letter spellings affect transliteration, while its numeral
policy can affect every output. This direction-dependent behavior is identical
to activating the same options manually.

## Available presets

| Preset | Implemented policy |
| --- | --- |
| `iso-843-type-1` | `β → v`, `η → ī`, `φ → f`, `υ → y`, literal gamma, and visible U+2019 coronis |
| `ala-lc-ancient` | Omits non-rough diacritics, uses contextual `y/u`, and renders marked numerals as decimal |
| `ala-lc-modern` | Ancient shared policy plus `β → v` and the implemented contextual `μπ`, `ντ`, and `γκ` rules |
| `sbl-academic` | Scientific diacritics remain represented and upsilon uses contextual `y/u` |
| `sbl-general` | Omits accents, smooth breathing, coronis, iota subscript, and quantities; preserves rough breathing and diaeresis |
| `tlg-core` | Current canonical Beta Code and the TLG characters already implemented by the engine |
| `bnf-core` | Conservative extension point with no forced overrides yet |

`bnf-core` deliberately does not anticipate the final BnF option choices.
`tlg-core` deliberately names the implemented subset rather than claiming the
full TLG Beta Code specification. Both names can grow without presenting the
current coverage as exhaustive.

The SBL identifiers distinguish the two library policies requested by the API.
`sbl-academic` retains the engine's scientific marks; `sbl-general` applies the
documented omission policy. They should not be read as a claim that the SBL
Handbook publishes two separate Greek tables.

## Inspection

The stable identifiers, sparse preset definitions, immutable defaults, and
fully resolved option objects are public:

```ts
PRESETS;
// ["iso-843-type-1", ..., "bnf-core"]

DEFAULT_CONVERSION_OPTIONS;
getPresetOptions("ala-lc-modern");
resolveConversionOptions({
  preset: "ala-lc-modern",
  orthography: { beta: "b" },
});
```

`getPresetOptions()` returns only fields contributed by the selected preset.
`resolveConversionOptions()` returns a complete `ResolvedConversionOptions`,
after applying engine defaults, the preset, and custom overrides. Both helpers
return detached objects; mutating one cannot modify the immutable defaults or
the preset registry.

## Scope limits

Presets never infer a missing rough breathing and do not perform transformations
that intrinsically require lexical or morphological knowledge. Consequently,
ALA-LC output can only render `h` when the source document actually carries a
rough breathing. This is a deliberate scope boundary, not an implicit fallback.

The ALA-LC policy omits diaeresis visually. Under contextual `y/u`, the parser
nevertheless preserves its deterministic provenance: `y` is interpreted as a
separated upsilon where `u` would form a diphthong. This keeps preset output
idempotent without lexical inference.
