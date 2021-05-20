import { keyType } from './enums'

import {
  ACCUTE_ACCENT,
  CIRCUMFLEX_ACCENT,
  DIAERESIS,
  GRAVE_ACCENT,
  IOTA_SUBSCRIPT,
  GREEK_TILDE,
  LATIN_TILDE,
  ROUGH_BREATHING,
  SMOOTH_BREATHING,
  diacriticsMapping,
  greekMapping
} from './mapping'

import {
  applyGammaDiphthongs,
  applyGreekVariants,
  applyUppercaseChars,
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace
} from './utils'

export function toGreek (
  str: string,
  from: keyType,
  options: ConversionOptions = {}
): string {
  switch (from) {
    case keyType.BETA_CODE:
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.BETA_CODE)
      str = fromBetaCodeToGreek(str, options.removeDiacritics)
      break

    case keyType.TRANSLITERATION:
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.TRANSLITERATION)

      str = fromTransliterationToGreek(str)
      str = applyUppercaseChars(str)

      if (options.removeDiacritics) str = str.replace(/h/gi, '')
      else str = applyBreathings(str)

      str = normalizeGreek(str)
      break
  }

  str = applyGreekVariants(str)
  str = applyGammaDiphthongs(str, keyType.GREEK)

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str)

  return str
}

function applyBreathings (str: string): string {
  str = str.normalize('NFD')

  const breathings = SMOOTH_BREATHING + ROUGH_BREATHING
  const accents = ACCUTE_ACCENT + GRAVE_ACCENT + LATIN_TILDE
  const vowels = 'αεηιοωυ' + accents + IOTA_SUBSCRIPT

  const pattern = new RegExp(`(^|\\s)(h)?([${vowels}]+)(${DIAERESIS})?`, 'gi')

  // Apply breathings on vowels.
  str = str.replace(pattern, (match, start, roughBreathing, group, diaeresis) => {
    const breathing = (roughBreathing) ? ROUGH_BREATHING : SMOOTH_BREATHING

    if (diaeresis) {
      match = match.normalize('NFC')

      const lastChar = (match.length - 1)
      const vowelsGroup = match.slice(0, lastChar).normalize('NFD')
      const vowelWithDiaeresis = match.slice(lastChar).normalize('NFD')

      return start + vowelsGroup + breathing + vowelWithDiaeresis
    }

    return start + group + breathing
  })

  // Apply rough breathings on `rho`.
  str = str.replace(/(ρ)h/gi, `$1${ROUGH_BREATHING}`)

  // Reorder diacritics.
  str = str.replace(
    new RegExp(`([${accents + IOTA_SUBSCRIPT}])([${breathings}])`, 'g'),
    '$2$1'
  )

  return str.normalize('NFC')
}

function fromBetaCodeToGreek (
  betaCodeStr: string,
  removeDiacritics: boolean
): string {
  let greekStr = ''

  const mapping = (!removeDiacritics)
    ? [...greekMapping, ...diacriticsMapping]
    : greekMapping

  for (const char of betaCodeStr) {
    let tmp: string

    for (const key of mapping) {
      if (key.latin === char) {
        tmp = key.greek
        break
      }
    }

    greekStr += tmp ?? char
  }

  if (!removeDiacritics) greekStr = greekStr.normalize('NFC')

  return greekStr
}

function fromTransliterationToGreek (transliteratedStr: string): string {
  let greekStr = ''

  for (let i = 0; i < transliteratedStr.length; i++) {
    const tmp = { trans: '', greek: '' }

    let pair = transliteratedStr.slice(i, (i + 2))
    if (pair.length !== 2) pair = ''

    // `Combining Tilde` (\u0303) diacritic is latin-only and must be converted
    // to the latin diacritical mark `Combining Greek Perispomeni` (\u0342).
    let decomposedChar = transliteratedStr[i]
      .normalize('NFD')
      .replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE)

    // Isolate the character with its potential circumflex (as this diacritical
    // mark is used to represent long vowels in transliterated form).
    let recomposedChar = recomposeChar(decomposedChar)

    decomposedChar = decomposedChar.replace(new RegExp(CIRCUMFLEX_ACCENT, 'g'), '')

    for (const key of greekMapping) {
      if ([recomposedChar, pair].includes(key.trans)) {
        tmp.trans = key.trans
        // Char + potential remaining diacritics.
        tmp.greek = key.greek + decomposedChar.slice(1)

        // If a pair has been found, increase the index (because
        // two letters have been processed) and stop the search.
        if (key.trans === pair) {
          i++; break
        }
      }
    }

    greekStr += tmp.greek.normalize('NFC') || transliteratedStr[i]
  }

  return greekStr
}

function recomposeChar (decomposedChar: string): string {
  let recomposedChar = decomposedChar.charAt(0)

  if (decomposedChar.includes(CIRCUMFLEX_ACCENT)) {
    recomposedChar += CIRCUMFLEX_ACCENT
  }

  return recomposedChar.normalize('NFC')
}
