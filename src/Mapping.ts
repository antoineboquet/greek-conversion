import { AdditionalChar, KeyType } from './enums';
import {
  IInternalConversionOptions,
  IMappingProperty,
  ITransliterationStyle
} from './interfaces';
import { normalizeGreek, sanitizeRegExpString } from './utils';

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

const ADDITIONAL_CHARS_VALUES = (): {
  [k in AdditionalChar]: {
    [k in string]: IMappingProperty;
  };
} => ({
  [AdditionalChar.ALL]: {},
  [AdditionalChar.DIGAMMA]: {
    CAPITAL_DIGAMMA: {
      gr: 'Ϝ',
      bc: 'V',
      tr: 'W' // Defined by: ALA-LC, BNF
    },
    SMALL_DIGAMMA: {
      gr: 'ϝ',
      bc: 'v',
      tr: 'w' // Defined by: ALA-LC, BNF
    }
  },
  [AdditionalChar.YOT]: {
    CAPITAL_YOT: {
      gr: '\u037F',
      bc: 'J',
      tr: 'J' // Defined by: BNF
    },
    SMALL_YOT: {
      gr: '\u03F3',
      bc: 'j',
      tr: 'j' // Defined by: BNF
    }
  },
  [AdditionalChar.LUNATE_SIGMA]: {
    CAPITAL_LUNATE_SIGMA: {
      gr: CAPITAL_LUNATE_SIGMA,
      bc: 'S3',
      tr: 'C' // Defined by: BNF
    },
    SMALL_LUNATE_SIGMA: {
      gr: SMALL_LUNATE_SIGMA,
      bc: 's3',
      tr: 'c' // Defined by: BNF
    }
  },
  [AdditionalChar.STIGMA]: {
    CAPITAL_STIGMA: {
      gr: '\u03DA',
      bc: '*#2',
      tr: 'C̄' // Defined by: BNF
    },
    SMALL_STIGMA: {
      gr: '\u03DB',
      bc: '#2',
      tr: 'c̄' // Defined by: BNF
    }
  },
  [AdditionalChar.KOPPA]: {
    CAPITAL_KOPPA: {
      gr: 'Ϟ',
      bc: '*#1',
      tr: 'Q' // Defined by: BNF
    },
    SMALL_KOPPA: {
      gr: 'ϟ',
      bc: '#1',
      tr: 'q' // Defined by: BNF
    }
  },
  [AdditionalChar.ARCHAIC_KOPPA]: {
    CAPITAL_ARCHAIC_KOPPA: {
      gr: 'Ϙ',
      bc: '*#3',
      tr: 'Ḳ' // Defined by: ALA-LC
    },
    SMALL_ARCHAIC_KOPPA: {
      gr: 'ϙ',
      bc: '#3',
      tr: 'ḳ' // Defined by: ALA-LC
    }
  },
  [AdditionalChar.SAMPI]: {
    CAPITAL_SAMPI: {
      gr: 'Ϡ',
      bc: '*#5',
      tr: 'S̄' // Defined by: BNF
    },
    SMALL_SAMPI: {
      gr: 'ϡ',
      bc: '#5',
      tr: 's̄' // Defined by: BNF
    }
  }
  /*[AdditionalChar.SAN]: {
    CAPITAL_SAN: {
      gr: '\u03FA',
      bc: '*#711',
      tr: undefined
    },
    SMALL_SAN: {
      gr: 'ϻ',
      bc: '#711',
      tr: undefined
    }
  }*/
});

const CAPITAL_LETTERS = (): {
  [k in string]: IMappingProperty;
} => ({
  CAPITAL_ALPHA: {
    gr: 'Α',
    bc: 'A',
    tr: 'A'
  },
  CAPITAL_BETA: {
    gr: 'Β',
    bc: 'B',
    tr: 'B'
  },
  CAPITAL_GAMMA: {
    gr: 'Γ',
    bc: 'G',
    tr: 'G'
  },
  CAPITAL_DELTA: {
    gr: 'Δ',
    bc: 'D',
    tr: 'D'
  },
  CAPITAL_EPSILON: {
    gr: 'Ε',
    bc: 'E',
    tr: 'E'
  },
  CAPITAL_ZETA: {
    gr: 'Ζ',
    bc: 'Z',
    tr: 'Z'
  },
  CAPITAL_ETA: {
    gr: 'Η',
    bc: 'H',
    tr: 'Ē'
  },
  CAPITAL_THETA: {
    gr: 'Θ',
    bc: 'Q',
    tr: 'Th'
  },
  CAPITAL_IOTA: {
    gr: 'Ι',
    bc: 'I',
    tr: 'I'
  },
  CAPITAL_KAPPA: {
    gr: 'Κ',
    bc: 'K',
    tr: 'K'
  },
  CAPITAL_LAMBDA: {
    gr: 'Λ',
    bc: 'L',
    tr: 'L'
  },
  CAPITAL_MU: {
    gr: 'Μ',
    bc: 'M',
    tr: 'M'
  },
  CAPITAL_NU: {
    gr: 'Ν',
    bc: 'N',
    tr: 'N'
  },
  CAPITAL_XI: {
    gr: 'Ξ',
    bc: 'C',
    tr: 'X'
  },
  CAPITAL_OMICRON: {
    gr: 'Ο',
    bc: 'O',
    tr: 'O'
  },
  CAPITAL_PI: {
    gr: 'Π',
    bc: 'P',
    tr: 'P'
  },
  CAPITAL_RHO: {
    gr: 'Ρ',
    bc: 'R',
    tr: 'R'
  },
  CAPITAL_SIGMA: {
    gr: 'Σ',
    bc: 'S',
    tr: 'S'
  },
  CAPITAL_TAU: {
    gr: 'Τ',
    bc: 'T',
    tr: 'T'
  },
  CAPITAL_UPSILON: {
    gr: 'Υ',
    bc: 'U',
    tr: 'U'
  },
  CAPITAL_PHI: {
    gr: 'Φ',
    bc: 'F',
    tr: 'Ph'
  },
  CAPITAL_CHI: {
    gr: 'Χ',
    bc: 'X',
    tr: 'Ch'
  },
  CAPITAL_PSI: {
    gr: 'Ψ',
    bc: 'Y',
    tr: 'Ps'
  },
  CAPITAL_OMEGA: {
    gr: 'Ω',
    bc: 'W',
    tr: 'Ō'
  },
  CAPITAL_ALT_UPSILON: {} as IMappingProperty,
  CAPITAL_DIGAMMA: {} as IMappingProperty,
  CAPITAL_YOT: {} as IMappingProperty,
  CAPITAL_LUNATE_SIGMA: {} as IMappingProperty,
  CAPITAL_STIGMA: {} as IMappingProperty,
  CAPITAL_KOPPA: {} as IMappingProperty,
  CAPITAL_ARCHAIC_KOPPA: {} as IMappingProperty,
  CAPITAL_SAMPI: {} as IMappingProperty,
  CAPITAL_SAN: {} as IMappingProperty
});

const SMALL_LETTERS = (): {
  [k in string]: IMappingProperty;
} => ({
  SMALL_ALPHA: {
    gr: 'α',
    bc: 'a',
    tr: 'a'
  },
  SMALL_BETA: {
    gr: 'β',
    bc: 'b',
    tr: 'b'
  },
  SMALL_GAMMA: {
    gr: 'γ',
    bc: 'g',
    tr: 'g'
  },
  SMALL_DELTA: {
    gr: 'δ',
    bc: 'd',
    tr: 'd'
  },
  SMALL_EPSILON: {
    gr: 'ε',
    bc: 'e',
    tr: 'e'
  },
  SMALL_ZETA: {
    gr: 'ζ',
    bc: 'z',
    tr: 'z'
  },
  SMALL_ETA: {
    gr: 'η',
    bc: 'h',
    tr: 'ē'
  },
  SMALL_THETA: {
    gr: 'θ',
    bc: 'q',
    tr: 'th'
  },
  SMALL_IOTA: {
    gr: 'ι',
    bc: 'i',
    tr: 'i'
  },
  SMALL_KAPPA: {
    gr: 'κ',
    bc: 'k',
    tr: 'k'
  },
  SMALL_LAMBDA: {
    gr: 'λ',
    bc: 'l',
    tr: 'l'
  },
  SMALL_MU: {
    gr: 'μ',
    bc: 'm',
    tr: 'm'
  },
  SMALL_NU: {
    gr: 'ν',
    bc: 'n',
    tr: 'n'
  },
  SMALL_XI: {
    gr: 'ξ',
    bc: 'c',
    tr: 'x'
  },
  SMALL_OMICRON: {
    gr: 'ο',
    bc: 'o',
    tr: 'o'
  },
  SMALL_PI: {
    gr: 'π',
    bc: 'p',
    tr: 'p'
  },
  SMALL_RHO: {
    gr: 'ρ',
    bc: 'r',
    tr: 'r'
  },
  SMALL_SIGMA: {
    gr: 'σ',
    bc: 's',
    tr: 's'
  },
  SMALL_TAU: {
    gr: 'τ',
    bc: 't',
    tr: 't'
  },
  SMALL_UPSILON: {
    gr: 'υ',
    bc: 'u',
    tr: 'u'
  },
  SMALL_PHI: {
    gr: 'φ',
    bc: 'f',
    tr: 'ph'
  },
  SMALL_CHI: {
    gr: 'χ',
    bc: 'x',
    tr: 'ch'
  },
  SMALL_PSI: {
    gr: 'ψ',
    bc: 'y',
    tr: 'ps'
  },
  SMALL_OMEGA: {
    gr: 'ω',
    bc: 'w',
    tr: 'ō'
  },
  SMALL_ALT_UPSILON: {} as IMappingProperty,
  SMALL_DIGAMMA: {} as IMappingProperty,
  SMALL_YOT: {} as IMappingProperty,
  SMALL_LUNATE_SIGMA: {} as IMappingProperty,
  SMALL_STIGMA: {} as IMappingProperty,
  SMALL_KOPPA: {} as IMappingProperty,
  SMALL_ARCHAIC_KOPPA: {} as IMappingProperty,
  SMALL_SAMPI: {} as IMappingProperty,
  SMALL_SAN: {} as IMappingProperty
});

const PUNCTUATION = (): {
  [k in string]: IMappingProperty;
} => ({
  PUNCT_QUESTION_MARK: {
    gr: GREEK_QUESTION_MARK,
    bc: ';',
    tr: '?'
  },
  PUNCT_ANO_TELEIA: {
    gr: ANO_TELEIA,
    bc: ':',
    tr: ';'
  }
});

const DIACRITICS = (): {
  [k in string]: IMappingProperty;
} => ({
  DIA_SMOOTH_BREATHING: {
    gr: SMOOTH_BREATHING,
    bc: ')',
    tr: SMOOTH_BREATHING
  },
  DIA_ROUGH_BREATHING: {
    gr: ROUGH_BREATHING,
    bc: '(',
    tr: undefined
  },
  DIA_ACCUTE_ACCENT: {
    gr: ACUTE_ACCENT,
    bc: '/',
    tr: ACUTE_ACCENT
  },
  DIA_GRAVE_ACCENT: {
    gr: GRAVE_ACCENT,
    bc: '\\',
    tr: GRAVE_ACCENT
  },
  DIA_MACRON: {
    gr: MACRON,
    bc: '%26',
    tr: MACRON
  },
  DIA_BREVE: {
    gr: BREVE,
    bc: '%27',
    tr: BREVE
  },
  DIA_TILDE: {
    gr: GREEK_TILDE,
    bc: '=',
    tr: LATIN_TILDE
  },
  DIA_DIAERESIS: {
    gr: DIAERESIS,
    bc: '+',
    tr: DIAERESIS
  },
  DIA_IOTA_SUBSCRIPT: {
    gr: IOTA_SUBSCRIPT,
    bc: '|',
    tr: CEDILLA
  },
  DIA_DOT_BELOW: {
    gr: DOT_BELOW,
    bc: '?',
    tr: DOT_BELOW
  }
});

export class Mapping {
  #capitalLetters = CAPITAL_LETTERS();
  #smallLetters = SMALL_LETTERS();
  #punctuation = PUNCTUATION();
  #diacritics = DIACRITICS();

  #isUpperCase: boolean = false;
  #removeDiacritics: boolean = false;
  #transliterationStyle: ITransliterationStyle = {};
  #additionalChars: AdditionalChar[] | AdditionalChar = [];

  constructor(options?: IInternalConversionOptions) {
    this.#isUpperCase = Boolean(options?.isUpperCase);
    this.#removeDiacritics = Boolean(options?.removeDiacritics);
    this.#transliterationStyle = options?.transliterationStyle ?? {};
    this.#additionalChars = options?.additionalChars ?? [];

    if (this.#additionalChars) {
      for (const [k, v] of Object.entries(ADDITIONAL_CHARS_VALUES())) {
        if (
          this.#additionalChars === (AdditionalChar.ALL as number) ||
          this.#additionalChars === (Number(k) as AdditionalChar) ||
          (Array.isArray(this.#additionalChars) &&
            this.#additionalChars.includes(Number(k) as AdditionalChar))
        ) {
          const keys = Object.keys(v);
          if (keys[0]) this.#capitalLetters[keys[0]] = v[keys[0]];
          if (keys[1]) this.#smallLetters[keys[1]] = v[keys[1]];
        }
      }
    }

    const {
      useCxOverMacron,
      beta_v,
      eta_i,
      xi_ks,
      phi_f,
      chi_kh,
      upsilon_y,
      lunatesigma_s
    } = this.#transliterationStyle ?? {};

    if (beta_v) {
      this.#capitalLetters.CAPITAL_BETA.tr = 'V';
      this.#smallLetters.SMALL_BETA.tr = 'v';
    }

    if (eta_i) {
      this.#capitalLetters.CAPITAL_ETA.tr = 'Ī';
      this.#smallLetters.SMALL_ETA.tr = 'ī';
    }

    if (xi_ks) {
      this.#capitalLetters.CAPITAL_XI.tr = 'Ks';
      this.#smallLetters.SMALL_XI.tr = 'ks';
    }

    if (phi_f) {
      this.#capitalLetters.CAPITAL_PHI.tr = 'F';
      this.#smallLetters.SMALL_PHI.tr = 'f';
    }

    if (chi_kh) {
      this.#capitalLetters.CAPITAL_CHI.tr = 'Kh';
      this.#smallLetters.SMALL_CHI.tr = 'kh';
    }

    if (upsilon_y) {
      this.#capitalLetters.CAPITAL_UPSILON.tr = 'Y';
      this.#smallLetters.SMALL_UPSILON.tr = 'y';
    }

    if (lunatesigma_s) {
      // The lunate sigma might not have been activated using the
      // `additionalChars` option. So, we need to check if its property exists.
      if (this.#capitalLetters.CAPITAL_LUNATE_SIGMA?.tr)
        this.#capitalLetters.CAPITAL_LUNATE_SIGMA.tr = 'S';
      if (this.#smallLetters.SMALL_LUNATE_SIGMA?.tr)
        this.#smallLetters.SMALL_LUNATE_SIGMA.tr = 's';

      if (!this.#capitalLetters.CAPITAL_LUNATE_SIGMA?.tr) {
        console.warn('You must enable `AdditionalChar.LUNATE_SIGMA` for the option `transliterationStyle.lunatesigma_s` to take effect.'); // prettier-ignore
      }
    }

    if (useCxOverMacron) {
      if (eta_i) {
        this.#capitalLetters.CAPITAL_ETA.tr = 'Î';
        this.#smallLetters.SMALL_ETA.tr = 'î';
      } else {
        this.#capitalLetters.CAPITAL_ETA.tr = 'Ê';
        this.#smallLetters.SMALL_ETA.tr = 'ê';
      }

      this.#capitalLetters.CAPITAL_OMEGA.tr = 'Ô';
      this.#smallLetters.SMALL_OMEGA.tr = 'ô';

      if (this.#capitalLetters.CAPITAL_STIGMA?.tr) {
        this.#capitalLetters.CAPITAL_STIGMA.tr = 'Ĉ';
        this.#smallLetters.SMALL_STIGMA.tr = 'ĉ';
      }

      if (this.#capitalLetters.CAPITAL_SAMPI?.tr) {
        this.#capitalLetters.CAPITAL_SAMPI.tr = 'Ŝ';
        this.#smallLetters.SMALL_SAMPI.tr = 'ŝ';
      }
    }

    if (this.#isUpperCase) {
      for (const [k, v] of Object.entries(this.#capitalLetters)) {
        if (v.tr?.length > 1 /* Th, Ph, etc */) {
          this.#capitalLetters[k].tr = v.tr.toUpperCase();
        }
      }
    }
  }

  /**
   * Returns a converted string.
   */
  apply(fromStr: string, fromType: KeyType, toType: KeyType): string {
    fromStr = fromStr.normalize('NFD');

    if (fromType === KeyType.TRANSLITERATION && toType !== fromType) {
      fromStr = this.#trJoinSpecialChars(fromStr);

      // Add the alternate upsilon form (y/u) to the mapping.
      if (this.#transliterationStyle?.upsilon_y) {
        this.#capitalLetters.CAPITAL_ALT_UPSILON = {
          bc: this.#capitalLetters.CAPITAL_UPSILON.bc,
          gr: this.#capitalLetters.CAPITAL_UPSILON.gr,
          tr: 'U'
        };
        this.#smallLetters.SMALL_ALT_UPSILON = {
          bc: this.#smallLetters.SMALL_UPSILON.bc,
          gr: this.#smallLetters.SMALL_UPSILON.gr,
          tr: 'u'
        };
      }

      // `lunatesigma_s` is destructive: convert back all sigmas using the regular form.
      if (this.#transliterationStyle?.lunatesigma_s) {
        this.#capitalLetters.CAPITAL_LUNATE_SIGMA.tr = undefined;
        this.#smallLetters.SMALL_LUNATE_SIGMA.tr = undefined;
      }
    }

    if (fromType === KeyType.GREEK) {
      fromStr = normalizeGreek(fromStr, true, true);
    }

    const mappingProps = this.#getPropsMapOrderByLengthDesc(fromType, toType);
    let conversionArr: string[] = new Array(fromStr.length);

    // Apply mapped chars.
    for (const [lval, rval] of mappingProps) {
      if (!lval) continue; // Left value can be empty/undefined.

      const re = new RegExp(sanitizeRegExpString(lval), 'g');
      let matches;

      while ((matches = re.exec(fromStr)) !== null) {
        // <= v0.12.1: `matches.index + matches[0].normalize('NFD').length;`.
        // This resolves the archaic koppa's bug but might have side effects.
        const lastIndex = matches.index + matches[0].length;

        // Check if the indices have already been filled.
        let isFilled = false;
        for (let i = matches.index; i < lastIndex; i++) {
          if (conversionArr[i] !== undefined) {
            isFilled = true;
            break;
          }
        }

        if (!isFilled) conversionArr[matches.index] = rval;

        // Nullish subsequent array indices if necessary.
        if (lval.length > 1) {
          for (let i = 1; i < lval.length; i++) {
            conversionArr[matches.index + i] = '';
          }
        }
      }

      if (!conversionArr.includes(undefined)) break;
    }

    // Apply potentially remaining (non-mapped) chars to the converted string.
    if (conversionArr.includes(undefined)) {
      for (let i = 0; i < conversionArr.length; i++) {
        if (conversionArr[i] === undefined) {
          conversionArr[i] = fromStr[i];
        }
      }
    }

    let convertedStr = conversionArr.join('').normalize();

    convertedStr = this.#applyGammaNasals(convertedStr, toType);

    return convertedStr;
  }

  /**
   * Returns a string with the right representation of gamma nasals.
   */
  #applyGammaNasals(str: string, type: KeyType): string {
    switch (type) {
      case KeyType.GREEK:
        return str.replace(/(ν)([γκξχ])/gi, (m, $1, $2) =>
          $1.toUpperCase() === $1 ? 'Γ' + $2 : 'γ' + $2
        );

      case KeyType.TRANSLITERATION:
        const { gammaNasal_n } = this.#transliterationStyle ?? {};

        if (!gammaNasal_n) return str;

        // Letter 'k' covers the case of `xi_ks`/`chi_kh` options.
        return str.replace(/(g)(g|k|x|ch)/gi, (m, $1, $2) =>
          $1.toUpperCase() === $1 ? 'N' + $2 : 'n' + $2
        );

      default:
        return str;
    }
  }

  /**
   * Returns the `Mapping` properties as a `Map` of values matching the given
   * `fromType` and `toType` and orderd by decomposed string length.
   *
   * @param fromType - The left value of the resulting `Map`
   * @param toType - The right value of the resulting `Map`
   * @param removeDiacritics - If `true`, exclude `this.#diacritics`
   */
  #getPropsMapOrderByLengthDesc(
    fromType: KeyType,
    toType: KeyType
  ): Map<string, string> {
    let fromProp, toProp: string;

    if (fromType === KeyType.BETA_CODE) fromProp = 'bc';
    else if (fromType === KeyType.GREEK) fromProp = 'gr';
    else fromProp = 'tr';

    if (toType === KeyType.BETA_CODE) toProp = 'bc';
    else if (toType === KeyType.GREEK) toProp = 'gr';
    else toProp = 'tr';

    let chars = [];

    const props = Object.assign(
      this.#capitalLetters,
      !this.#isUpperCase ? this.#smallLetters : {},
      this.#punctuation
    );

    for (const [k, v] of Object.entries(props)) {
      if (v[fromProp] && v[toProp]) chars.push([v[fromProp], v[toProp]]);
    }

    const sortedChars = chars.sort(
      (a: string, b: string) =>
        b[0].normalize('NFD').length - a[0].normalize('NFD').length
    );

    if (!this.#removeDiacritics) {
      let diacritics = [];

      for (const [k, v] of Object.entries(this.#diacritics)) {
        if (v[fromProp] && v[toProp]) diacritics.push([v[fromProp], v[toProp]]);
      }

      return new Map([...sortedChars, ...diacritics]);
    }

    return new Map(sortedChars);
  }

  /**
   * Returns a string for which some diacritical marks have been joined back
   * to their letter as they should not be treated separately (e. g. when
   * a transliterated long vowel occurs).
   *
   * @param NFDTransliteratedStr - Expects an `NFD` normalized transliterated string.
   */
  #trJoinSpecialChars(NFDTransliteratedStr: string): string {
    // Join back below dots to archaic koppas.
    if (this.#capitalLetters.CAPITAL_ARCHAIC_KOPPA?.tr) {
      NFDTransliteratedStr = NFDTransliteratedStr.replace(
        new RegExp(`${this.#capitalLetters.CAPITAL_ARCHAIC_KOPPA.tr.normalize('NFD')}`, 'gi'), // prettier-ignore
        (m) => m.normalize()
      );
    }

    // Join back long wovel marks to the letters that carry them.
    const longVowelMark = this.#transliterationStyle?.useCxOverMacron ? CIRCUMFLEX : MACRON; // prettier-ignore
    const letters: string = this.trLettersWithCxOrMacron().join('');
    const re = new RegExp(`([${letters}])(\\p{M}*?)(${longVowelMark})`, 'gu'); // prettier-ignore
    return NFDTransliteratedStr.replace(re, (m, char, diacritics) => {
      return (char + longVowelMark).normalize() + diacritics;
    });
  }

  /**
   * Returns an array containing the transliterated chars that carry
   * a circumflex or a macron (depnding on the context).
   *
   * @remarks
   * Letters are returned without their diacritical sign.
   */
  trLettersWithCxOrMacron(): string[] {
    const letters = Object.assign(this.#capitalLetters, this.#smallLetters);

    const found = [];
    for (const [k, v] of Object.entries(letters)) {
      const el = v?.tr ? v.tr.normalize('NFD') : '';
      if (/\u0302|\u0304/.test(el)) {
        found.push(el);
      }
    }

    return found.map((el) => el.charAt(0).normalize());
  }
}
