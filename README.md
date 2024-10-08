# greek-conversion

> **This library needs some feedback before getting its first stable release!**

A small, yet powerful, JavaScript library for converting both polytonic and monotonic Greek from/into many representations.

## Summary

1. [Usage](#usage)
    1. [With a package manager (recommended)](#with-a-package-manager-recommended)
    2. [The old way](#the-old-way)
2. [Core functions](#core-functions)
    1. [Summary](#summary-1)
    2. [Conversion presets](#conversion-presets)
    3. [Conversion options](#conversion-options)
    4. [Examples](#examples)
3. [OOP style](#oop-style)
    1. [Summary](#summary-2)
    2. [Example](#example)
4. [Helper functions](#helper-functions)
5. [Limitations](#limitations)
6. [License](#license)

## Usage

### With a package manager (recommended)
In order to use this library in your project, simply type:
```shell
npm install greek-conversion
```

Import the library's functionalities as needed:

```ts
// ES6 modules syntax
import { KeyType, toTransliteration } from 'greek-conversion'

// CommonJS syntax
const { KeyType, toTransliteration } = require('greek-conversion')
```

Then use them:

```ts
// Let's transliterate some Thucydides

toTransliteration(
  'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ' +  // Hellēsin egeneto kai
  'ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',         // merei tini tōn barbarōn,
  KeyType.GREEK,                                     // hōs de eipein kai epi
  { removeDiacritics: true }                         // pleiston anthrōpōn.
)
```

### The old way

> This is primarily intended for the use of the library in the browser in the absence of a modern development environment.

You can either import the library from the unpkg <abbr title="Content Delivery Network">CDN</abbr> (`https://www.unpkg.com/greek-conversion`) or download the latest release on Github then include `greekConversion.min.js` into your project (but you could experience a CORS issue in this case and need to use a local server to run your project).

As the library is built as a module, the `<script>` tag needs to be set as `type="module"` (which is supported by all modern browsers).

You can then call the library's functions as exemplified below:

```html
<script type="module">
  import { KeyType, toGreek } from 'https://www.unpkg.com/greek-conversion' // or './greekConversion.min.js'
  console.log(toGreek('anthrōpos', KeyType.TRANSLITERATION)) // ανθρωπος
</script>
```

## Core functions

### Summary

This library provides three main functions to convert a greek string: **`toBetaCode`**, **`toGreek`** & **`toTransliteration`**. You can refer to the [conversion chart](https://github.com/antoineboquet/greek-conversion/wiki#conversion-chart) for further information about the expected input & output.

Functions signature is consistently:
```ts
str: string,
fromType: KeyType,
settings: Preset | MixedPreset | IConversionOptions = {}
```

**`fromType`** can be set to `BETA_CODE | TLG_BETA_CODE | GREEK | TRANSLITERATION` (e.g. `KeyType.GREEK`).

**`settings`** can be filled with:
1. a `Preset`;
2. a user-defined `IConversionOptions` object;
3. a preset mixed with user-defined conversion options (`[Preset, IConversionOptions]`).

### Conversion presets

The available presets are:

1. **For beta code:**

| Preset | Description |
| ------ | ----------- |
| [**`SIMPLE_BC`**](https://github.com/antoineboquet/greek-conversion/wiki#simple-beta-code) | A simplified beta code style for faster writing |
| [**`TLG`**](https://github.com/antoineboquet/greek-conversion/wiki#tlg) | Thesaurus Linguae Graecae |

2. **For transliteration:**

| Preset | Description | Scope |
| ------ | ----------- | ----- |
| [**`ALA_LC`**](https://github.com/antoineboquet/greek-conversion/wiki#ala-lc) | American Library Association – Library of Congress | Ancient and Medieval Greek (before 1454) |
| [**`ALA_LC_MODERN`**](https://github.com/antoineboquet/greek-conversion/wiki#ala-lc-modern) | *Alternative form of the preceding* | Modern Greek (after 1453) |
| [**`BNF_ADAPTED`**](https://github.com/antoineboquet/greek-conversion/wiki#bnf-adapted) | Bibliothèque nationale de France (adapted) | Ancient Greek |
| [**`ISO`**](https://github.com/antoineboquet/greek-conversion/wiki#iso-843-1997) | ISO 843 (1997) type 1 (transliteration) | Ancient and Modern Greek |
| [**`SBL`**](https://github.com/antoineboquet/greek-conversion/wiki#sbl) | Society of Biblical Literature | Ancient Greek |

### Conversion options

The **`IConversionOptions`** interface provides the following controls over the conversion process:

```ts
removeDiacritics?: boolean,          // remove diacritics, except those that represent letters

removeExtraWhitespace?: boolean,     // remove potential extra whitespace

betaCodeStyle?: {
  skipSanitization?: boolean,        // prevent the deletion of non-beta code characters
  useTLGStyle?: boolean              // use the Thesaurus Linguae Graecae style. e.g. 'Ἄϊδι' → '*)/AI+DI'
},

greekStyle?: {
  useBetaVariant?: boolean,          // use the typographic variant 'ϐ' [U+03D0] within a word
  useGreekQuestionMark?: boolean,    // use greek question marks ';' [U+037E] rather than regular semicolons
  useLunateSigma?: boolean,          // use lunate sigmas 'ϲ, Ϲ' rather than regular sigmas
  useMonotonicOrthography?: boolean  // only output monotonic accents (tonos, diaeresis)
},

transliterationStyle?: {
  setCoronisStyle?: Coronis,         // set Coronis enum to PSILI | APOSTOPHE | NO (defaults to: PSILI)
  useCxOverMacron?: boolean,         // use a circumflex rather than a macron for eta, omega, etc
  beta_v?: boolean,                  // transliterate 'β' as 'v' (defaults to: 'b')
  gammaNasal_n?: boolean,            // transliterate 'γ' as 'n' when nasalization occurs
  eta_i?: boolean,                   // transliterate 'η' as 'ī' (defaults to: 'ē')
  muPi_b?: boolean,                  // transliterate 'μπ' as 'b' at the beginning of a word
  nuTau_d?: boolean,                 // transliterate 'ντ' as 'd̲' at the beginning of a word
  xi_ks?: boolean,                   // transliterate 'ξ' as 'ks' (defaults to: 'x')
  rho_rh?: boolean,                  // transliterate 'ρ' as 'rh' even if it doesn't have a rough breathing
  phi_f?: boolean,                   // transliterate 'φ' as 'f' (defaults to: 'ph')
  chi_kh?: boolean,                  // transliterate 'χ' as 'kh' (defaults to: 'ch')
  upsilon_y?: boolean,               // transliterate 'υ' as 'y' (defaults to: 'u')
  lunatesigma_s?: boolean            // transliterate 'ϲ' [U+03F2] as 's' (defaults to: 'c')
},

additionalChars?:                    // extend the default mapping with additional chars
 AdditionalChar[] | AdditionalChar   //   (use AdditionalChar.ALL to enable the whole set)
```

A more detailed description of these conversion options is available on this [page](https://github.com/antoineboquet/greek-conversion/wiki#conversion-options).

### Examples

#### Basic examples

```ts
toBetaCode('ανθρωπος', KeyType.GREEK) // anqrwpos
toGreek('A)/i+da', KeyType.BETA_CODE) // Ἄϊδα
toGreek('*)/AI+DA', KeyType.TLG_BETA_CODE) // Ἄϊδα
toTransliteration('ἄϋλος', KeyType.GREEK, { removeDiacritics: true }) // aulos
```

#### Using presets

```ts
toTransliteration('Φίληβος ἢ Περὶ ἡδονῆς', KeyType.GREEK, Preset.ISO) // Fílīvos ī̀ Perì hīdonī̃s
toTransliteration('Φίληβος ἢ Περὶ ἡδονῆς', KeyType.GREEK, Preset.ALA_LC) // Philēbos ē Peri hēdonēs
```

#### Using a mixed preset

```ts
toTransliteration('Φίληβος ἢ Περὶ ἡδονῆς', KeyType.GREEK, [
  Preset.ALA_LC,
  { removeDiacritics: false }
]) // Phílēbos ḕ Perì hēdonē̃s
```

#### Using customized greek

```ts
const style = {
  greekStyle: {
    useLunateSigma: true
  }
}

toGreek('ICHTHUS ZŌNTŌN', KeyType.TRANSLITERATION) // ἸΧΘΥΣ ΖΩΝΤΩΝ
toGreek('ICHTHUS ZŌNTŌN', KeyType.TRANSLITERATION, style) // ἸΧΘΥϹ ΖΩΝΤΩΝ
```

#### Using customized transliteration

```ts
const style = {
  transliterationStyle: {
    useCxOverMacron: true,
    chi_kh: true
  }
}

toTransliteration('τέχνη', KeyType.GREEK) // téchnē
toTransliteration('τέχνη', KeyType.GREEK, style) // tékhnê
```

#### Self-conversion (reflect settings)

```ts
toBetaCode('O(pli/ths', KeyType.BETA_CODE, Preset.TLG) // *(OPLI/THS
toBetaCode('*(OPLI/THS', KeyType.TLG_BETA_CODE) // O(pli/ths

const grStyle = { greekStyle: { useLunateSigma: true } }
toGreek('ἅγιος', KeyType.GREEK, grStyle) // ἅγιοϲ

const trStyle = { transliterationStyle: { lunatesigma_s: true } }
toTransliteration('Cōkrátēc', KeyType.TRANSLITERATION, trStyle) // Sōkrátēs
```

## OOP style

### Summary

You can use the **`GreekString`** object if you want to manage several representations of a greek string. Conversions are made only as necessary.

`GreekString` constructor is:
```ts
str: string,
fromType: KeyType,
settings?: Preset | MixedPreset | IConversionOptions
```

You can access each representation by calling the following properties: `betaCode`, `greek` & `transliteration`.

Note that `settings` is also applied to the input string in order to have truly equivalent representations. You can retrieve the original string using the `source` property.

### Example

```ts
import { GreekString, KeyType } from 'greek-conversion'

const person = new GreekString(
  'ἄνθρωπος',
  KeyType.GREEK,
  { removeDiacritics: true }
)

person.betaCode // anqrwpos
person.greek // ανθρωπος
person.transliteration // anthrōpos

person.source // ἄνθρωπος
```

## Helper functions

#### `applyGreekVariants (greekStr: string, options?: IGreekStyle): string`

Applies beta/sigma variants and transforms `πσ` into `ψ`.

This function evaluates booleans `useBetaVariant` & `useLunateSigma` provided by the `IGreekStyle` interface.

#### `removeDiacritics (str: string, type: KeyType): string`

Removes all the diacritics from a given string. The set of diacritical marks depends of the greek string representation.

#### `removeGreekVariants (greekStr: string, removeLunateSigma?: boolean): string`

Removes beta and sigma variants.

## Limitations

This is what you should know before using this library:

- Greek numerals are not supported yet (see [Add support for greek numerals](https://github.com/antoineboquet/greek-conversion/issues/5)).

## License

Copyright (C) 2021, 2022, 2023, 2024  Antoine Boquet

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see https://www.gnu.org/licenses/agpl-3.0.fr.html.
