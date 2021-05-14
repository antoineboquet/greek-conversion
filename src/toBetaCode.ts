import { keyType } from './enums'
import { greekMapping } from './mapping'
import { removeDiacritics, removeGreekVariants } from './utils'

export function toBetaCode (
  str: string,
  from: keyType,
  options: ConversionOptions = {}
): string {
  switch (from) {
    case keyType.GREEK:
      if (options.removeDiacritics) str = removeDiacritics(str)
      str = removeDiacritics(str)
      str = removeGreekVariants(str)
      str = fromGreekToBetaCode(str)
      break

    case keyType.TRANSLITERATION:
      if (options.removeDiacritics) str = removeDiacritics(str)
      str = fromTransliterationToBetaCode(str)
      break
  }

  return str
}

function fromGreekToBetaCode (str: string): string {
  let betaCodeStr = ''

  for (const ch of str) {
    let tmp: string = undefined

    for (const key of greekMapping) {
      if (key.greek === ch) tmp = key.latin
    }

    betaCodeStr += tmp ?? ch
  }

  return betaCodeStr
}

function fromTransliterationToBetaCode (str: string): string {
  let betaCodeStr = ''

  for (let i = 0; i < str.length; i++) {
    const tmp = { trans: undefined, latin: undefined }

    let  pair = str.slice(i, i + 2)
    if (pair.length !== 2) pair = undefined

    for (const key of greekMapping) {
      if ([str[i], pair].includes(key.trans)) {
        tmp.trans = key.trans
        tmp.latin = key.latin

        if (key.trans === pair) i++; break
      }
    }

    betaCodeStr += tmp.latin || ((!/h/i.test(str[i])) ? str[i] : '')
  }

  return betaCodeStr
}
