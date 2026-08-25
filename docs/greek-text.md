# GreekText

`GreekText` is an optional immutable facade for applications that need several
representations of the same Greek text. It parses the source once into the
canonical `Document`; Greek, Beta Code, and transliteration outputs are then
encoded lazily from that shared document and cached per format.

```ts
const text = new GreekText("a)/nqrwpos", "beta-code", {
  preset: "sbl-academic",
});

text.source; // raw input: "a)/nqrwpos"
text.sourceFormat; // "beta-code"
text.greek; // "ἄνθρωπος"
text.betaCode; // "a)/nqrwpos"
text.transliteration; // "ánthrōpos"
```

The explicit method is equivalent to the convenience getters:

```ts
text.to("greek") === text.greek;
text.to("beta-code") === text.betaCode;
text.to("transliteration") === text.transliteration;
```

## Canonical source and immutability

`source` always retains the exact input string. The getter matching the source
format returns its canonical encoded spelling, so aliases can converge:

```ts
const text = new GreekText("S3oS3", "beta-code");

text.source; // "S3oS3"
text.betaCode; // "sos"
```

The instance is frozen. Its `document` and resolved `options` getters return
detached copies rather than internal state. Modifying those copies cannot alter
later outputs.

Options are resolved once at construction with the normal precedence:

```text
engine defaults < preset < custom options
```

Because the option set is fixed, the output cache has only three possible
entries. To use different options, construct another `GreekText`; individual
methods intentionally do not accept per-call overrides.

## Detailed conversion

`toDetailed()` uses the same loss-analysis contract as `convertDetailed()`, but
compares the target with the already parsed canonical source document:

```ts
const text = new GreekText("ἄνθρωπος", "greek", {
  preset: "sbl-general",
});

text.toDetailed("transliteration");
// {
//   output: "anthrōpos",
//   lossy: true,
//   losses: [{ code: "removed-diacritic", ... }]
// }
```

## Functional and object APIs

`GreekText` does not replace the functional API:

- use `convert()` or `convertDetailed()` for a one-off conversion;
- use `GreekText` when the same semantic source needs multiple formats or
  repeated access;
- use `parse()` and `encode()` when an application works directly with the
  canonical `Document` model.

The class contains no independent orthographic logic. It delegates to the same
parsers, encoders, preset resolver, and loss analyzer as the functional API.
