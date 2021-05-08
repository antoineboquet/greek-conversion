import { keyType } from './enums'
import { mapping } from './mapping'
import { applyGammaDiphthongs, applyGreekVariants, removeDiacritics } from './utils'

export function toGreek (str: string, from: keyType): string {
  str = removeDiacritics(str)

  switch (from) {
    case keyType.BETA_CODE:
      str = fromBetaCodeToGreek(str)
      break

    case keyType.TRANSLITERATION:
      str = fromTransliterationToGreek(str)
      break

    default: break
  }

  str = applyGreekVariants(str)
  str = applyGammaDiphthongs(str, keyType.GREEK)

  return str
}

function fromBetaCodeToGreek (str: string): string {
  let newStr = ''

  for (let i = 0; i < str.length; i++) {
    let tmp = undefined

    for (const key of mapping) {
      if (key.latin === str[i]) {
        tmp = key.greek
      }
    }

    newStr += (tmp !== undefined) ? tmp : str[i]
  }

  return newStr
}

function fromTransliterationToGreek (str: string): string {
  let newStr = ''

  for (let i = 0; i < str.length; i++) {
    const tmp = { trans: '', greek: '' }

    let  pair = str.slice(i, i + 2)
    if (pair.length !== 2) pair = undefined

    // Facultative `h` character: ignore if its position is credible

    // A `h` but no consecutive `h`
    const rule1 = (/h/i.test(str[i]) && !/h/i.test(str[i+1]))
    // A `h` may appear behind a `r`
    const rule2 = (/[r]/i.test(str[i-1]))
    // A `h` may appear in first place (of a string or a word) when it precedes a wovel
    const rule3 = ((str[i-1] === undefined || str[i-1] === ' ') && /[aeioy]/i.test(str[i+1]))

    if (rule1 && (rule2 || rule3)) continue

    for (let j = 0; j < mapping.length; j++) {
      if (mapping[j].trans === str[i] || mapping[j].trans === pair) {
        tmp.trans = mapping[j].trans
        tmp.greek = mapping[j].greek

        // If a pair has been found, increase the index (because
        // two letters have been processed) and stop the search.
        if (mapping[j].trans === pair) i++; break
      }
    }

    newStr += tmp.greek || str[i]
  }

  return newStr
}
