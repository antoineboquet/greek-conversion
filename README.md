# greek-conversion

> **This library needs some feedback before getting its first stable release!**

A small library to convert a polytonic greek string from/into various representations.

## Usage

In order to use this library for your project, simply type `npm install --save greek-conversion`.

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
  keyType.GREEK)                                     // eipeĩn kaì epì
)                                                    // pleĩston anthrốpôn.
```

### toBetaCode ⋅ toGreek ⋅ toTransliteration

Functions signature is consistently **`str: string, from: keyType, options: ConversionOptions = {}`**

The **`keyType`** enumeration can be set to `BETA_CODE | GREEK | TRANSLITERATION` (e.g. `keyType.GREEK`).\
If you write plain JavaScript, you can also use string literals ("beta-code", "greek", "transliteration").

The **`ConversionOptions`** interface provides some control other the conversion process:

```ts
{
  preserveWhitespace?: boolean, // multiple spaces are deleted by default
  removeDiacritics?: boolean    // diacritics are preserved by default
}
```

#### Examples

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

### Other functions

#### `applyGreekVariants (str: string): string`

Applies beta and sigma variants, and transforms `πσ` in `ψ`.

#### `applyGammaDiphthongs (str: string, type: keyType): string`

Applies gamma diphtongs for strings of type `GREEK | TRANSLITERATION`.\
e.g. `aggelos -> angelos` and `ανγελος -> αγγελος`.

#### `isMappedKey (key: string, type: keyType): boolean`

Checks if a key is used by the converter.

#### `removeDiacritics (str: string, type: keyType): string`

Removes all the diacritics from a given string.

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

Copyright (C) 2021  Antoine Boquet

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
