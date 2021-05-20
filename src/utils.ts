import { keyType } from './enums'
import { diacriticsMapping, greekMapping } from './mapping'

export function applyGammaDiphthongs (str: string, type: keyType): string {
  switch (type) {
    case keyType.GREEK:
      str = str.replace(/ΝΓ/g, 'ΓΓ') // Upper
               .replace(/ΝΞ/g, 'ΓΞ')
               .replace(/ΝΚ/g, 'ΓΚ')
               .replace(/ΝΧ/g, 'ΓΧ')
               .replace(/Νγ/g, 'Γγ') // Upper + lower
               .replace(/Νξ/g, 'Γξ')
               .replace(/Νκ/g, 'Γκ')
               .replace(/Νχ/g, 'Γχ')
               .replace(/νγ/g, 'γγ') // Lower
               .replace(/νξ/g, 'γξ')
               .replace(/νκ/g, 'γκ')
               .replace(/νχ/g, 'γχ')
      break

    case keyType.TRANSLITERATION:
      str = str.replace(/GG/g,  'NG' ) // Upper
               .replace(/GX/g,  'NX' )
               .replace(/GK/g,  'NK' )
               .replace(/GCH/g, 'NCH')
               .replace(/Gg/g,  'Ng' ) // Upper + lower
               .replace(/Gx/g,  'Nx' )
               .replace(/Gk/g,  'Nk' )
               .replace(/Gch/g, 'Nch')
               .replace(/gg/g,  'ng' ) // Lower
               .replace(/gx/g,  'nx' )
               .replace(/gk/g,  'nk' )
               .replace(/gch/g, 'nch')
      break
  }

  return str
}

export function applyGreekVariants (str: string): string {
  str = str.replace(/β/g, 'ϐ')
  str = str.replace(/ς/g, 'σ')

  str = str.replace(/ΠΣ/g, 'Ψ').replace(/Πσ/g, 'Ψ').replace(/πσ/g, 'ψ')

  const words = str.split(' ')

  words.forEach((el, i) => {
    const lastSigmaIndex: number = el.lastIndexOf('σ')

    const lastSigmaSlice: string = (lastSigmaIndex)
      ? removeDiacritics(el.slice(lastSigmaIndex), keyType.GREEK)
      : undefined

    if (el.charAt(0) === 'ϐ') {
      words[i] = 'β' + el.slice(1)
    }

    if (el.length > 1 && /σ(?![α-ω])/.test(lastSigmaSlice)) {
      words[i] = el.slice(0, lastSigmaIndex) + 'ς' + el.slice((lastSigmaIndex + 1))
    }
  })

  return words.join(' ')
}

export function applyUppercaseChars (str: string): string {
  const words = str.split(' ')

  words.forEach((el, i) => {
    if (el.charAt(0) === 'H') {
      words[i] = el.charAt(0) + el.charAt(1).toUpperCase() + el.slice(2)
    }
  })

  return words.join(' ')
}

export function isMappedKey (key: string, type: keyType): boolean {
  const keys = []

  const mapping = [
    ...greekMapping,
    ...diacriticsMapping
  ]

  for (const el of mapping) {
    switch (type) {
      case keyType.GREEK:
        keys.push(el.greek)
        break

      case keyType.BETA_CODE:
        keys.push(el.latin)
        break

      case keyType.TRANSLITERATION:
        keys.push(el.trans)
        break
    }
  }

  return keys.includes(key)
}

export function normalizeGreek (str: string): string {
  // Normalize `middle dot` (\u00B7) to `greek ano teleia` (\u0387).
  return str.replace(/\u00B7/g, '\u0387')
}

export function removeDiacritics (str: string, type: keyType): string {
  str = str.normalize('NFD')

  switch (type) {
    case keyType.BETA_CODE:
      // Delete the following characters: `( ) \ / + = |`.
      str = str.replace(/[\(\)\\\/\+=\|]/g, '')
      break

    case keyType.GREEK:
      str = str.replace(/[\u0300-\u036f]/g, '')
      break

    case keyType.TRANSLITERATION:
      // Keep the circumflex (\u0302) that is used for transliteration.
      str = str.replace(/[\u0300-\u0301]|[\u0303-\u036f]/g, '')
      break
  }

  return str.normalize('NFC')
}

export function removeGreekVariants (str: string): string {
  return str.replace(/ϐ/g, 'β').replace(/ς/g, 'σ')
}

export function removeExtraWhitespace (str: string): string {
  return str.replace(/(\s)+/g, '$1').trim()
}
