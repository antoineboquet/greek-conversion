# greek-conversion

A small library to convert an ancient greek string from/into various representations. This is full featured to deal with unaccentued greek strings (a good choice for search purposes), and work in progress to convert polytonic greek in a non-destructive manner (see [limitations](#limitations)).

## Installation

In order to use this library for your project, simply type `npm install --save greek-conversion`.

## Usage

Import the library's functions as needed and use it:

```js
import { keyType, toBetaCode, toGreek, toTransliteration } from 'greek-conversion'

toBetaCode('ανθρωπος', keyType.GREEK) // anqrwpos
toGreek('anthrôpos', keyType.TRANSLITERATION) // ανθρωπος
toTransliteration('anqrwpos', keyType.BETA_CODE) // anthrôpos
```

You can also import the library using the old CommonJS syntax:

```js
const greekConversion = require('greek-conversion')
```

Functions signature is consistently `str: string, from: keyType`, where the keyType enumeration can be set to `BETA_CODE`, `GREEK` and `TRANSLITERATION`.

Note that if you write plain javascript, you can fill the second parameter with string literals (`"beta_code"`, `"greek"`, `"transliteration"`) and avoid importing the keyType enumeration.

There is also an utility function `isMappedKey (key: string, type: keyType): boolean` that can be useful to check if a sequence exists in the mapping.

## Limitations

This library was first developped to let people type greek on a latin keyboard. So, for simplicity, diactrics weren't a real concern. This is what you should know before using this library:

- Currently, the `beta code` representation doesn't implement any greek diacritics. So, the beta code conversion will turn a polytonic greek string into a totally unaccented one (for example `ἵππος` becomes `ippos`);
- `Transliteration` doesn't implement greek accents but preserves rough breathings (`ἵππος` becomes `hippos`);
- Converting a transliterated string into `greek` doesn't keep the remaining diacritics;
- Little work has been done to detect multiple words (which is necessary to apply greek variants, like the sigma in word-final position). At present, a word is one or more characters delimited by a space;
- Moreover, some thoughts are necessary to take care of the iota subscript which is either omitted (the actual behaviour) or added as a regular "i" in a transliterated context. None of these solutions can be reverted easily.

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
