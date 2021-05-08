import { keyType } from './enums'
import { mapping } from './mapping'
import { removeDiacritics, removeGreekVariants } from './utils'

export function toBetaCode (str: string, from: keyType): string {
  switch (from) {
    case keyType.GREEK:
      str = removeDiacritics(str)
      str = removeGreekVariants(str)
      str = fromGreekToBetaCode(str)
      break

    case keyType.TRANSLITERATION:
      str = fromTransliterationToBetaCode(str)
      break

    default: break
  }

  return str
}

function fromGreekToBetaCode (str: string): string {
  let newStr = ''

  for (let i = 0; i < str.length; i++) {
    let tmp = undefined

    for (const key of mapping) {
      if (key.greek === str[i]) {
        tmp = key.latin
      }
    }

    newStr += (tmp !== undefined) ? tmp : str[i]
  }

  return newStr
}

function fromTransliterationToBetaCode (str: string): string {
  let newStr = ''

  for (let i = 0; i < str.length; i++) {
    const tmp = { trans: '', latin: '' }

    let  pair = str.slice(i, i + 2)
    if (pair.length !== 2) pair = undefined

    for (let j = 0; j < mapping.length; j++) {
      if (mapping[j].trans === str[i] || mapping[j].trans === pair) {
        tmp.trans = mapping[j].trans
        tmp.latin = mapping[j].latin

        if (mapping[j].trans === pair) i++; break
      }
    }

    newStr += tmp.latin || ((!/h/i.test(str[i])) ? str[i] : '')
  }

  return newStr
}
