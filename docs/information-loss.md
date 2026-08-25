# Information-loss contract

Conversion is defined as parsing a source string into the canonical `Document`
model, applying target orthography, and encoding one canonical spelling. The
engine preserves unknown characters, but it does not preserve the spelling or
Unicode provenance of recognized characters.

This document distinguishes three effects:

- **canonicalization** changes spelling without changing the represented
  document (for example NFD to NFC, `ϲ` to `σ/ς`, or punctuation aliases to one
  canonical glyph);
- **representation loss** occurs when a target format cannot express a
  distinction in the canonical document;
- **policy loss** is requested by an option such as decimal numerals or
  diacritic removal.

## Pairwise matrix with default options

The entries describe the information that can be lost after converting from
the row format to the column format and parsing the result again.

| From \ To | Greek | Beta Code | Transliteration |
| --- | --- | --- | --- |
| **Greek** | Selected glyph, accent, punctuation, and composition policies; unmarked labial/velar + sigma pairs contract | Canonical spelling and mark order only for canonical documents | Coronis; explicitly marked double rho; smooth breathing on an initial quantity-marked vowel; `ν` before a velar under nasal-gamma inference |
| **Beta Code** | Canonical Greek glyphs; unmarked labial/velar + sigma pairs contract | Canonical case, mark order, aliases, and punctuation | Same transliteration losses as Greek, including coronis and marked double rho |
| **Transliteration** | Initial smooth breathing is inferred where quantity is not explicit; labial/velar + sigma pairs contract; an elided mute may be aspirated before rough breathing | Initial smooth breathing is inferred where quantity is not explicit; accepted aliases converge to canonical Beta Code | Accepted aliases, punctuation, combining-mark order, NFC, and orthographic spelling converge |

“Canonical documents” excludes invalid or ambiguous combinations. Use
`validateDocument()` when that distinction matters.

## Loss mechanisms

### Canonical spelling and Unicode

All recognized output has a selected spelling. Transliteration is NFC. Greek is
composed by default, but the system polytonic acute prefers oxia and is therefore
not necessarily NFC. Accepted aliases do not round-trip byte for byte:

- Greek lunate sigma and medial beta aliases become the selected output glyphs;
- Unicode punctuation aliases become the canonical punctuation for the target;
- equivalent combining-mark order and duplicate recognized marks converge;
- Beta Code aliases, case placement, and mark order converge.

Unrecognized characters, including unrecognized combining marks, remain
literals and are preserved.

### Transliteration

Default transliteration has these intrinsic ambiguities:

- a coronis is omitted, so crasis remains spelled but is no longer explicitly
  marked;
- the conventional `rrh` spelling does not retain whether double rho was
  explicitly marked smooth–rough in Greek or Beta Code;
- an initial vowel with explicit quantity has no inferred smooth breathing, so
  an explicitly smooth quantity-marked source converges to the unmarked form;
- with the default `nasalGamma: "nasal"`, Greek gamma and nu before a velar can
  both be read as nasal gamma after transliteration.

The `coronis: "apostrophe"` and `coronis: "greek"` policies make the mark
visible for readers, but the transliteration parser treats those spacing marks
as punctuation. They are display policies, not a lossless interchange syntax.

### Canonical Greek orthography

Greek output contracts adjacent, unmarked labials plus sigma to psi and velars
plus sigma to xi. Thus, for example, Beta Code `ps` and `bs` both become `ψ`,
and `ks` and `gs` both become `ξ`. Marked, separated, and numeral graphemes do
not contract.

Greek output also applies the regular aspiration of an elided final `π`, `τ`,
or `κ` before a rough breathing. The output records the aspirated consonant, not
the pre-transform spelling.

### Inference from transliteration

Transliteration does not normally write smooth breathing. When an initial vowel
group has neither rough breathing nor explicit quantity, parsing infers smooth
breathing. Explicit `ā/ă`, `ī/ĭ`, and `ū/ŭ` remain breathing-neutral.

With default nasal-gamma inference, `n` before gamma, kappa, xi, or chi becomes
gamma in the canonical document. Set `nasalGamma: "literal"` to keep `n` as
nu; this changes the accepted spelling contract for transliteration input.

## Option-induced loss

| Option | Effect | Reconstructible from output? |
| --- | --- | --- |
| `removeDiacritics: true` | Removes accents, breathings, coronis, diaeresis, explicit quantity, and iota subscript | No |
| `numerals: "decimal"` | Replaces a valid marked alphabetic numeral group with decimal digits | No |
| `dentalSigma: "assimilate"` | Deletes `τ`, `δ`, or `θ` before sigma in Greek output | No |
| `nasalGamma: "nasal"` (default) | Converges nasal gamma and nu-before-velar transliteration spellings | No |
| `coronis: "omit"` (default) | Omits coronis from transliteration | No |
| `accentuation: "monotonic"` | Keeps diaeresis, maps every accent to acute, and removes other polytonic marks | No |
| `modernDigraphs: "phonetic"` | Maps word-initial `μπ/ντ` to `b/d` in transliteration | No; `b/d` are also canonical spellings of beta/delta |
| `modernDigraphs: "ala-lc"` | Maps initial `μπ/ντ` to `b/d̲` and contextual `γκ` to `gk/nk` | Yes with the coordinated ALA-LC letter options; `d̲` remains distinct from delta |
| `rho: "systematic"` | Adds one final `h` to every contiguous rho group | The rho letters are recoverable; an explicit rough breathing is not |
| `composition: "decomposed"` | Emits Greek letters and marks as canonical decomposed sequences | Yes, unless combined with another lossy policy |
| `acute: "tonos"` or `"oxia"` | Selects an eligible composed acute scalar | The accent is recoverable; its scalar preference is not |
| Greek question-mark or ano-teleia scalar | Selects a canonically unstable punctuation scalar | The punctuation meaning is recoverable; its scalar preference is not |
| `doubleRho`, `medialBeta`, `sigma`, letter variants, `upsilon`, `longVowels` | Selects a canonical output spelling | The canonical letters normally remain recoverable, but `eta: "ī"` conflicts with long iota |

`removeDiacritics` is applied during encoding, after contextual analysis. It
therefore cannot manufacture a diphthong or enable a consonant contraction by
first deleting a blocking mark. Structural marks used to distinguish letters
remain: `ē/ō`, `c̄/s̄`, and `ḳ` are not removable diacritics.

## Stability guarantee

For canonical output and a fixed option set, every format is idempotent:

```ts
const once = convert(input, from, to, options);
const twice = convert(once, to, to, options);

once === twice;
```

This is a stability guarantee, not a claim that the original source can be
reconstructed. The differential corpus and explicit loss cases live in
`tests/fixtures.ts`; pairwise stability is exercised by
`tests/stability_test.ts`.

For an actual input, `convertDetailed()` returns the output, a `lossy` status,
and token-indexed diagnostics. Its comparison treats canonical Unicode and
deterministic additions as information-preserving. See the
[conversion-analysis contract](conversion-analysis.md).
