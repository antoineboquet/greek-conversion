import { Chars, KeyType } from './enums';
import { IConversionOptions, ITransliterationStyle } from './interfaces';

type MappingSource = {
  [key in Char]: string;
};

type Char = keyof typeof Chars;

// prettier-ignore
export const PRECOMPOSED_CHARS_WITH_TONOS_OXIA: Array<[string, string]> = [
  ['ά', 'ά'], ['έ', 'έ'], ['ή', 'ή'], ['ί', 'ί'],
  ['ό', 'ό'], ['ύ', 'ύ'], ['ώ', 'ώ'], ['Ά', 'Ά'],
  ['Έ', 'Έ'], ['Ή', 'Ή'], ['Ί', 'Ί'], ['Ό', 'Ό'],
  ['Ύ', 'Ύ'], ['Ώ', 'Ώ'], ['ΐ', 'ΐ'], ['ΰ', 'ΰ']
];

export const GRAVE_ACCENT = '\u0300';
export const ACUTE_ACCENT = '\u0301';
export const CIRCUMFLEX = '\u0302';
export const LATIN_TILDE = '\u0303'; // `Combining Tilde`
export const GREEK_TILDE = '\u0342'; // `Combining Greek Perispomeni`
export const MACRON = '\u0304';
export const BREVE = '\u0306';
export const DIAERESIS = '\u0308';
export const SMOOTH_BREATHING = '\u0313';
export const ROUGH_BREATHING = '\u0314';
export const DOT_BELOW = '\u0323';
export const CEDILLA = '\u0327';
export const IOTA_SUBSCRIPT = '\u0345';
export const ANO_TELEIA = '\u0387';
export const MIDDLE_DOT = '\u00B7';
export const RIGHT_SINGLE_QUOTATION_MARK = '\u2019';
export const GREEK_QUESTION_MARK = '\u037E';
export const GREEK_BETA_SYMBOL = '\u03D0';
export const CAPITAL_LUNATE_SIGMA = '\u03F9';
export const SMALL_LUNATE_SIGMA = '\u03F2';

const betaCode = (): MappingSource => ({
  LETTER_ALPHA: 'A',
  LETTER_BETA: 'B',
  LETTER_GAMMA: 'G',
  LETTER_DELTA: 'D',
  LETTER_EPSILON: 'E',
  LETTER_ZETA: 'Z',
  LETTER_ETA: 'H',
  LETTER_THETA: 'Q',
  LETTER_THETA_MIXED: 'Q',
  LETTER_IOTA: 'I',
  LETTER_KAPPA: 'K',
  LETTER_LAMBDA: 'L',
  LETTER_MU: 'M',
  LETTER_NU: 'N',
  LETTER_XI: 'C',
  LETTER_XI_MIXED: 'C',
  LETTER_OMICRON: 'O',
  LETTER_PI: 'P',
  LETTER_RHO: 'R',
  LETTER_LUNATE_SIGMA: 'S3',
  LETTER_SIGMA: 'S',
  LETTER_TAU: 'T',
  LETTER_UPSILON: 'U',
  LETTER_PHI: 'F',
  LETTER_PHI_MIXED: 'F',
  LETTER_CHI: 'X',
  LETTER_CHI_MIXED: 'X',
  LETTER_PSI: 'Y',
  LETTER_PSI_MIXED: 'Y',
  LETTER_OMEGA: 'W',
  LETTER_DIGAMMA: 'V',
  LETTER_YOT: 'J',
  LETTER_STIGMA: '*#2',
  LETTER_KOPPA: '*#1',
  LETTER_ARCHAIC_KOPPA: '*#3',
  LETTER_SAMPI: '*#5',
  //LETTER_SAN: '*#711',
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
  LETTER_THETA_MIXED: 'Θ',
  LETTER_IOTA: 'Ι',
  LETTER_KAPPA: 'Κ',
  LETTER_LAMBDA: 'Λ',
  LETTER_MU: 'Μ',
  LETTER_NU: 'Ν',
  LETTER_XI: 'Ξ',
  LETTER_XI_MIXED: 'Ξ',
  LETTER_OMICRON: 'Ο',
  LETTER_PI: 'Π',
  LETTER_RHO: 'Ρ',
  LETTER_LUNATE_SIGMA: CAPITAL_LUNATE_SIGMA,
  LETTER_SIGMA: 'Σ',
  LETTER_TAU: 'Τ',
  LETTER_UPSILON: 'Υ',
  LETTER_PHI: 'Φ',
  LETTER_PHI_MIXED: 'Φ',
  LETTER_CHI: 'Χ',
  LETTER_CHI_MIXED: 'Χ',
  LETTER_PSI: 'Ψ',
  LETTER_PSI_MIXED: 'Ψ',
  LETTER_OMEGA: 'Ω',
  LETTER_DIGAMMA: 'Ϝ',
  LETTER_YOT: '\u037F',
  LETTER_STIGMA: '\u03DA',
  LETTER_KOPPA: 'Ϟ',
  LETTER_ARCHAIC_KOPPA: 'Ϙ',
  LETTER_SAMPI: 'Ϡ',
  //LETTER_SAN: '\u03FA',
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
  LETTER_THETA: 'TH',
  LETTER_THETA_MIXED: 'Th',
  LETTER_IOTA: 'I',
  LETTER_KAPPA: 'K',
  LETTER_LAMBDA: 'L',
  LETTER_MU: 'M',
  LETTER_NU: 'N',
  LETTER_XI: 'X', // `xi_ks` -> 'KS'
  LETTER_XI_MIXED: 'X', // `xi_ks` -> 'Ks'
  LETTER_OMICRON: 'O',
  LETTER_PI: 'P',
  LETTER_RHO: 'R',
  LETTER_LUNATE_SIGMA: 'C', // defined by: BNF
  LETTER_SIGMA: 'S',
  LETTER_TAU: 'T',
  LETTER_UPSILON: 'U',
  LETTER_PHI: 'PH',
  LETTER_PHI_MIXED: 'Ph',
  LETTER_CHI: 'CH',
  LETTER_CHI_MIXED: 'Ch',
  LETTER_PSI: 'PS',
  LETTER_PSI_MIXED: 'Ps',
  LETTER_OMEGA: 'Ō',
  LETTER_DIGAMMA: 'W', // defined by: ALA-LC, BNF
  LETTER_YOT: 'J', // defined by: BNF
  LETTER_STIGMA: 'C̄', // defined by: BNF
  LETTER_KOPPA: 'Q', // defined by: BNF
  LETTER_ARCHAIC_KOPPA: 'Ḳ', // defined by: ALA-LC
  LETTER_SAMPI: 'S̄', // defined by: BNF
  QUESTION_MARK: '?',
  ANO_TELEIA: ';',
  SMOOTH_BREATHING: '',
  ROUGH_BREATHING: 'h', // @fixme: use a flag char? ('h' is Eta in betacode)
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

    const rValues = Object.values(Mapping.pickSource(this.#toType));

    this.#mappedChars = Object.fromEntries(
      Object.entries(Mapping.pickSource(this.#fromType)).map<
        [string, [string, string]]
      >((v, i) => [v[0], [v[1], rValues[i]]])
    );

    if ([this.#fromType, this.#toType].includes(KeyType.TRANSLITERATION)) {
      this.alterTransliteration();
    }

    for (const key of Object.keys(this.#mappedChars)) {
      if (!key.startsWith('LETTER') || key.endsWith('MIXED')) continue;

      this.#mappedChars[`SMALL_${key}`] = [
        this.#mappedChars[key][0].toLowerCase(),
        this.#mappedChars[key][1].toLowerCase()
      ];
    }
  }

  alterTransliteration = (): void => {
    const pos = this.#toType ? 1 : 0;
    const {
      useCxOverMacron,
      beta_v,
      eta_i,
      xi_ks,
      phi_f,
      chi_kh,
      lunatesigma_s
    } = this.#transliterationStyle ?? {};

    if (beta_v) this.#mappedChars.LETTER_BETA[pos] = 'V';
    if (xi_ks) {
      this.#mappedChars.LETTER_XI[pos] = 'KS';
      this.#mappedChars.LETTER_XI_MIXED[pos] = 'Ks';
    }
    if (phi_f) {
      this.#mappedChars.LETTER_PHI[pos] = 'F';
      this.#mappedChars.LETTER_PHI_MIXED[pos] = 'F';
    }
    if (chi_kh) {
      this.#mappedChars.LETTER_CHI[pos] = 'KH';
      this.#mappedChars.LETTER_CHI_MIXED[pos] = 'Kh';
    }
    // This is enabled silently if not explicitly. See `utils/handleOptions()`.
    if (lunatesigma_s) this.#mappedChars.LETTER_LUNATE_SIGMA[pos] = 'S';

    if (useCxOverMacron) {
      if (eta_i) {
        this.#mappedChars.LETTER_ETA[pos] = 'Î';
      } else {
        this.#mappedChars.LETTER_ETA[pos] = 'Ê';
      }
      this.#mappedChars.LETTER_OMEGA[pos] = 'Ô';
      this.#mappedChars.LETTER_STIGMA[pos] = 'Ĉ';
      this.#mappedChars.LETTER_SAMPI[pos] = 'Ŝ';
    } else {
      if (eta_i) this.#mappedChars.LETTER_ETA[pos] = 'Ī';
    }
  };

  static pickSource(type: KeyType): MappingSource {
    switch (type) {
      case KeyType.BETA_CODE:
        return betaCode();
      case KeyType.TRANSLITERATION:
        return transliteration();
      case KeyType.GREEK:
        return greek();
    }
  }

  /**
   * Returns an object whose keys are the distinct chars of the given string
   * and whose values are arrays of indices corresponding to the key.
   * @remarks
   * A char can be compounded of several actual chars: for instance,
   * a transliterated theta is 'Th'; a betacode encoded macron '%26', etc.
   * @example
   * For the transliterated string 'logos', the returned chars index is
   * `{ g: [2], l: [0], o: [1, 3], s: [4]}`.
   */
  getCharsIndex(decomposedStr: string, length: number): CharIndex {
    const index: CharIndex = {};
    const nLengthChars = Object.values(this.#mappedChars)
      .reduce((acc, curr) => {
        const decomposedChar = curr[0].normalize('NFD');
        return decomposedChar.length > 1 ? [...acc, decomposedChar] : acc;
      }, [])
      .sort((a, b) => b.length - a.length);

    for (let i = 0; i < length; i++) {
      if (nLengthChars) {
        let found;
        for (let j = nLengthChars[0].length; j > 1; j--) {
          const sequence = decomposedStr[i] + decomposedStr.slice(i + 1, i + j);
          const nfcSequence = sequence.normalize('NFC');
          if (nLengthChars.includes(sequence)) {
            // Index keys are expected to be NFC chars.
            index[nfcSequence]
              ? index[nfcSequence].push(i)
              : (index[nfcSequence] = [i]);
            found = true;
            i += j - 1;
            break;
          }
        }
        if (found) continue;
      }

      index[decomposedStr[i]]
        ? index[decomposedStr[i]].push(i)
        : (index[decomposedStr[i]] = [i]);
    }

    return index;
  }

  /**
   * Returns a converted string.
   */
  apply(str: string): string {
    const decomposedStr = str.normalize('NFD');
    const strLength = decomposedStr.length;
    const conversionArr: string[] = Array(strLength);
    const charsIndex = this.getCharsIndex(decomposedStr, strLength);

    for (const [key, indices] of Object.entries(charsIndex)) {
      const mappedCHar: string = Object.keys(this.#mappedChars).find(
        (currentKey) => this.#mappedChars[currentKey][0] === key
      );

      for (let i = 0; i < indices.length; i++) {
        conversionArr[indices[i]] = mappedCHar
          ? this.#mappedChars[mappedCHar][1]
          : key;
      }
    }

    return conversionArr.join('').normalize('NFC');
  }
}
