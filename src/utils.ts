import { keyType } from './enums'
import { mapping } from './mapping'

export function applyTransliteratedBreathings (str: string, from: keyType): string {
  switch (from) {
    case keyType.BETA_CODE: break

    case keyType.GREEK:
      str = str.normalize('NFD')

      // Remove smooth breathings.
      str = str.replace(/\u0313/g, '')

      // Transliterate rough breathings with an `h`.
      str = str.replace(/([α-ω]+)\u0314/gi, (match, group) => {
        if (match.toLowerCase() === 'ῥ') {
          return group + 'h'
        } else {
          if (group === group.toLowerCase()) return 'h' + group
          else return 'H' + group.toLowerCase()
        }
      })

      str = str.normalize('NFC')
      break

    default: break
  }

  return str
}

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

    default: break
  }

  return str
}

export function applyGreekVariants (str: string): string {
  str = str.replace(/β/g, 'ϐ')
  str = str.replace(/ς/g, 'σ')

  str = str.replace(/ΠΣ/g, 'Ψ').replace(/Πσ/g, 'Ψ').replace(/πσ/g, 'ψ')

  const words = toWords(str)

  words.forEach((el, i) => {
    const lastSigmaIndex: number = el.lastIndexOf('σ')

    const lastSigmaSlice: string = (lastSigmaIndex)
      ? removeDiacritics(el.slice(lastSigmaIndex))
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

export function isMappedKey (key: string, type: keyType): boolean {
  const keys = []

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

      default: break
    }
  }

  return keys.includes(key)
}

export function normalizeGreek (str: string): string {
  // Normalize `middle dot` (\u00B7) to `greek ano teleia` (\u0387).
  str = str.replace(/\u00B7/g, '\u0387')

  return str
}

export function removeDiacritics (str: string): string {
  str = str.normalize('NFD')

  // Keep the circumflex (\u0302) that is used for transliteration.
  str = str.replace(/[\u0300-\u0301]|[\u0303-\u036f]/g, '')

  return str.normalize('NFC')
}

export function removeGreekVariants (str: string): string {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === 'ϐ')
      str = str.slice(0, i) + 'β' + str.slice(i + 1)
    else if (str[i] === 'ς')
      str = str.slice(0, i) + 'σ' + str.slice(i + 1)
  }

  return str
}

function toWords (str: string): string[] {
  const separator = ' '
  const re = new RegExp(separator, 'g')

  return str.split(re)
}
