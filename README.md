# gc-next

A deterministic conversion engine for polytonic Greek, Beta Code and scientific
transliteration.

The engine separates parsers, a canonical grapheme model, and encoders. It
supports every direction between the three formats, uses one selected spelling
per output format, and preserves unknown characters. Beta Code and
transliteration have canonical output spellings. Greek output has explicit
[accentuation and Unicode policies](docs/greek-unicode.md), including
polytonic/monotonic conversion, tonos/oxia, composition, and Greek punctuation
scalars.

The formal [information-loss contract](docs/information-loss.md) distinguishes
canonicalization, representation loss, and option-induced loss for every format
pair. [Validation](docs/validation.md) deliberately remains a separate,
diagnostic step over the canonical document rather than a mode of `convert()`.

Use `convertDetailed()` when an application must know whether the actual input
lost information:

```ts
const result = convertDetailed("ἄνθρωπος", "greek", "greek", {
  orthography: { accentuation: "monotonic" },
});

result.output; // Άνθρωπος
result.lossy; // true
result.losses[0].code; // removed-diacritic
```

Loss is evaluated on canonical documents, so Unicode composition and glyph
preferences are not destructive. See the formal
[conversion-analysis contract](docs/conversion-analysis.md).

Greek output is polytonic and composed by default. Its system acute policy uses
oxia; monotonic output uses tonos:

```ts
convert("Ἄνθρωπὸς ᾆ", "greek", "greek", {
  orthography: { accentuation: "monotonic" },
}); // Άνθρωπός ά

formatGreekUnicode("ά;·", {
  acute: "oxia",
  questionMark: "greek",
  anoTeleia: "greek",
}); // ά;·

toUnicodeCodePoints("ά;😀");
// ["U+1F71", "U+037E", "U+1F600"]
```

Set `removeDiacritics` to `true` to remove the canonical diacritics before
encoding any output format:

```ts
convert("ἄνθρωπος ᾆ ῑ", "greek", "transliteration", {
  removeDiacritics: true,
}); // anthrōpos a i
```

The public helper applies the same operation separately:

```ts
removeDiacritics("a)/nqrwpos a)=| i&", "beta-code");
// anqrwpos a i
```

The all-or-nothing shortcut removes accents, breathings, coronides,
diaereses, explicit quantities, and iota subscripts. Structural marks required
to identify a letter are retained: `ē/ō`, `c̄/s̄`, and `ḳ` therefore remain
distinct from `e/o`, `c/s`, and `k`. The helper accepts the same optional
orthography settings as conversion functions and otherwise returns the
canonical spelling of the selected format.

Diacritics can instead be selected by semantic class. Each class defaults to
`"preserve"`; `removeDiacritics: true` remains a shorthand that overrides all
selective settings:

```ts
convert("ἄνθρωπος ἅγιος κἀγώ ΐ ᾷ ᾱ", "greek", "transliteration", {
  diacritics: {
    accents: "remove",
    smoothBreathing: "remove",
    roughBreathing: "preserve",
    coronis: "remove",
    diaeresis: "preserve",
    iotaSubscript: "remove",
    quantity: "remove",
  },
}); // anthrōpos hagios kagō ï a a
```

Selective removal is a rendering policy. Context such as diphthongs,
diaeresis-blocked vowel groups, contractions, and crasis is analyzed from the
source document before any mark is hidden.

Letter case is also an explicit rendering policy:

```ts
convert("ΦΙΛΗΒΟΣ Η ΠΕΡΙ ΗΔΟΝΗΣ", "greek", "transliteration", {
  orthography: { letterCase: "lowercase" },
}); // philēbos ē peri ēdonēs

convert("φιληβος η περι ηδονης", "greek", "transliteration", {
  orthography: { letterCase: "title" },
}); // Philēbos Ē Peri Ēdonēs
```

The values are `"preserve"` (default), `"lowercase"`, `"uppercase"`, and
`"title"`. Title case capitalizes the first Greek grapheme after each word
boundary and lowercases the rest. Uppercase transliteration uppercases complete
multiletter spellings (`φ → PH`, `χ → CH`), whereas title case uses `Ph` and
`Ch`. Unknown literal text is never case-folded. This mechanical policy does
not infer which words are proper names or which words cataloguing rules leave
uncapitalized.

Whitespace is preserved by default. Set `whitespace` to `"collapse"` to trim
the output and replace every Unicode whitespace run with one ASCII space in any
output format:

```ts
convert("  ἄνθρωπος\n\tλόγος  ", "greek", "greek", {
  orthography: { whitespace: "collapse" },
}); // ἄνθρωπος λόγος
```

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
three structural spellings (`ē`, `ê`, `ê̄`) are accepted on input.

Upsilon uses `u` throughout by default. Set `upsilon` to `"y"` to use `y`
throughout, or to `"y-with-diphthong-u"` to use `y` generally and `u` when
upsilon belongs to a diphthong:

```ts
convert("υ αυ ευ ου υι αϋ", "greek", "transliteration", {
  orthography: { upsilon: "y-with-diphthong-u" },
}); // y au eu ou ui aÿ
```

The contextual policy shares the canonical diphthong analysis used for
breathings, so a diaeresis or iota subscript prevents grouping. Both `u` and
`y` are accepted as input spellings for upsilon. Other letter spellings can be
selected independently with `beta: "v"`, `eta: "ī"`, `xi: "ks"`, `phi: "f"`,
and `chi: "kh"`:

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
}); // vīksfkhy
```

The selected spellings are also recognized on transliteration input. Selecting
`eta: "ī"` necessarily interprets `ī` as eta rather than quantity-marked iota
and takes precedence over `longVowels` for eta; the latter still controls omega.
Set `modernDigraphs` to `"phonetic"` to transliterate word-initial `μπ` as `b`
and word-initial `ντ` as `d`; internal pairs remain `mp` and `nt`:

```ts
convert("μπάλα ντομάτα αμπέλι", "greek", "transliteration", {
  orthography: { modernDigraphs: "phonetic" },
}); // bála domáta ampéli
```

These phonetic spellings merge distinctions in transliteration. When combined
with `beta: "v"`, input `b` is read as `μπ` so the selected output remains
stable; plain `d` remains the canonical input spelling of delta because it
cannot distinguish `δ` from `ντ`.

Set `modernDigraphs` to `"ala-lc"` for the position-dependent modern Greek
rules of the ALA-LC table. Word-initial `μπ` becomes `b`, word-initial `ντ`
becomes `d̲` (LATIN D followed by COMBINING LOW LINE), and `γκ` becomes `gk`
initially or finally but `nk` medially. Elsewhere, `μπ` and `ντ` remain `mp`
and `nt`. The marked `d̲` is recognized on input without colliding with
delta's `d`; combine this policy with `beta: "v"` so `b` can unambiguously be
read as `μπ`.

Contextual nasal gamma is transliterated as `n` before gamma, kappa, xi, and chi
by default. Before sigma, canonical Greek output contracts adjacent unmarked
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
cannot reconstruct it unless `orthography.coronis` is set to `"greek"`.

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
  convertDetailed,
  formatGreekUnicode,
  greekToTransliteration,
  toUnicodeCodePoints,
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

Rho can independently be transliterated systematically with `rh`. A contiguous
group receives a single final `h`, so two successive rhos become `rrh`:

```ts
convert("ρ αρ ρρ", "greek", "transliteration", {
  orthography: { rho: "systematic" },
}); // rh arh rrh
```

With the default `"contextual"` policy, `h` is limited to an explicitly rough
rho and to the conventional second rho of a double rho. Under the systematic
policy, input `rh/rrh` is read as unmarked `ρ/ρρ`; an explicit breathing is no
longer distinguishable.

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

The U+1FBD spelling is also the semantic interchange form: when it immediately
follows a transliterated vowel, the parser restores the coronis on that vowel.
U+2019 remains ordinary punctuation, so `coronis: "apostrophe"` is intentionally
display-only and lossy. An isolated U+1FBD is likewise treated as punctuation;
the parser does not infer crasis from lexical or morphological knowledge.

Run `deno task check` and `deno task test`.
