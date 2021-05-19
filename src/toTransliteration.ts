import { keyType } from './enums'
import { diacriticsMapping, greekMapping } from './mapping'
import {
  applyGammaDiphthongs,
  normalizeGreek,
  removeDiacritics,
  removeGreekVariants
} from './utils'

export function toTransliteration (
  str: string,
  from: keyType,
  options: ConversionOptions = {}
): string {
  switch (from) {
    case keyType.BETA_CODE:
      str = removeSmoothBreathings(str, keyType.BETA_CODE)
      str = flagRoughBreathings(str)
      str = fromBetaCodeToTransliteration(str, options.removeDiacritics)
      break

    case keyType.GREEK:
      if (options.removeDiacritics) str = removeDiacritics(str)
      str = removeSmoothBreathings(str, keyType.GREEK)
      str = applyRoughBreathings(str)
      str = removeGreekVariants(str)
      str = normalizeGreek(str)
      str = fromGreekToTransliteration(str)
      break
  }

  return applyGammaDiphthongs(str, keyType.TRANSLITERATION)
}

function applyRoughBreathings (str: string): string {
  str = str.normalize('NFD')

  // Transliterate rough breathings with an `h`.
  str = str.replace(/([α-ω]+)\u0314/gi, (match, group) => {
    if (match.toLowerCase() === 'ῥ') {
      return group + 'h'
    } else {
      if (group === group.toLowerCase()) return 'h' + group
      else return 'H' + group.toLowerCase()
    }
  })

  str = str.normalize('NFC')

  return str
}

function flagRoughBreathings (str: string): string {
  // Rough breathings are ambiguous as `h` converts to `ê`.
  // This transforms rough breathings to unambiguous flags ($ = h, £ = H)
  // that need to be transliterated in fromBetaCodeToTransliteration().
  str = str.replace(/([aehiowu]+)\(/gi, (match, group) => {
    if (match.toLowerCase() === 'r(') {
      return group + '$'
    } else {
      if (group === group.toLowerCase()) return '$' + group
      else return '£' + group.toLowerCase()
    }
  })

  return str
}

function fromBetaCodeToTransliteration (
  betaCodeStr: string,
  removeDiacritics: boolean
): string {
  let transliteratedStr = ''

  const mapping = (!removeDiacritics)
    ? [...greekMapping, ...diacriticsMapping]
    : greekMapping

  const diacritics = diacriticsMapping.map((el) => el.latin)

  for (const char of betaCodeStr) {
    let tmp: string

    for (const key of mapping) {
      if (key.latin === char) {
        tmp = key.trans
        break
      }
    }

    if (!removeDiacritics || (removeDiacritics && !diacritics.includes(char))) {
      transliteratedStr += tmp ?? char
    }
  }

  transliteratedStr = transliteratedStr.replace(/\$/g, 'h').replace(/£/g, 'H')

  if (!removeDiacritics) transliteratedStr = transliteratedStr.normalize('NFC')

  return transliteratedStr
}

function fromGreekToTransliteration (greekStr: string): string {
  let transliteratedStr = ''

  for (const char of greekStr) {
    let tmp: string

    for (const key of greekMapping) {
      // `Combining Greek Perispomeni` (\u0342) diacritic is greek-only and must
      // be converted to the latin diacritical mark `Combining Tilde` (\u0303).
      const decomposedChar = char.normalize('NFD').replace(/\u0342/g, '\u0303')

      switch (key.greek) {
        case char:
          tmp = key.trans
          break

        case decomposedChar.charAt(0):
          tmp = key.trans.normalize('NFD') + decomposedChar.slice(1)
          tmp = tmp.normalize('NFC')
          break
      }

      if (tmp) break
    }

    transliteratedStr += tmp ?? char
  }

  return transliteratedStr
}

function removeSmoothBreathings (str: string, type: keyType): string {
  switch (type) {
    case keyType.BETA_CODE:
      str = str.replace(/\)/g, '')
      break

    case keyType.GREEK:
      str = str.normalize('NFD')
      str = str.replace(/\u0313/g, '')
      str = str.normalize('NFC')
      break
  }

  return str
}
