# gc-next

A deterministic conversion engine for polytonic Greek, Beta Code and scientific
transliteration.

The engine separates parsers, a canonical grapheme model, and encoders. It
supports every direction between the three formats, uses one canonical spelling
per output format, normalizes output to NFC, and preserves unknown characters.
Contextual nasal gamma is transliterated as `n` before gamma, kappa, xi, and chi
by default. Canonical Greek output contracts an adjacent unmarked `πσ` sequence
to `ψ`. Initial breathings are placed on the second vowel of a diphthong and
rendered before the whole vowel group in transliteration; a diaeresis prevents
this rule. Initial transliterated vowels normally receive the canonical smooth
breathing. Quantity signs (`ā`, `ĭ`, `ī`, `ŭ`, `ū`) are the exception: because
they do not encode a breathing, they are rendered without an inferred one. The
shared smooth mark is classified contextually as a breathing on an initial vowel
group and as a coronis on an internal vowel. Greek and Beta Code preserve the
coronis and the contracted crasis. Transliteration omits the coronis by default
and therefore cannot reconstruct it.

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
