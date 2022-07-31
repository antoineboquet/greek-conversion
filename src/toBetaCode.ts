import { keyType } from './enums'
import { ConversionOptions } from './interfaces'

import {
  ACCENTS, IOTA_SUBSCRIPT,
  diacriticsMapping,
  greekMapping
} from './mapping'

import {
  applyBreathings,
  applyUppercaseChars,
  removeDiacritics,
  recomposeTransliteratedChar,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils'

export function toBetaCode (
  str: string,
  from: keyType,
  options: ConversionOptions = {}
): string {
  switch (from) {
    case keyType.GREEK:
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.GREEK)
      str = removeGreekVariants(str)
      str = fromGreekToBetaCode(str, options.removeDiacritics)
      break

    case keyType.TRANSLITERATION:
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.TRANSLITERATION)

      str = applyUppercaseChars(str)
      str = fromTransliterationToBetaCode(str)

      const applyBreathingsOptions = {
        accents: ACCENTS + IOTA_SUBSCRIPT,
        breathings: { rough: '(', smooth: ')' },
        vowels: 'aehiowu'
      }

      if (options.removeDiacritics) str = str.replace(/(^|\s)h/gi, '$1')
      else str = applyBreathings(str, applyBreathingsOptions)
      break
  }

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str)

  return str
}

function convertTransliteratedDiacritics (decomposedDiacritics: string): string {
  let betaCodeDiacritics = ''

  for (const point of decomposedDiacritics) {
    for (const diacritic of diacriticsMapping) {
      if (point === diacritic.trans) {
        betaCodeDiacritics += diacritic.latin
        break
      }
    }
  }

  // Reorder diacritics (grave/accute/tilde then diaeresis & iota subscript).
  betaCodeDiacritics = betaCodeDiacritics.replace(/([+|])([\/\\=])/g, '$2$1')

  return betaCodeDiacritics
}

function fromGreekToBetaCode (
  greekStr: string,
  removeDiacritics: boolean
): string {
  let betaCodeStr = ''

  const mapping = (!removeDiacritics)
    ? [...greekMapping, ...diacriticsMapping]
    : greekMapping

  if (!removeDiacritics) {
    greekStr = greekStr.normalize('NFD')
  }

  for (const char of greekStr) {
    let tmp: string

    for (const key of mapping) {
      if (key.greek === char) {
        tmp = key.latin
        break
      }
    }

    betaCodeStr += tmp ?? char
  }

  return betaCodeStr
}

function fromTransliterationToBetaCode (transliteratedStr: string): string {
  let betaCodeStr = ''

  for (let i = 0; i < transliteratedStr.length; i++) {
    const tmp = { trans: '', latin: '' }

    let pair = transliteratedStr.slice(i, (i + 2))
    if (pair.length !== 2) pair = ''

    let decomposedChar = transliteratedStr[i].normalize('NFD')

    // Isolate the character with its potential circumflex (as this diacritical
    // mark is used to represent long vowels in transliterated form).
    let recomposedChar = recomposeTransliteratedChar(decomposedChar)

    for (const key of greekMapping) {
      if ([recomposedChar, pair].includes(key.trans)) {
        tmp.trans = key.trans
        tmp.latin = key.latin

        if (key.trans === pair) {
          i++; break
        }
      }
    }

    tmp.latin += convertTransliteratedDiacritics(decomposedChar.slice(1))

    betaCodeStr += tmp.latin || transliteratedStr[i]
  }

  return betaCodeStr
}
