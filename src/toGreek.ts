import { keyType } from './enums'
import { mapping } from './mapping'
import {
  applyGammaDiphthongs,
  applyGreekVariants,
  normalizeGreek,
  removeDiacritics
} from './utils'

export function toGreek (
  str: string,
  from: keyType,
  options: ConversionOptions = {}
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
      str = applyBreathings(str)
      str = normalizeGreek(str)
      break
  }

  str = applyGreekVariants(str)
  str = applyGammaDiphthongs(str, keyType.GREEK)

  return str
}

function applyBreathings (str: string) {
  const words = str.split(' ')

  words.forEach((el, i) => {
    if (el.charAt(0) === 'H') {
      el = el.slice(1)
      words[i] = el.charAt(0).toUpperCase() + el.slice(1)
    }
  })

  str = words.join(' ')
  str = str.replace(/h/gi, '')

  return str
}

function fromBetaCodeToGreek (betaCodeStr: string): string {
  let greekStr = ''

  for (const char of betaCodeStr) {
    let tmp: string

    for (const key of mapping) {
      if (key.latin === char) {
        tmp = key.greek
        break
      }
    }

    greekStr += tmp ?? char
  }

  return greekStr
}

function fromTransliterationToGreek (transliteratedStr: string): string {
  let greekStr = ''

  for (let i = 0; i < transliteratedStr.length; i++) {
    const tmp = { trans: '', greek: '' }

    let pair = transliteratedStr.slice(i, (i + 2))
    if (pair.length !== 2) pair = ''

    for (const key of mapping) {
      // `Combining Tilde` (\u0303) diacritic is latin-only and must be converted
      // to the latin diacritical mark `Combining Greek Perispomeni` (\u0342).
      let decomposedChar = transliteratedStr[i].normalize('NFD').replace(/\u0303/g, '\u0342')
      // Isolate the character with its potential circumflex (as this diacritical
      // mark is used to represent long vowels in transliterated form).
      let recomposedChar = recomposeChar(decomposedChar)

      decomposedChar = decomposedChar.replace(/\u0302/g, '') // \u0302 = circumflex.

      if ([recomposedChar, pair].includes(key.trans)) {
        tmp.trans = key.trans
        // Char + potential remaining diacritics.
        tmp.greek = key.greek + decomposedChar.slice(1)

        // If a pair has been found, increase the index (because
        // two letters have been processed) and stop the search.
        if (key.trans === pair) i++; break
      }
    }

    greekStr += tmp.greek.normalize('NFC') || transliteratedStr[i]
  }

  return greekStr
}

function recomposeChar (decomposedChar: string): string {
  let recomposedChar = decomposedChar.charAt(0)

  // \u0302 = circumflex.
  if (decomposedChar.includes('\u0302')) {
    recomposedChar += '\u0302'
  }

  return recomposedChar.normalize('NFC')
}
