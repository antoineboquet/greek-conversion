import { keyType } from './enums'
import { mapping } from './mapping'
import {
  applyGammaDiphthongs,
  applyGreekVariants,
  removeDiacritics
} from './utils'

export function toGreek (
  str: string,
  from: keyType,
  options: { removeDiacritics?: boolean } = {}
): string {
  switch (from) {
    case keyType.BETA_CODE:
      // Diacritics aren't implemented, so always remove them.
      str = removeDiacritics(str)
      str = fromBetaCodeToGreek(str)
      break

    case keyType.TRANSLITERATION:
      if (options.removeDiacritics) str = removeDiacritics(str)
      str = fromTransliterationToGreek(str)
      break

    default: break
  }

  str = applyGreekVariants(str)
  str = applyGammaDiphthongs(str, keyType.GREEK)

  return str
}

function fromBetaCodeToGreek (str: string): string {
  let newStr = ''

  for (let i = 0; i < str.length; i++) {
    let tmp = undefined

    for (const key of mapping) {
      if (key.latin === str[i]) {
        tmp = key.greek
      }
    }

    newStr += (tmp !== undefined) ? tmp : str[i]
  }

  return newStr
}

function fromTransliterationToGreek (str: string): string {
  let newStr = ''

  for (let i = 0; i < str.length; i++) {
    const tmp = { trans: '', greek: '' }

    let  pair = str.slice(i, i + 2)
    if (pair.length !== 2) pair = ''

    // Facultative `h` character: ignore if its position is credible

    // A `h` but no consecutive `h`
    const rule1 = (/h/i.test(str[i]) && !/h/i.test(str[i + 1]))
    // A `h` may appear behind a `r`
    const rule2 = (/[r]/i.test(str[i - 1]))
    // A `h` may appear in first place (of a string or a word) when it precedes a wovel
    const rule3 = (
      (str[i - 1] === undefined || str[i - 1] === ' ')
      && /[aeêioôu]/i.test(str[i + 1])
    )

    // When the transliterated breathing is uppercase,
    // the greek word must start with a capital letter.
    if (rule3 && str[i] === 'H') {
      str = str.slice(0, (i + 1)) + str[i + 1].toUpperCase() + str.slice(i + 2)
    }

    if (rule1 && (rule2 || rule3)) continue

    for (let j = 0; j < mapping.length; j++) {
      // `Combining Tilde` (\u0303) diacritic is latin-only and must be converted
      // to the latin diacritical mark `Combining Greek Perispomeni` (\u0342).
      let decomposedChar = str[i].normalize('NFD').replace(/\u0303/g, '\u0342')
      // Isolate the character with its potential circumflex (as this diacritical
      // mark is used to represent long wovels in transliterated form).
      let recomposedChar = decomposedChar.charAt(0)

      // \u0302 = circumflex.
      if (decomposedChar.includes('\u0302')) {
        recomposedChar += '\u0302'
        decomposedChar = decomposedChar.replace(/\u0302/g, '')
      }

      recomposedChar = recomposedChar.normalize('NFC')

      if (mapping[j].trans === recomposedChar || mapping[j].trans === pair) {
        tmp.trans = mapping[j].trans
        // Char + potential remaining diacritics.
        tmp.greek = mapping[j].greek + decomposedChar.slice(1)

        // If a pair has been found, increase the index (because
        // two letters have been processed) and stop the search.
        if (mapping[j].trans === pair) i++; break
      }
    }

    newStr += tmp.greek.normalize('NFC') || str[i]
  }

  return newStr
}
