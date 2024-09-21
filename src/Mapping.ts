import { Chars, KeyType } from './enums';
import { IConversionOptions, ITransliterationStyle } from './interfaces';

type MappingSource = {
  [key in Char]: string;
};

type Char = keyof typeof Chars;

const betaCode = (): MappingSource => ({
  LETTER_ALPHA: 'A',
  LETTER_BETA: 'B',
  LETTER_GAMMA: 'G',
  LETTER_DELTA: 'D',
  LETTER_EPSILON: 'E',
  LETTER_ZETA: 'Z',
  LETTER_ETA: 'H',
  LETTER_THETA: 'Q',
  LETTER_IOTA: 'I',
  LETTER_KAPPA: 'K',
  LETTER_LAMBDA: 'L',
  LETTER_MU: 'M',
  LETTER_NU: 'N',
  LETTER_XI: 'C',
  LETTER_OMICRON: 'O',
  LETTER_PI: 'P',
  LETTER_RHO: 'R',
  LETTER_LUNATE_SIGMA: '',
  LETTER_SIGMA: 'S',
  LETTER_TAU: 'T',
  LETTER_UPSILON: 'U',
  LETTER_PHI: 'F',
  LETTER_CHI: 'X',
  LETTER_PSI: 'Y',
  LETTER_OMEGA: 'W',
  LETTER_DIGAMMA: '',
  LETTER_YOT: '',
  LETTER_STIGMA: '',
  LETTER_KOPPA: '',
  LETTER_ARCHAIC_KOPPA: '',
  LETTER_SAMPI: '',
  QUESTION_MARK: ';',
  ANO_TELEIA: ':',
  SMOOTH_BREATHING: ')',
  ROUGH_BREATHING: '(',
  ACCUTE_ACCENT: '/',
  GRAVE_ACCENT: '\\',
  MACRON: '%26',
  BREVE: '%27',
  TILDE: '=',
  DIAERESIS: '+',
  IOTA_SUBSCRIPT: '|',
  DOT_BELOW: '?'
});

const greek = (): MappingSource => ({
  LETTER_ALPHA: 'Α',
  LETTER_BETA: 'Β',
  LETTER_GAMMA: 'Γ',
  LETTER_DELTA: 'Δ',
  LETTER_EPSILON: 'Ε',
  LETTER_ZETA: 'Ζ',
  LETTER_ETA: 'Η',
  LETTER_THETA: 'Θ',
  LETTER_IOTA: 'Ι',
  LETTER_KAPPA: 'Κ',
  LETTER_LAMBDA: 'Λ',
  LETTER_MU: 'Μ',
  LETTER_NU: 'Ν',
  LETTER_XI: 'Ξ',
  LETTER_OMICRON: 'Ο',
  LETTER_PI: 'Π',
  LETTER_RHO: 'Ρ',
  LETTER_LUNATE_SIGMA: '',
  LETTER_SIGMA: 'Σ',
  LETTER_TAU: 'Τ',
  LETTER_UPSILON: 'Υ',
  LETTER_PHI: 'Φ',
  LETTER_CHI: 'Χ',
  LETTER_PSI: 'Ψ',
  LETTER_OMEGA: 'Ω',
  LETTER_DIGAMMA: '',
  LETTER_YOT: '',
  LETTER_STIGMA: '',
  LETTER_KOPPA: '',
  LETTER_ARCHAIC_KOPPA: '',
  LETTER_SAMPI: '',
  QUESTION_MARK: '\u037E',
  ANO_TELEIA: '\u0387',
  SMOOTH_BREATHING: '\u0313',
  ROUGH_BREATHING: '\u0314',
  ACCUTE_ACCENT: '\u0301',
  GRAVE_ACCENT: '\u0300',
  MACRON: '\u0304',
  BREVE: '\u0306',
  // @fixme: check if the following normalizes to '\u0303' (Combining Tilde).
  // In this case, don't use the perispomeni (but enforce it when finalizing the NFC string).
  TILDE: '\u0342', // Combining Greek Perispomeni
  DIAERESIS: '\u0308',
  IOTA_SUBSCRIPT: '\u0345',
  DOT_BELOW: '\u0323'
});

const transliteration = (): MappingSource => ({
  LETTER_ALPHA: 'A',
  LETTER_BETA: 'B',
  LETTER_GAMMA: 'G',
  LETTER_DELTA: 'D',
  LETTER_EPSILON: 'E',
  LETTER_ZETA: 'Z',
  LETTER_ETA: 'Ē',
  LETTER_THETA: 'Th',
  LETTER_IOTA: 'I',
  LETTER_KAPPA: 'K',
  LETTER_LAMBDA: 'L',
  LETTER_MU: 'M',
  LETTER_NU: 'N',
  LETTER_XI: 'X',
  LETTER_OMICRON: 'O',
  LETTER_PI: 'P',
  LETTER_RHO: 'R',
  LETTER_LUNATE_SIGMA: '',
  LETTER_SIGMA: 'S',
  LETTER_TAU: 'T',
  LETTER_UPSILON: 'U',
  LETTER_PHI: 'Ph',
  LETTER_CHI: 'Ch',
  LETTER_PSI: 'Ps',
  LETTER_OMEGA: 'Ō',
  LETTER_DIGAMMA: '',
  LETTER_YOT: '',
  LETTER_STIGMA: '',
  LETTER_KOPPA: '',
  LETTER_ARCHAIC_KOPPA: '',
  LETTER_SAMPI: '',
  QUESTION_MARK: '?',
  ANO_TELEIA: ';',
  SMOOTH_BREATHING: '',
  ROUGH_BREATHING: '+h', // @todo: determine how to use it.
  ACCUTE_ACCENT: '\u0301',
  GRAVE_ACCENT: '\u0300',
  MACRON: '\u0304',
  BREVE: '\u0306',
  TILDE: '\u0303', // Combining Tilde
  DIAERESIS: '\u0308',
  IOTA_SUBSCRIPT: '\u0327', // Cedilla
  DOT_BELOW: '\u0323'
});

type CharIndex = {
  [key in string]: number[];
};

export class Mapping {
  readonly #fromType: KeyType;
  readonly #toType: KeyType;

  #mappedChars: { [key in string /*Char*/]: [string, string] };
  #removeDiacritics: boolean = false;
  #transliterationStyle: ITransliterationStyle = {};

  constructor(
    fromType: KeyType,
    toType: KeyType,
    options?: IConversionOptions
  ) {
    this.#fromType = fromType;
    this.#toType = toType;

    this.#removeDiacritics = !!options?.removeDiacritics;
    this.#transliterationStyle = options?.transliterationStyle ?? {};

    const pickMappingSource = (type: KeyType): MappingSource => {
      switch (type) {
        case KeyType.BETA_CODE:
          return betaCode();
        case KeyType.TRANSLITERATION:
          return transliteration();
        case KeyType.GREEK:
          return greek();
      }
    };

    const rValues = Object.values(pickMappingSource(this.#toType));

    this.#mappedChars = Object.fromEntries(
      Object.entries(pickMappingSource(this.#fromType)).map<
        [string, [string, string]]
      >((v, i) => [v[0], [v[1], rValues[i]]])
    );

    for (const key of Object.keys(this.#mappedChars)) {
      if (!key.startsWith('LETTER')) continue;

      this.#mappedChars[`SMALL_${key}`] = [
        this.#mappedChars[key][0].toLowerCase(),
        this.#mappedChars[key][1].toLowerCase()
      ];
    }
  }

  /**
   * Returns an object whose keys are the distinct chars of the given string
   * and whose values are arrays of indices corresponding to the key.
   * e.g. for 'pape' returns { a: [1], e: [3], p: [0, 2]}.
   */
  static getCharIndex(str: string, length: number): CharIndex {
    const index: CharIndex = {};

    for (let i = 0; i < length; i++) {
      index[str[i]] ? index[str[i]].push(i) : (index[str[i]] = [i]);
    }

    return index;
  }

  /**
   * Returns a converted string.
   */
  apply(str: string): string {
    str = str.normalize('NFD');
    const strLength = str.length;
    const conversionArr: string[] = Array(strLength);
    const charIndex = Mapping.getCharIndex(str, strLength);

    for (const [key, indices] of Object.entries(charIndex)) {
      const char: string = Object.keys(this.#mappedChars).find(
        (currentKey) => this.#mappedChars[currentKey][0] === key
      );

      for (let i = 0; i < indices.length; i++) {
        conversionArr[indices[i]] = this.#mappedChars[char][1];
      }
    }

    return conversionArr.join('').normalize('NFC');
  }
}
