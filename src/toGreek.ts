import { keyType } from './enums'
import { ConversionOptions } from './interfaces'

import {
  ACCENTS, CIRCUMFLEX, IOTA_SUBSCRIPT, ROUGH_BREATHING, SMOOTH_BREATHING,
  diacriticsMapping,
  greekMapping
} from './mapping'

import {
  applyBreathings,
  applyGammaDiphthongs,
  applyGreekVariants,
  applyUppercaseChars,
  normalizeGreek,
  recomposeTransliteratedChar,
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
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.BETA_CODE)
      str = fromBetaCodeToGreek(str, options.removeDiacritics)
      break

    case keyType.TRANSLITERATION:
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.TRANSLITERATION)

      str = fromTransliterationToGreek(str)
      str = applyUppercaseChars(str)

      const applyBreathingsOptions = {
        accents: ACCENTS + IOTA_SUBSCRIPT,
        breathings: { rough: ROUGH_BREATHING, smooth: SMOOTH_BREATHING },
        vowels: 'αεηιοωυ'
      }

      if (options.removeDiacritics) str = str.replace(/h/gi, '')
      else str = applyBreathings(str, applyBreathingsOptions)

      str = normalizeGreek(str)
      break
  }

  str = applyGreekVariants(str)
  str = applyGammaDiphthongs(str, keyType.GREEK)

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str)

  return str
}

function fromBetaCodeToGreek (
  betaCodeStr: string,
  removeDiacritics: boolean
): string {
  let greekStr = ''

  const mapping = (!removeDiacritics)
    ? [...greekMapping, ...diacriticsMapping]
    : greekMapping

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

  if (!removeDiacritics) greekStr = greekStr.normalize('NFC')

  return greekStr
}

function fromTransliterationToGreek (transliteratedStr: string): string {
  let greekStr = ''

  for (let i = 0; i < transliteratedStr.length; i++) {
    const tmp = { trans: '', greek: '' }

    let pair = transliteratedStr.slice(i, (i + 2))
    if (pair.length !== 2) pair = ''

    let decomposedChar = transliteratedStr[i].normalize('NFD')
    // Isolate the character with its potential circumflex (as this diacritical
    // mark is used to represent long vowels in transliterated form).
    let recomposedChar = recomposeTransliteratedChar(decomposedChar)

    decomposedChar = decomposedChar.replace(new RegExp(CIRCUMFLEX, 'g'), '')

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
