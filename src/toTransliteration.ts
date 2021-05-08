import { keyType } from './enums'
import { mapping } from './mapping'
import {
  applyGammaDiphthongs,
  applyTransliteratedBreathings,
  removeDiacritics,
  removeGreekVariants
} from './utils'

export function toTransliteration (str: string, from: keyType): string {
  switch (from) {
    case keyType.BETA_CODE:
      str = fromBetaCodeToTransliteration(str)
      break

    case keyType.GREEK:
      str = applyTransliteratedBreathings(str, keyType.GREEK)
      str = removeDiacritics(str)
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
      if (key.greek === str[i]) {
        tmp = key.trans
      }
    }

    newStr += (tmp !== undefined) ? tmp : str[i]
  }

  return newStr
}
