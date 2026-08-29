# Character extensions and repertoires

The built-in conversion functions use a closed, standards-oriented Greek
alphabet. `createConverter()` creates an isolated immutable registry when an
application needs additional input spellings, direct mappings for extra
characters, or a smaller effective repertoire.

## Aliases of built-in letters

An alias supplies another source spelling for an existing semantic letter:

```ts
const converter = createConverter({
  aliases: [{
    letter: "theta",
    format: "transliteration",
    spellings: ["þ"],
  }],
});
```

The alias is replaced by the canonical source-format spelling before parsing.
It therefore receives the ordinary case, diacritic, context, validation, and
information-loss behavior of the selected built-in letter.

Aliases are matched longest first. Construction rejects empty and ambiguous
spellings. A spelling already understood by the parser requires
`override: true`, making the change of meaning explicit.

## Opaque custom characters

A custom character declares a stable identifier and one lowercase plus an
optional uppercase spelling in every format:

```ts
const converter = createConverter({
  characters: [{
    id: "san",
    forms: {
      greek: { lowercase: "ϻ", uppercase: "Ϻ" },
      "beta-code": { lowercase: "#9", uppercase: "*#9" },
      transliteration: { lowercase: "š", uppercase: "Š" },
    },
    override: true,
  }],
});
```

Custom characters are opaque boundaries inside the Greek engine. The
converter guarantees direct mapping, declared case, registry immutability, and
stable round trips when the supplied forms are unambiguous. It does not infer
that a custom character:

- is a vowel or consonant;
- accepts Greek diacritics;
- participates in a diphthong, contraction, aspiration, or digraph;
- has an alphabetic-numeral value;
- belongs to any bundled preset.

The lowercase or uppercase form is selected from the semantic case recognized
in the source. General output options such as `letterCase` and `betaCodeCase`
do not rewrite opaque forms; declare the exact forms required by the custom
profile. Beta Code input remains ASCII-case-insensitive, and `*` remains the
only semantic uppercase marker.

Use an alias when a new spelling is semantically a known Greek letter. Use a
custom character only when it represents a genuinely distinct inventory item.

The implementation reserves private-use Unicode scalars internally while a
conversion is running. Supplying one of those scalars as input is rejected
instead of risking silent corruption.

## Restricting the repertoire

`repertoire` is an exact allow-list. Omitting it enables all built-in and
registered custom characters. `exclude` is applied afterwards and always wins:

```ts
const converter = createConverter({
  characters: [customSan],
  repertoire: ["alpha", "beta", "san"],
  exclude: ["san"],
});
```

The policy is semantic rather than graphical. Excluding `stigma` applies to
its Greek, Beta Code, and transliterated spellings. An out-of-scope character
is preserved as literal text using the source representation's canonical
spelling; a matched custom form retains its registered spelling. The target
may consequently contain a deliberate source-format fragment.

`convertDetailed()` keeps scope diagnostics separate from conversion losses:

```ts
const result = converter.convertDetailed(
  "αϛβ",
  "greek",
  "transliteration",
);

result.output; // aϛb
result.lossy; // false
result.diagnostics[0].code; // out-of-scope-character
```

Literal preservation is not information loss, so it does not set `lossy`.
Applications that require rejection should treat a non-empty `diagnostics`
array as a failed scope check. A future strict validation facade can formalize
that workflow without changing the permissive `convert()` contract.

## Preset boundary

The registry mechanism deliberately does not assume one standard Greek
allow-list for every preset. ISO 843 and BnF, for example, explicitly address
several archaic characters, while the Perseus and TLG repertoires have
different boundaries. Preset-specific allow-lists should be added only from a
character-by-character reference audit.

Adding an alias or custom character never expands the documented scope of a
preset. Applications combining a preset with a custom `Converter` are
responsible for describing that extension as an adapted profile.
