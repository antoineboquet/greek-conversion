export const SMOOTH_BREATHING = '\u0313'
export const ROUGH_BREATHING  = '\u0314'
export const ACUTE_ACCENT     = '\u0301' // `Combining Acute Accent`
export const GRAVE_ACCENT     = '\u0300'
export const GREEK_TILDE      = '\u0342' // `Combining Greek Perispomeni`
export const LATIN_TILDE      = '\u0303' // `Combining Tilde`
export const DIAERESIS        = '\u0308'
export const IOTA_SUBSCRIPT   = '\u0345'
export const CIRCUMFLEX       = '\u0302'
export const ANO_TELEIA       = '\u0387'

export const BREATHINGS = ROUGH_BREATHING + SMOOTH_BREATHING
export const ACCENTS    = ACUTE_ACCENT + GRAVE_ACCENT + GREEK_TILDE + LATIN_TILDE

export const greekMapping = [
  {
    // Alpha
    greek: 'Α',
    latin: 'A',
    trans: 'A'
  },
  {
    // Beta
    greek: 'Β',
    latin: 'B',
    trans: 'B'
  },
  {
    // Gamma
    greek: 'Γ',
    latin: 'G',
    trans: 'G'
  },
  {
    // Delta
    greek: 'Δ',
    latin: 'D',
    trans: 'D'
  },
  {
    // Epsilon
    greek: 'Ε',
    latin: 'E',
    trans: 'E'
  },
  {
    // Zeta
    greek: 'Ζ',
    latin: 'Z',
    trans: 'Z'
  },
  {
    // Eta
    greek: 'Η',
    latin: 'H',
    trans: 'Ê'
  },
  {
    // Theta
    greek: 'Θ',
    latin: 'Q',
    trans: 'Th'
  },
  {
    // Iota
    greek: 'Ι',
    latin: 'I',
    trans: 'I'
  },
  {
    // Kappa
    greek: 'Κ',
    latin: 'K',
    trans: 'K'
  },
  {
    // Lambda
    greek: 'Λ',
    latin: 'L',
    trans: 'L'
  },
  {
    // Mu
    greek: 'Μ',
    latin: 'M',
    trans: 'M'
  },
  {
    // Nu
    greek: 'Ν',
    latin: 'N',
    trans: 'N'
  },
  {
    // Xi
    greek: 'Ξ',
    latin: 'C',
    trans: 'X'
  },
  {
    // Omicron
    greek: 'Ο',
    latin: 'O',
    trans: 'O'
  },
  {
    // Pi
    greek: 'Π',
    latin: 'P',
    trans: 'P'
  },
  {
    // Rho
    greek: 'Ρ',
    latin: 'R',
    trans: 'R'
  },
  {
    // Sigma
    greek: 'Σ',
    latin: 'S',
    trans: 'S'
  },
  {
    // Tau
    greek: 'Τ',
    latin: 'T',
    trans: 'T'
  },
  {
    // Upsilon
    greek: 'Υ',
    latin: 'U',
    trans: 'U'
  },
  {
    // Phi
    greek: 'Φ',
    latin: 'F',
    trans: 'Ph'
  },
  {
    // Chi
    greek: 'Χ',
    latin: 'X',
    trans: 'Ch'
  },
  {
    // Psi
    greek: 'Ψ',
    latin: 'Y',
    trans: 'Ps'
  },
  {
    // Omega
    greek: 'Ω',
    latin: 'W',
    trans: 'Ô'
  },
  {
    // Digamma
    greek: 'Ϝ',
    latin: 'V',
    trans: 'W'
  },
  {
    // alpha
    greek: 'α',
    latin: 'a',
    trans: 'a'
  },
  {
    // beta
    greek: 'β',
    latin: 'b',
    trans: 'b'
  },
  {
    // gamma
    greek: 'γ',
    latin: 'g',
    trans: 'g'
  },
  {
    // delta
    greek: 'δ',
    latin: 'd',
    trans: 'd'
  },
  {
    // epsilon
    greek: 'ε',
    latin: 'e',
    trans: 'e'
  },
  {
    // zeta
    greek: 'ζ',
    latin: 'z',
    trans: 'z'
  },
  {
    // eta
    greek: 'η',
    latin: 'h',
    trans: 'ê'
  },
  {
    // theta
    greek: 'θ',
    latin: 'q',
    trans: 'th'
  },
  {
    // iota
    greek: 'ι',
    latin: 'i',
    trans: 'i'
  },
  {
    // kappa
    greek: 'κ',
    latin: 'k',
    trans: 'k'
  },
  {
    // lambda
    greek: 'λ',
    latin: 'l',
    trans: 'l'
  },
  {
    // mu
    greek: 'μ',
    latin: 'm',
    trans: 'm'
  },
  {
    // nu
    greek: 'ν',
    latin: 'n',
    trans: 'n'
  },
  {
    // xi
    greek: 'ξ',
    latin: 'c',
    trans: 'x'
  },
  {
    // omicron
    greek: 'ο',
    latin: 'o',
    trans: 'o'
  },
  {
    // pi
    greek: 'π',
    latin: 'p',
    trans: 'p'
  },
  {
    // rho
    greek: 'ρ',
    latin: 'r',
    trans: 'r'
  },
  {
    // sigma
    greek: 'σ',
    latin: 's',
    trans: 's'
  },
  {
    // tau
    greek: 'τ',
    latin: 't',
    trans: 't'
  },
  {
    // upsilon
    greek: 'υ',
    latin: 'u',
    trans: 'u'
  },
  {
    // phi
    greek: 'φ',
    latin: 'f',
    trans: 'ph'
  },
  {
    // chi
    greek: 'χ',
    latin: 'x',
    trans: 'ch'
  },
  {
    // psi
    greek: 'ψ',
    latin: 'y',
    trans: 'ps'
  },
  {
    // omega
    greek: 'ω',
    latin: 'w',
    trans: 'ô'
  },
  {
    // digamma
    greek: 'ϝ',
    latin: 'v',
    trans: 'w'
  },
  {
    // Interrogation
    greek: ';',
    latin: '?',
    trans: '?'
  },
  {
    // Ano teleia (`·`)
    greek: ANO_TELEIA,
    latin: ';',
    trans: ';'
  }
]

export const diacriticsMapping = [
  {
    // Smooth breathing
    greek: SMOOTH_BREATHING,
    latin: ')',
    trans: ''
  },
  {
    // Rough breathing
    greek: ROUGH_BREATHING,
    latin: '(',
    trans: ''
  },
  {
    // Accute accent
    greek: ACUTE_ACCENT,
    latin: '/',
    trans: ACUTE_ACCENT
  },
  {
    // Grave accent
    greek: GRAVE_ACCENT,
    latin: '\\',
    trans: GRAVE_ACCENT
  },
  {
    // Tilde
    greek: GREEK_TILDE,
    latin: '=',
    trans: LATIN_TILDE
  },
  {
    // Diaeresis
    greek: DIAERESIS,
    latin: '+',
    trans: DIAERESIS
  },
  {
    // Iota subscript
    greek: IOTA_SUBSCRIPT,
    latin: '|',
    trans: IOTA_SUBSCRIPT
  }
]
