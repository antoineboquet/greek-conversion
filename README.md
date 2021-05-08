# greek-conversion

A small library to convert an ancient greek string from/into various representations. This is full featured to deal with unaccentued greek strings (a good choice for search purposes), and work in progress to convert polytonic greek in a non-destructive manner.

## Installation

In order to use this library into your project, simply type `npm i --save greek-conversion`.

You can also use the package that's available on this repository. Built files are stored into the `dist` folder.


## Usage

Import the library's methods as needed and use it:

```js
import { keyType, toBetaCode, toGreek, toTransliteration } from 'greek-conversion'

console.log(toBetaCode('ανθρωπος', keyType.GREEK)) // anqrwpos
console.log(toGreek('anthrôpos', keyType.TRANSLITERATION)) // ανθρωπος
console.log(toTransliteration('anqrwpos', keyType.BETA_CODE)) // anthrôpos
```

Methods signature is consistently `str: string, from: keyType`, where the keyType enumeration can be set to `BETA_CODE`, `GREEK` and `TRANSLITERATION`.

## Limitations

This library was first developped to let people type greek on a latin keyboard. So, for simplicity, diactrics weren't a real concern. This is what you should know before using this library:

- Currently, the `beta code` representation doesn't implement any greek diacritics. So, the beta code conversion is *destructive* and will turn a polytonic greek string into a totally unaccented one (`ἵππος` becomes `ippos`);
- the `transliterated` representation doesn't implement greek accents but preserves rough breathings (`ἵππος` becomes `hippos`);
- little work has been done to detect multiple words (which is necessary to apply greek variants, like the sigma in word-final position). At present, a word is one or more chars delimited by a space.

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
