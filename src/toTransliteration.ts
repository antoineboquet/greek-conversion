import { keyType } from './enums'
import { mapping } from './mapping'
import {
  applyGammaDiphthongs,
  applyTransliteratedBreathings,
  removeDiacritics,
  removeGreekVariants
} from './utils'

export function toTransliteration (
  str: string,
  from: keyType,
  options: { removeDiacritics?: boolean } = {}
): string {
  switch (from) {
    case keyType.BETA_CODE:
      str = fromBetaCodeToTransliteration(str)
      break

    case keyType.GREEK:
      str = applyTransliteratedBreathings(str, keyType.GREEK)
      if (options.removeDiacritics) str = removeDiacritics(str)
      str = removeGreekVariants(str)
      // Normalize `middle dot` (\u00B7) to `greek ano teleia` (\u0387).
      str = str.replace(/\u00B7/g, '\u0387')
      str = fromGreekToTransliteration(str)
      break

    default: break
  }

  return applyGammaDiphthongs(str, keyType.TRANSLITERATION)
}

function fromBetaCodeToTransliteration (str: string): string {
  let newStr = ''

  for (let i = 0; i < str.length; i++) {
    let tmp = undefined

    for (const key of mapping) {
      if (key.latin === str[i]) {
        tmp = key.trans
      }
    }

    newStr += (tmp !== undefined) ? tmp : str[i]
  }

  return newStr
}

function fromGreekToTransliteration (str: string): string {
  let newStr = ''

  for (let i = 0; i < str.length; i++) {
    let tmp: string = undefined

    for (const key of mapping) {
      // `Combining Greek Perispomeni` (\u0342) diacritic is greek-only and must
      // be converted to the latin diacritical mark `Combining Tilde` (\u0303).
      const decomposedChar = str[i].normalize('NFD').replace(/\u0342/g, '\u0303')

      if (key.greek === str[i]) {
        tmp = key.trans
      } else if (key.greek === decomposedChar.charAt(0)) {
        tmp = key.trans.normalize('NFD') + decomposedChar.slice(1)
        tmp = tmp.normalize('NFC')
      }
    }

    newStr += (tmp !== undefined) ? tmp : str[i]
  }

  return newStr
}
