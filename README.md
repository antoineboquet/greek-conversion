# gc-next

A deterministic conversion engine for polytonic Greek, Beta Code and scientific
transliteration.

The engine separates parsers, a canonical grapheme model, and encoders. It
supports every direction between the three formats, uses one canonical spelling
per output format, normalizes output to NFC, and preserves unknown characters.

Structural long vowels in transliteration use macrons by default (`η → ē`,
`ω → ō`). The output policy can instead distinguish the raw Greek letter with a
circumflex, optionally retaining a macron as an explicit philological quantity
annotation:

```ts
convert("βη βω βᾱ", "greek", "transliteration", {
  orthography: { longVowels: "circumflex" },
}); // bê bô bā

convert("βη βω βᾱ", "greek", "transliteration", {
  orthography: { longVowels: "circumflex-macron" },
}); // bê̄ bô̄ bā
```

The values are `"macron"` (default), `"circumflex"`, and `"circumflex-macron"`.
Explicit long `α`, `ι`, and `υ` always retain their macron because Greek does
not encode their quantity with a distinct letter. A tilde continues to represent
the Greek circumflex accent, so `ῆ` becomes `ễ` under the circumflex policy. All
three structural spellings (`ē`, `ê`, `ê̄`) are accepted on input. Contextual
nasal gamma is transliterated as `n` before gamma, kappa, xi, and chi by
default. Before sigma, canonical Greek output contracts adjacent unmarked
labials (`π`, `β`, `φ`) to `ψ` and velars (`κ`, `γ`, `χ`) to `ξ`. Dental
assimilation is opt-in because it deletes `τ`, `δ`, or `θ` before `σ`:

```ts
convert("ατσα", "greek", "greek", {
  orthography: { dentalSigma: "assimilate" },
}); // ασα
```

The default `"preserve"` policy retains the dental. Beta Code and
transliteration also retain the source pair, so a round-trip through Greek with
assimilation enabled is lossy. Marked alphabetic numerals are excluded from
these contractions. Initial breathings are placed on the second vowel of a
diphthong and rendered before the whole vowel group in transliteration; a
diaeresis prevents this rule. The rare `ωυ` follows the same behavior, while an
iota subscript prevents grouping with a following vowel. A misplaced initial
breathing on the first half of a diphthong is normalized onto the second in
Greek and Beta Code. Internal vowel groups never receive an implicit breathing.
Initial transliterated vowels normally receive the canonical smooth breathing.
Quantity signs (`ā`, `ĭ`, `ī`, `ŭ`, `ū`) are the exception: because they do not
encode a breathing, they are rendered without an inferred one. The shared smooth
mark is classified contextually as a breathing on an initial vowel group and as
a coronis on an internal vowel. Greek and Beta Code preserve the coronis and the
contracted crasis. Transliteration omits the coronis by default and therefore
cannot reconstruct it.

Final sigma recognizes Unicode spaces, line and paragraph separators, quotes,
dashes, apostrophes, Greek punctuation, and zero-width space as word boundaries.
Combining marks and the explicit join controls ZWNJ, ZWJ, and WORD JOINER are
transparent, so they do not incorrectly turn a medial sigma into `ς`. The same
boundary logic is shared with medial beta and other contextual rules.

Greek punctuation is normalized by meaning rather than preserved as an opaque
literal. Greek output uses `;` for erotimatiko, `·` for ano teleia, `‐` (U+2010)
for hyphen, and `’` (U+2019) for apostrophe. Beta Code uses `;`, `:`, `-`, and
`'`; transliteration uses `?`, `;`, `‐`, and `’`. Unicode aliases such as
U+037E, U+0387, U+02BC, and U+1FBD converge to those canonical forms. The Greek
enotikon `‿` (U+203F) is preserved semantically in every format, and the
combining form U+035C is accepted as an input alias.

Lunate sigma is accepted as a Greek (`ϲ/Ϲ`) and TLG Beta Code (`S3/*S3`) input
alias. Standard `σ/ς` output remains the default; request lunate output in Greek
and Beta Code explicitly:

```ts
convert("σος", "greek", "greek", {
  orthography: { sigma: "lunate" },
}); // ϲοϲ
```

The archaic letters digamma (`ϝ`), stigma (`ϛ`), koppa (`ϟ`), archaic koppa
(`ϙ`), and sampi (`ϡ`) are represented explicitly, as is yot (`ϳ`, uppercase
`Ϳ`). Beta Code follows the codes `v`, `j`, `#2`, `#1`, `#3`, and `#5`;
transliteration follows BnF practice with `w`, `j`, `c̄`, `q`, `ḳ`, and `s̄`.
The long-vowel marker policy also applies to the structural macrons of stigma
and sampi: `c̄/s̄`, `ĉ/ŝ`, or `ĉ̄/ŝ̄`. Numeric koppa and archaic koppa remain
distinct in every format.
Greek numeral signs are preserved in transliteration and encoded as `#` (dexia
keraia) and `#22` (aristeri keraia) in Beta Code. Numeric vowels do not acquire
an implicit smooth breathing, numeric sigma remains `σ`, and medial-beta styling
does not alter numeric beta.

Alphabetic numerals are preserved by default. Set `numerals` to `"decimal"` to
render valid, explicitly marked numeral groups as decimal digits in any output
format:

```ts
convert("͵βκγʹ", "greek", "transliteration", {
  orthography: { numerals: "decimal" },
}); // 2023
```

Only descending alphabetic groups ending in dexia keraia are converted. An
optional aristeri keraia may prefix a unit letter for the thousands component.
Unmarked text and malformed numeral groups are left unchanged. Decimal output is
intentionally lossy and is not expanded back into Greek alphabetic notation.

```ts
import {
  betaCodeToGreek,
  convert,
  greekToTransliteration,
  transliterationToGreek,
} from "./src/mod.ts";

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

The medial beta symbol can likewise be requested for lowercase beta inside a
Greek word. Initial and uppercase beta remain `β` and `Β`:

```ts
transliterationToGreek("bárbaros", {
  orthography: { medialBeta: "symbol" },
}); // βάρϐαρος
```

Nasal gamma can instead preserve the literal `g` of each Greek gamma, as in ISO
843:1997 Type 1 transliteration. The same option disables nasal-gamma inference
when parsing transliteration, so `ng` remains `νγ` while `gg` becomes `γγ`:

```ts
greekToTransliteration("ἄγγελος", {
  orthography: { nasalGamma: "literal" },
}); // ággelos
```

Greek output also applies the regular aspiration caused by elision before a
rough breathing: final `π`, `τ`, and `κ` become `φ`, `θ`, and `χ`. The engine
recognizes ASCII apostrophe, MODIFIER LETTER APOSTROPHE (`U+02BC`), GREEK
KORONIS (`U+1FBD`), and RIGHT SINGLE QUOTATION MARK (`U+2019`), with optional
whitespace before the following word. It preserves the supplied apostrophe and
does not attempt to reconstruct or remove an elided vowel:

```ts
transliterationToGreek("ap’ hēmō̃n"); // ἀφ’ ἡμῶν
transliterationToGreek("ap’ emoũ"); // ἀπ’ ἐμοῦ
```

The coronis has three transliteration policies. It can be omitted (the default),
rendered as RIGHT SINGLE QUOTATION MARK (`U+2019`) following ISO 843, or
preserved as GREEK KORONIS (`U+1FBD`) following BnF practice:

```ts
greekToTransliteration("κἀγώ");
// kagṓ

greekToTransliteration("κἀγώ", {
  orthography: { coronis: "apostrophe" },
});
// ka’gṓ

greekToTransliteration("κἀγώ", {
  orthography: { coronis: "greek" },
});
// ka᾽gṓ
```

Run `deno task check` and `deno task test`.
