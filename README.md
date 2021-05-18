# greek-conversion

A small library to convert an ancient greek string from/into various representations. This is full featured to deal with unaccentued greek strings (a good choice for search purposes), and work in progress to convert polytonic greek in a non-destructive manner (see [limitations](#limitations)).

## Installation

In order to use this library for your project, simply type `npm install --save greek-conversion`.

## Usage

First import the library's functions as needed:

```js
// ES6 modules syntax
import { keyType, toBetaCode, toGreek, toTransliteration } from 'greek-conversion'

// OR CommonJS syntax
const gc = require('greek-conversion')
```

Then use it:

```js
// With unaccented strings

toBetaCode('ανθρωπος', keyType.GREEK) // anqrwpos
toGreek('anthrôpos', keyType.TRANSLITERATION) // ανθρωπος
toTransliteration('anqrwpos', keyType.BETA_CODE) // anthrôpos

// With accented strings

toTransliteration('ἄϋλος', keyType.GREEK) // áülos
toTransliteration('ἄϋλος', keyType.GREEK, { removeDiacritics: true }) // aulos

// Let's transliterate some Thucydides

toTransliteration(                                   // Héllêsin egéneto
  'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ' +  // kaì mérei tinì tỗn
  'ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',         // barbárôn, hôs dè
  keyType.GREEK)                                     // eipeĩn kaì epì
)                                                    // pleĩston anthrốpôn.
```

Functions signature is consistently `str: string, from: keyType, options: { removeDiacritics?: boolean }`
- where the `keyType` enumeration can be set to `BETA_CODE | GREEK | TRANSLITERATION`;
- and the `removeDiacritics` option is turned off by default.

Note that if you write plain javascript, you can fill the second parameter with string literals (`"beta_code", "greek", "transliteration"`) and avoid importing the keyType enumeration.

There is also an utility function `isMappedKey (key: string, type: keyType): boolean` that can be useful to check if a sequence exists in the mapping.

## Limitations

This is what you should know before using this library:

- Converting from `transliteration` to `betacode` or `greek` keeps breathings but loses coronis (when crasis occurs like in κἂν *= καὶ ἄν*);
- When converting to `betacode`, some characters that represent diacritics can't be use as autonomous characters (`), (, /, \, +, =, |`);
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
