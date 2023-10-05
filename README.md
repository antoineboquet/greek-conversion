# greek-conversion

> **This library needs some feedback before getting its first stable release!**

A small library to convert a polytonic greek string from/into various representations.

## Summary

1. [Usage](#usage)
    1. [With a package manager (recommended)](#with-a-package-manager-recommended)
    2. [The old way](#the-old-way)
2. [Core functions](#core-functions)
    1. [Summary](#summary-1)
    2. [Examples](#examples)
3. [OOP style](#oop-style)
    1. [Summary](#summary-2)
    2. [Example](#example)
4. [Helper functions](#helper-functions)
5. [Limitations](#limitations)
6. [License](#license)

## Usage

### With a package manager (recommended)
In order to use this library for your project, simply type:
```
npm install --save greek-conversion
```

Import the library's functions as needed:

```js
// ES6 modules syntax
import { keyType, toBetaCode, toGreek, toTransliteration } from 'greek-conversion'

// OR CommonJS syntax
const gc = require('greek-conversion')
```

Then use them:

```js
// Let's transliterate some Thucydides

toTransliteration(                                   // Héllêsin egéneto
  'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ' +  // kaì mérei tinì tỗn
  'ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',         // barbárôn, hôs dè
  keyType.GREEK,                                     // eipeĩn kaì epì
)                                                    // pleĩston anthrốpôn.
```

### The old way

> This is primarily intended for the use of the library in the browser in the absence of a modern development environment.

You can either import the library from the unpkg <abbr title="Content Delivery Network">CDN</abbr> (`https://www.unpkg.com/greek-conversion`) or download the latest release on Github then include `greekConversion.min.js` into your project (but you could experience a CORS issue in this case and need to use a local server to run your project).

As the library is built as a module, the `<script>` tag needs to be set as `type="module"` (which is supported by all modern browsers).

You can then call the library's functions as exemplified below:

```html
<script type="module">
  import { keyType, toGreek } from 'https://www.unpkg.com/greek-conversion' // or './greekConversion.min.js'
  console.log(toGreek('anthrôpos', keyType.TRANSLITERATION)) // ανθρωπος
</script>
```

## Core functions

### Summary

This library provides three main functions to convert a greek string: **`toBetaCode`**, **`toGreek`** & **`toTransliteration`**. You can refer to the [conversion chart](https://github.com/antoineboquet/greek-conversion/wiki#conversion-chart) for further information about the expected input & output.

Functions signature is consistently `str: string, from: keyType, options: ConversionOptions = {}`.

The **`keyType`** enumeration can be set to `BETA_CODE | GREEK | TRANSLITERATION` (e.g. `keyType.GREEK`).\
If you write plain JavaScript, you can also use string literals ("beta-code", "greek", "transliteration").

The **`ConversionOptions`** interface provides some control other the conversion process:

```ts
{
  preserveWhitespace?: boolean, // multiple spaces are deleted by default
  removeDiacritics?: boolean,   // diacritics are preserved by default
  disableBetaVariant?: boolean  // the typographic variant `ϐ` [U+03D0] is enabled by default (greek)
}
```

### Examples

```js
// With unaccented strings

toBetaCode('ανθρωπος', keyType.GREEK) // anqrwpos
toGreek('anthrôpos', keyType.TRANSLITERATION) // ανθρωπος
toTransliteration('anqrwpos', keyType.BETA_CODE) // anthrôpos

// With accented strings

toGreek('A)/i+da', keyType.BETA_CODE) // Ἄϊδα
toTransliteration('ἄϋλος', keyType.GREEK) // áülos
toTransliteration('ἄϋλος', keyType.GREEK, { removeDiacritics: true }) // aulos
```

## OOP style

### Summary

You can also use the **`GreekString`** object if you want to manage several representations of a greek string.

As multiple conversions can be destructive (see [limitations](#limitations)), <abbr title="Object-Oriented Programming">OOP</abbr> helps you to keep multiple representations of a greek string in memory without doing multiple potentialy-destructive conversions or creating a lot of variables. Conversions are made only as necessary.

`GreekString` constructor is `str: string, from: keyType, options?: ConversionOptions`.

You can access each representation by calling the following properties: `betaCode`, `greek` & `transliteration`.

Note that `ConversionOptions` is also applied to the input string in order to have truly equivalent representations. You can retrieve the original string using the `source` property.


### Example

```js
import { GreekString, keyType } from 'greek-conversion'

const person = new GreekString(
  'ἄνθρωπος',
  keyType.GREEK,
  { removeDiacritics: true }
)

person.betaCode // anqrwpos
person.greek // ανθρωπος
person.transliteration // anthrôpos

person.source // ἄνθρωπος
```

## Helper functions

#### `applyGreekVariants (str: string, disableBetaVariant?: boolean): string`

Applies beta/sigma variants and transforms `πσ` into `ψ`.

#### `applyGammaDiphthongs (str: string, type: keyType): string`

Applies gamma diphthongs for strings of type `GREEK | TRANSLITERATION`.\
e.g. `aggelos -> angelos` and `ανγελος -> αγγελος`.

#### `isMappedKey (key: string, type: keyType): boolean`

Checks if a key is used by the converter.

#### `removeDiacritics (str: string, type: keyType): string`

Removes all the diacritics from a given string. Diacritics are defined for each representation of a greek string.

#### `removeGreekVariants (str: string): string`

Removes beta and sigma variants.

## Limitations

This is what you should know before using this library:

- Converting from `transliteration` to `betacode` or `greek` keeps breathings but loses coronis (when crasis occurs like in κἂν [= καὶ ἄν]);
- When converting to `betacode`, some characters that represent diacritics can't be used as autonomous characters (`), (, /, \, +, =, |`);
- When converting to `betacode` or `transliteration`, the *ano teleia* (`·`), which represents either a semicolon (`;`) or a colon (`:`), is always converted as a semicolon;
- Accents should be normalized when converting to `greek` (because they can be encoded either `tonos` [= modern greek] or `oxia` [= ancient greek]);
- Some thoughts are necessary to take care of the iota subscript which can either be omitted or added as a regular "i" in a transliterated context. None of these solutions can be reverted easily. The actual behaviour conservs the iota subscript below the latin letter.

This should evolve in the future. Contributions are welcome.

## License

Copyright (C) 2021, 2022, 2023  Antoine Boquet

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
