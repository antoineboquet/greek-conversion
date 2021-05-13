import { keyType } from './enums'
import { mapping } from './mapping'
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
      str = fromBetaCodeToTransliteration(str)
      break

    case keyType.GREEK:
      str = applyBreathings(str, keyType.GREEK)
      if (options.removeDiacritics) str = removeDiacritics(str)
      str = removeGreekVariants(str)
      str = normalizeGreek(str)
      str = fromGreekToTransliteration(str)
      break
  }

  return applyGammaDiphthongs(str, keyType.TRANSLITERATION)
}

export function applyBreathings (str: string, from: keyType): string {
  switch (from) {
    case keyType.BETA_CODE: break

    case keyType.GREEK:
      str = str.normalize('NFD')

      // Remove smooth breathings.
      str = str.replace(/\u0313/g, '')

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
      break
  }

  return str
}

function fromBetaCodeToTransliteration (betaCodeStr: string): string {
  let transliteratedStr = ''

  for (const char of betaCodeStr) {
    let tmp: string

    for (const key of mapping) {
      if (key.latin === char) {
        tmp = key.trans
        break
      }
    }

    transliteratedStr += tmp ?? char
  }

  return transliteratedStr
}

function fromGreekToTransliteration (greekStr: string): string {
  let transliteratedStr = ''

  for (const char of greekStr) {
    let tmp: string

    for (const key of mapping) {
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
