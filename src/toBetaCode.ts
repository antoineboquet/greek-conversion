import { keyType } from './enums'
import { diacriticsMapping, greekMapping } from './mapping'
import { removeDiacritics, removeGreekVariants } from './utils'

export function toBetaCode (
  str: string,
  from: keyType,
  options: ConversionOptions = {}
): string {
  if (options.removeDiacritics) str = removeDiacritics(str)

  switch (from) {
    case keyType.GREEK:
      str = removeGreekVariants(str)
      str = fromGreekToBetaCode(str, options.removeDiacritics)
      break

    case keyType.TRANSLITERATION:
      str = fromTransliterationToBetaCode(str)
      break
  }

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

        if (key.trans === pair) i++; break
      }
    }

    // Remove base character + the eventual recomposed circumflex (u0302).
    const decomposedDiacritics = decomposedChar.slice(1).replace(/\u0302/g, '')

    tmp.latin += convertTransliteratedDiacritics(decomposedDiacritics)

    betaCodeStr += tmp.latin || (
      !/h/i.test(transliteratedStr[i]) // rough breathings aren't converted yet.
        ? transliteratedStr[i]
        : ''
      )
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
