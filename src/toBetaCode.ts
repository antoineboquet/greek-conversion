import { keyType } from './enums'
import { diacriticsMapping, greekMapping } from './mapping'
import {
  applyUppercaseChars,
  removeDiacritics,
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

      if (options.removeDiacritics) str = str.replace(/(^|\s)h/gi, '$1')
      else str = applyBreathings(str)
      break
  }

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str)

  return str
}

/**
 * @FIXME Could be merged with `src/toGreek.ts` homonym function.
*/
function applyBreathings (str: string): string {
  str = str.normalize('NFD')

  const pattern = new RegExp(
    // (start or space) (rough breathing?) (accented vowels) (diaeresis?)
    /(^|\s)(h)?([aehiowu\u0301\u0300\u0303\u0345]+)(\u0308)?/, 'gi'
  )

  // Apply breathings on vowels.
  str = str.replace(pattern, (match, start, roughBreathing, group, diaeresis) => {
    // Smooth breathing `(` or rough breathing `)`.
    const breathing = (roughBreathing) ? '(' : ')'

    if (diaeresis) {
      match = match.normalize('NFC')

      const vowelsGroup = match.slice(0, match.length - 1).normalize('NFD')
      const vowelWithDiaeresis = match.slice(match.length - 1).normalize('NFD')

      return start + vowelsGroup + breathing + vowelWithDiaeresis
    }

    return start + group + breathing
  })

  // Apply rough breathings on `rho`.
  str = str.replace(/(r)h/gi, '$1(')

  // Reorder diacritics.
  str = str.replace(/([\u0301\u0300\u0303\u0345])([\u0313\u0314])/g, '$2$1')

  return str.normalize('NFC')
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

  // Ensure the order (grave/accute/tilde then diaeresis & iota subscript).
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
    let recomposedChar = recomposeChar(decomposedChar)

    for (const key of greekMapping) {
      if ([recomposedChar, pair].includes(key.trans)) {
        tmp.trans = key.trans
        tmp.latin = key.latin

        if (key.trans === pair) {
          i++; break
        }
      }
    }

    // Remove base character + the eventual recomposed circumflex (u0302).
    const decomposedDiacritics = decomposedChar.slice(1).replace(/\u0302/g, '')

    tmp.latin += convertTransliteratedDiacritics(decomposedDiacritics)

    betaCodeStr += tmp.latin || transliteratedStr[i]
  }

  return betaCodeStr
}

function recomposeChar (decomposedChar: string): string {
  let recomposedChar = decomposedChar.charAt(0)

  // \u0302 = circumflex (`Combining Circumflex Accent`).
  if (decomposedChar.includes('\u0302')) {
    recomposedChar += '\u0302'
  }

  return recomposedChar.normalize('NFC')
}
