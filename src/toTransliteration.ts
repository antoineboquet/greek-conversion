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
    let tmp = undefined

    for (const key of mapping) {
      const decomposedChar = str[i].normalize('NFD')

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
