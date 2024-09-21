import { AdditionalChar, KeyType } from './enums';
import {
  IInternalConversionOptions,
  IMappingProperty,
  ITransliterationStyle
} from './interfaces';
import { applyGammaNasals /*, sanitizeRegExpString*/ } from './utils';

// prettier-ignore
export const PRECOMPOSED_CHARS_WITH_TONOS_OXIA: string[][] = [
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

const ADDITIONAL_CHARS_VALUES = (): {
  [k in AdditionalChar]: {
    [k in string]: IMappingProperty;
  };
} => ({
  [AdditionalChar.ALL]: {},
  [AdditionalChar.DIGAMMA]: {
    LETTER_DIGAMMA: {
      gr: 'Ϝ',
      bc: 'V',
      tr: 'W' // defined by: ALA-LC, BNF
    }
  },
  [AdditionalChar.YOT]: {
    LETTER_YOT: {
      gr: '\u037F',
      bc: 'J',
      tr: 'J' // defined by: BNF
    }
  },
  [AdditionalChar.LUNATE_SIGMA]: {
    LETTER_LUNATE_SIGMA: {
      gr: CAPITAL_LUNATE_SIGMA,
      bc: 'S3',
      tr: 'C' // defined by: BNF
    }
  },
  [AdditionalChar.STIGMA]: {
    LETTER_STIGMA: {
      gr: '\u03DA',
      bc: '*#2',
      tr: 'C̄' // defined by: BNF
    }
  },
  [AdditionalChar.KOPPA]: {
    LETTER_KOPPA: {
      gr: 'Ϟ',
      bc: '*#1',
      tr: 'Q' // defined by: BNF
    }
  },
  [AdditionalChar.ARCHAIC_KOPPA]: {
    LETTER_ARCHAIC_KOPPA: {
      gr: 'Ϙ',
      bc: '*#3',
      tr: 'Ḳ' // defined by: ALA-LC
    }
  },
  [AdditionalChar.SAMPI]: {
    LETTER_SAMPI: {
      gr: 'Ϡ',
      bc: '*#5',
      tr: 'S̄' // defined by: BNF
    }
  }
  /*[AdditionalChar.SAN]: {
    LETTER_SAN: {
      gr: '\u03FA',
      bc: '*#711',
      tr: undefined
    }
  }*/
});

const LETTERS = (): {
  [k in string]: IMappingProperty;
} => ({
  LETTER_ALPHA: {
    gr: 'Α',
    bc: 'A',
    tr: 'A'
  },
  LETTER_BETA: {
    gr: 'Β',
    bc: 'B',
    tr: 'B'
  },
  LETTER_GAMMA: {
    gr: 'Γ',
    bc: 'G',
    tr: 'G'
  },
  LETTER_DELTA: {
    gr: 'Δ',
    bc: 'D',
    tr: 'D'
  },
  LETTER_EPSILON: {
    gr: 'Ε',
    bc: 'E',
    tr: 'E'
  },
  LETTER_ZETA: {
    gr: 'Ζ',
    bc: 'Z',
    tr: 'Z'
  },
  LETTER_ETA: {
    gr: 'Η',
    bc: 'H',
    tr: 'Ē'
  },
  LETTER_THETA: {
    gr: 'Θ',
    bc: 'Q',
    tr: 'Th'
  },
  LETTER_IOTA: {
    gr: 'Ι',
    bc: 'I',
    tr: 'I'
  },
  LETTER_KAPPA: {
    gr: 'Κ',
    bc: 'K',
    tr: 'K'
  },
  LETTER_LAMBDA: {
    gr: 'Λ',
    bc: 'L',
    tr: 'L'
  },
  LETTER_MU: {
    gr: 'Μ',
    bc: 'M',
    tr: 'M'
  },
  LETTER_NU: {
    gr: 'Ν',
    bc: 'N',
    tr: 'N'
  },
  LETTER_XI: {
    gr: 'Ξ',
    bc: 'C',
    tr: 'X'
  },
  LETTER_OMICRON: {
    gr: 'Ο',
    bc: 'O',
    tr: 'O'
  },
  LETTER_PI: {
    gr: 'Π',
    bc: 'P',
    tr: 'P'
  },
  LETTER_RHO: {
    gr: 'Ρ',
    bc: 'R',
    tr: 'R'
  },
  LETTER_LUNATE_SIGMA: {} as IMappingProperty, // order matters here
  LETTER_SIGMA: {
    gr: 'Σ',
    bc: 'S',
    tr: 'S'
  },
  LETTER_TAU: {
    gr: 'Τ',
    bc: 'T',
    tr: 'T'
  },
  LETTER_UPSILON: {
    gr: 'Υ',
    bc: 'U',
    tr: 'U'
  },
  LETTER_PHI: {
    gr: 'Φ',
    bc: 'F',
    tr: 'Ph'
  },
  LETTER_CHI: {
    gr: 'Χ',
    bc: 'X',
    tr: 'Ch'
  },
  LETTER_PSI: {
    gr: 'Ψ',
    bc: 'Y',
    tr: 'Ps'
  },
  LETTER_OMEGA: {
    gr: 'Ω',
    bc: 'W',
    tr: 'Ō'
  },
  LETTER_DIGAMMA: {} as IMappingProperty,
  LETTER_YOT: {} as IMappingProperty,
  LETTER_STIGMA: {} as IMappingProperty,
  LETTER_KOPPA: {} as IMappingProperty,
  LETTER_ARCHAIC_KOPPA: {} as IMappingProperty,
  LETTER_SAMPI: {} as IMappingProperty
  //LETTER_SAN: {} as IMappingProperty
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
  #capitalLetters = LETTERS();
  #smallLetters = {} as { [k in string]: IMappingProperty }; // initialize from the previous
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
        const charName = Object.keys(v)[0];
        if (!charName) continue; // AdditionalChar.ALL

        if (
          this.#additionalChars === AdditionalChar.ALL ||
          this.#additionalChars === +k ||
          (Array.isArray(this.#additionalChars) &&
            this.#additionalChars.includes(+k))
        ) {
          this.#capitalLetters[charName] = v[charName];
        }
      }
    }

    // Add `trBase` values (later replicated in `#smallLetters`).
    for (const k of Object.keys(this.#capitalLetters)) {
      if (this.#capitalLetters[k].tr)
        this.#capitalLetters[k].trBase = this.#capitalLetters[k].tr;
    }

    const {
      useCxOverMacron,
      beta_v,
      eta_i,
      xi_ks,
      phi_f,
      chi_kh,
      lunatesigma_s
    } = this.#transliterationStyle ?? {};

    beta_v
      ? (this.#capitalLetters.LETTER_BETA.tr = 'V')
      : (this.#capitalLetters.LETTER_BETA.trBase = 'V');

    eta_i
      ? (this.#capitalLetters.LETTER_ETA.tr = 'Ī')
      : (this.#capitalLetters.LETTER_ETA.trBase = 'Ī');

    xi_ks
      ? (this.#capitalLetters.LETTER_XI.tr = 'Ks')
      : (this.#capitalLetters.LETTER_XI.trBase = 'Ks');

    phi_f
      ? (this.#capitalLetters.LETTER_PHI.tr = 'F')
      : (this.#capitalLetters.LETTER_PHI.trBase = 'F');

    chi_kh
      ? (this.#capitalLetters.LETTER_CHI.tr = 'Kh')
      : (this.#capitalLetters.LETTER_CHI.trBase = 'Kh');

    // This is enabled silently if not explicitly. See `utils/handleOptions()`.
    lunatesigma_s
      ? (this.#capitalLetters.LETTER_LUNATE_SIGMA.tr = 'S')
      : (this.#capitalLetters.LETTER_LUNATE_SIGMA.trBase = 'S');

    // @fixme
    if (useCxOverMacron) {
      if (eta_i) {
        this.#capitalLetters.LETTER_ETA.tr = 'Î';
        this.#capitalLetters.LETTER_ETA.trBase = 'Ê';
      } else {
        this.#capitalLetters.LETTER_ETA.tr = 'Ê';
        this.#capitalLetters.LETTER_ETA.trBase = 'Î';
      }

      this.#capitalLetters.LETTER_OMEGA.tr = 'Ô';

      if (this.#capitalLetters.LETTER_STIGMA?.tr) {
        this.#capitalLetters.LETTER_STIGMA.tr = 'Ĉ';
      }

      if (this.#capitalLetters.LETTER_SAMPI?.tr) {
        this.#capitalLetters.LETTER_SAMPI.tr = 'Ŝ';
      }
    }

    if (this.#isUpperCase) {
      for (const [k, v] of Object.entries(this.#capitalLetters)) {
        if (v.tr?.length > 1 /* Th, Ph, etc */) {
          this.#capitalLetters[k].tr = v.tr.toUpperCase();
        }
        if (v.trBase?.length > 1) {
          this.#capitalLetters[k].trBase = v.trBase.toUpperCase();
        }
      }
    }

    // Initialize `#smallLetters` using `#capitalLetters` properties.
    for (const [charName, props] of Object.entries(this.#capitalLetters)) {
      const propName = '_' + charName; // deduplicate properties names
      this.#smallLetters[propName] = {} as IMappingProperty;
      for (const [k, v] of Object.entries(props)) {
        this.#smallLetters[propName][k] = v.startsWith('*')
          ? v.substring(1).toLowerCase()
          : v.toLowerCase();
      }
    }
  }

  /**
   * Returns a converted string.
   */
  apply(fromStr: string, fromType: KeyType, toType: KeyType): string {
    const { useCxOverMacron, gammaNasal_n } = this.#transliterationStyle ?? {};

    fromStr = fromStr.normalize('NFD');

    // Join back letters with a circumflex or a macron.
    if (fromType === KeyType.TRANSLITERATION) {
      if (toType === fromType) {
        // Normalize the long vowel mark (use macrons).
        fromStr = fromStr.replace(new RegExp(`${CIRCUMFLEX}`, 'g'), MACRON);
      }
      const cxOrMacron = useCxOverMacron && fromType !== toType;
      fromStr = this.#trJoinSpecialChars(fromStr, cxOrMacron);
    }

    // Normalize the greek input.
    if (fromType === KeyType.GREEK) {
      fromStr = fromStr
        .replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE)
        .replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA)
        .replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK);
    }

    const mappingProps = this.#getPropsMapOrderByLengthDesc(fromType, toType);

    /*
    let conversionArr: string[] = new Array(fromStr.length);

    // Apply mapped chars.
    for (const [lval, rval] of mappingProps) {
      if (!lval) continue; // left value can be empty/undefined

      const re = new RegExp(sanitizeRegExpString(lval), 'g');
      let matches;

      while ((matches = re.exec(fromStr)) !== null) {
        const lastIndex = matches.index + matches[0].length;

        // Check if the indices have already been filled.
        let isFilled = false;
        for (let i = matches.index; i < lastIndex; i++) {
          if (conversionArr[i] !== undefined) {
            isFilled = true;
          }
        }
      }
    }
    */

    let convertedStr = '';
    for (let i = 0; i < fromStr.length; i++) {
      let tmp = undefined as string;

      let triple = fromStr.slice(i, i + 3);
      let couple = fromStr.slice(i, i + 2);

      if (triple.length !== 3) triple = undefined as string;
      if (couple.length !== 2) couple = undefined as string;

      for (const [left, right] of mappingProps) {
        if (left === fromStr[i]) {
          tmp = right;
          if (left.length === 1) break;
        }

        if (left === couple) {
          tmp = right;
          i++;
          break;
        }

        if (left === triple) {
          tmp = right;
          i += 2;
          break;
        }
      }

      convertedStr += tmp ?? fromStr[i];
    }

    return applyGammaNasals(convertedStr.normalize(), toType, gammaNasal_n);
  }

  /**
   * Returns the raw properties for the Mapping instance.
   */
  #getProperties(): { [k in string]: IMappingProperty } {
    let props = this.#capitalLetters;
    if (!this.#isUpperCase) props = { ...props, ...this.#smallLetters };
    if (!this.#removeDiacritics) props = { ...props, ...this.#diacritics };
    return { ...props, ...this.#punctuation };
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
    const props = this.#getProperties();

    const fromProp: string =
      fromType === KeyType.TRANSLITERATION && fromType === toType
        ? 'trBase'
        : fromType;
    const toProp: string = toType;

    // prettier-ignore
    const sortedChars: string[][] = Object.values(props)
      .reduce((acc, v) => 
        v[fromProp] && v[toProp] ? [...acc, [v[fromProp], v[toProp]]] : acc
      , [])
      .sort((a, b) => b[0].normalize('NFD').length - a[0].normalize('NFD').length);

    // @ts-ignore
    return new Map(sortedChars);
  }

  /**
   * Returns a boolean that indicates if the given character is part of the mapping.
   */
  isMappedChar(char: string, type: KeyType): boolean {
    const props = this.#getProperties();

    let values = Object.values(props).reduce(
      (acc, v) => (v[type] ? [...acc, v[type]] : acc),
      []
    );

    // Uppercase digraphs are mapped with only the first letter capitalized
    // but they are used to convert entirely capitalized sequences too.
    if (char.length > 1 && char[0].toUpperCase() === char[0]) {
      values = values.reduce(
        (acc, v) =>
          v[0].toUpperCase() === v[0] && v.length === char.length
            ? [...acc, v.toUpperCase()]
            : acc,
        []
      );
      char = char.toUpperCase();
    }

    return values.includes(char);
  }

  /**
   * Returns a string for which some diacritical marks have been joined back
   * to their base character as they should not be treated separately
   * (e. g. when a transliterated long vowel occurs).
   *
   * @param NFDTransliteratedStr - Expects an `NFD` normalized transliterated string.
   */
  #trJoinSpecialChars(
    NFDTransliteratedStr: string,
    useCircumflex?: boolean
  ): string {
    const specialChars: string = this.trLettersWithCxOrMacron().join('');
    const cxOrMacron = useCircumflex ? CIRCUMFLEX : MACRON;

    if (this.#capitalLetters.LETTER_ARCHAIC_KOPPA?.tr) {
      NFDTransliteratedStr = NFDTransliteratedStr.replace(
        new RegExp(`(k)(\\p{M}*)(${DOT_BELOW})`, 'giu'),
        (m, $1, $2, $3) => ($1 + $3).normalize() + $2
      );
    }

    return NFDTransliteratedStr.replace(
      new RegExp(`([${specialChars}])(\\p{M}*)([${cxOrMacron}])`, 'gu'),
      (m, $1, $2, $3) => ($1 + $3).normalize() + $2
    );
  }

  /**
   * Returns an array containing the transliterated chars that carry
   * a circumflex or a macron (depnding on the context).
   *
   * @remarks
   * Letters are returned without their diacritical sign.
   *
   * @privateRemarks
   * Array.reduce() / concat() should be replaced by (ES2019) Array.flatMap().
   */
  trLettersWithCxOrMacron(): string[] {
    return Object.values({
      ...this.#capitalLetters,
      ...this.#smallLetters
    }).reduce((acc, v) => {
      if (!/\u0302|\u0304/.test(v.tr?.normalize('NFD'))) return acc;

      const letter = v.tr.normalize('NFD').charAt(0).normalize();

      return v.trBase !== v.tr
        ? acc.concat([v.trBase.normalize('NFD').charAt(0).normalize(), letter])
        : acc.concat(letter);
    }, []);
  }
}
