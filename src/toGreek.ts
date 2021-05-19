import { keyType } from './enums'
import { diacriticsMapping, greekMapping } from './mapping'
import {
  applyGammaDiphthongs,
  applyGreekVariants,
  applyUppercaseChars,
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace
} from './utils'

export function toGreek (
  str: string,
  from: keyType,
  options: ConversionOptions = {}
): string {
  switch (from) {
    case keyType.BETA_CODE:
      str = fromBetaCodeToGreek(str, options.removeDiacritics)
      break

    case keyType.TRANSLITERATION:
      if (options.removeDiacritics) str = removeDiacritics(str)

      str = fromTransliterationToGreek(str)
      str = applyUppercaseChars(str)

      if (options.removeDiacritics) str = str.replace(/h/gi, '')
      else str = applyBreathings(str)

      str = normalizeGreek(str)
      break
  }

  str = applyGreekVariants(str)
  str = applyGammaDiphthongs(str, keyType.GREEK)

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str)

  return str
}

function applyBreathings (str: string): string {
  str = str.normalize('NFD')

  const pattern = new RegExp(
    // (start or space) (rough breathing?) (accented vowels) (diaeresis?)
    /(^|\s)(h)?([αεηιοωυ\u0301\u0300\u0303\u0345]+)(\u0308)?/, 'gi'
  )

  // Apply breathings on vowels.
  str = str.replace(pattern, (match, start, roughBreathing, group, diaeresis) => {
    // Smooth breathing (\u0313) or rough breathing (\u3014).
    const breathing = (roughBreathing) ? '\u0314' : '\u0313'

    if (diaeresis) {
      match = match.normalize('NFC')

      const vowelsGroup = match.slice(0, match.length - 1).normalize('NFD')
      const vowelWithDiaeresis = match.slice(match.length - 1).normalize('NFD')

      return start + vowelsGroup + breathing + vowelWithDiaeresis
    }

    return start + group + breathing
  })

  // Apply rough breathings on `rho`.
  str = str.replace(/(ρ)h/gi, '$1\u0314')

  // Reorder diacritics.
  str = str.replace(/([\u0301\u0300\u0303\u0345])([\u0313\u0314])/g, '$2$1')

  return str.normalize('NFC')
}

function fromBetaCodeToGreek (
  betaCodeStr: string,
  removeDiacritics: boolean
): string {
  let greekStr = ''

  const mapping = (!removeDiacritics)
    ? [...greekMapping, ...diacriticsMapping]
    : greekMapping

  const diacritics = diacriticsMapping.map((el) => el.latin)

  for (const char of betaCodeStr) {
    let tmp: string

    for (const key of mapping) {
      if (key.latin === char) {
        tmp = key.greek
        break
      }
    }

    if (!removeDiacritics || (removeDiacritics && !diacritics.includes(char))) {
      greekStr += tmp ?? char
    }
  }

  if (!removeDiacritics) greekStr = greekStr.normalize('NFC')

  return greekStr
}

function fromTransliterationToGreek (transliteratedStr: string): string {
  let greekStr = ''

  for (let i = 0; i < transliteratedStr.length; i++) {
    const tmp = { trans: '', greek: '' }

    let pair = transliteratedStr.slice(i, (i + 2))
    if (pair.length !== 2) pair = ''

    // `Combining Tilde` (\u0303) diacritic is latin-only and must be converted
    // to the latin diacritical mark `Combining Greek Perispomeni` (\u0342).
    let decomposedChar = transliteratedStr[i].normalize('NFD').replace(/\u0303/g, '\u0342')
    // Isolate the character with its potential circumflex (as this diacritical
    // mark is used to represent long vowels in transliterated form).
    let recomposedChar = recomposeChar(decomposedChar)

    decomposedChar = decomposedChar.replace(/\u0302/g, '') // \u0302 = circumflex.

    for (const key of greekMapping) {
      if ([recomposedChar, pair].includes(key.trans)) {
        tmp.trans = key.trans
        // Char + potential remaining diacritics.
        tmp.greek = key.greek + decomposedChar.slice(1)

        // If a pair has been found, increase the index (because
        // two letters have been processed) and stop the search.
        if (key.trans === pair) {
          i++; break
        }
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
