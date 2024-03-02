import { AdditionalChar, KeyType } from './enums';
import {
  IInternalConversionOptions,
  IMappingProperty,
  ITransliterationStyle
} from './interfaces';
import { sanitizeRegExpString } from './utils';

export const GRAVE_ACCENT = '\u0300';
export const ACUTE_ACCENT = '\u0301';
export const TONOS = '\u0384';
export const OXIA = '\u1FFD';
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
export const GREEK_QUESTION_MARK = '\u037E';
export const GREEK_BETA_SYMBOL = '\u03D0';
export const CAPITAL_LUNATE_SIGMA = '\u03F9';
export const SMALL_LUNATE_SIGMA = '\u03F2';

const ADDITIONAL_CHARS_VALUES = (): {
  [k in AdditionalChar]: {
    [k in any /* @fixme */]: IMappingProperty;
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

export class Mapping {
  private CAPITAL_ALPHA: IMappingProperty = {
    gr: 'Α',
    bc: 'A',
    tr: 'A'
  };
  private CAPITAL_BETA: IMappingProperty = {
    gr: 'Β',
    bc: 'B',
    tr: 'B'
  };
  private CAPITAL_GAMMA: IMappingProperty = {
    gr: 'Γ',
    bc: 'G',
    tr: 'G'
  };
  private CAPITAL_DELTA: IMappingProperty = {
    gr: 'Δ',
    bc: 'D',
    tr: 'D'
  };
  private CAPITAL_EPSILON: IMappingProperty = {
    gr: 'Ε',
    bc: 'E',
    tr: 'E'
  };
  private CAPITAL_ZETA: IMappingProperty = {
    gr: 'Ζ',
    bc: 'Z',
    tr: 'Z'
  };
  private CAPITAL_ETA: IMappingProperty = {
    gr: 'Η',
    bc: 'H',
    tr: 'Ē'
  };
  private CAPITAL_THETA: IMappingProperty = {
    gr: 'Θ',
    bc: 'Q',
    tr: 'Th'
  };
  private CAPITAL_IOTA: IMappingProperty = {
    gr: 'Ι',
    bc: 'I',
    tr: 'I'
  };
  private CAPITAL_KAPPA: IMappingProperty = {
    gr: 'Κ',
    bc: 'K',
    tr: 'K'
  };
  private CAPITAL_LAMBDA: IMappingProperty = {
    gr: 'Λ',
    bc: 'L',
    tr: 'L'
  };
  private CAPITAL_MU: IMappingProperty = {
    gr: 'Μ',
    bc: 'M',
    tr: 'M'
  };
  private CAPITAL_NU: IMappingProperty = {
    gr: 'Ν',
    bc: 'N',
    tr: 'N'
  };
  private CAPITAL_XI: IMappingProperty = {
    gr: 'Ξ',
    bc: 'C',
    tr: 'X'
  };
  private CAPITAL_OMICRON: IMappingProperty = {
    gr: 'Ο',
    bc: 'O',
    tr: 'O'
  };
  private CAPITAL_PI: IMappingProperty = {
    gr: 'Π',
    bc: 'P',
    tr: 'P'
  };
  private CAPITAL_RHO: IMappingProperty = {
    gr: 'Ρ',
    bc: 'R',
    tr: 'R'
  };
  private CAPITAL_SIGMA: IMappingProperty = {
    gr: 'Σ',
    bc: 'S',
    tr: 'S'
  };
  private CAPITAL_TAU: IMappingProperty = {
    gr: 'Τ',
    bc: 'T',
    tr: 'T'
  };
  private CAPITAL_UPSILON: IMappingProperty = {
    gr: 'Υ',
    bc: 'U',
    tr: 'U'
  };
  private CAPITAL_ALT_UPSILON: IMappingProperty;
  private CAPITAL_PHI: IMappingProperty = {
    gr: 'Φ',
    bc: 'F',
    tr: 'Ph'
  };
  private CAPITAL_CHI: IMappingProperty = {
    gr: 'Χ',
    bc: 'X',
    tr: 'Ch'
  };
  private CAPITAL_PSI: IMappingProperty = {
    gr: 'Ψ',
    bc: 'Y',
    tr: 'Ps'
  };
  private CAPITAL_OMEGA: IMappingProperty = {
    gr: 'Ω',
    bc: 'W',
    tr: 'Ō'
  };
  private CAPITAL_DIGAMMA: IMappingProperty;
  private CAPITAL_YOT: IMappingProperty;
  private CAPITAL_LUNATE_SIGMA: IMappingProperty;
  private CAPITAL_STIGMA: IMappingProperty;
  private CAPITAL_KOPPA: IMappingProperty;
  private CAPITAL_ARCHAIC_KOPPA: IMappingProperty;
  private CAPITAL_SAMPI: IMappingProperty;
  private CAPITAL_SAN: IMappingProperty;
  private SMALL_ALPHA: IMappingProperty = {
    gr: 'α',
    bc: 'a',
    tr: 'a'
  };
  private SMALL_BETA: IMappingProperty = {
    gr: 'β',
    bc: 'b',
    tr: 'b'
  };
  private SMALL_GAMMA: IMappingProperty = {
    gr: 'γ',
    bc: 'g',
    tr: 'g'
  };
  private SMALL_DELTA: IMappingProperty = {
    gr: 'δ',
    bc: 'd',
    tr: 'd'
  };
  private SMALL_EPSILON: IMappingProperty = {
    gr: 'ε',
    bc: 'e',
    tr: 'e'
  };
  private SMALL_ZETA: IMappingProperty = {
    gr: 'ζ',
    bc: 'z',
    tr: 'z'
  };
  private SMALL_ETA: IMappingProperty = {
    gr: 'η',
    bc: 'h',
    tr: 'ē'
  };
  private SMALL_THETA: IMappingProperty = {
    gr: 'θ',
    bc: 'q',
    tr: 'th'
  };
  private SMALL_IOTA: IMappingProperty = {
    gr: 'ι',
    bc: 'i',
    tr: 'i'
  };
  private SMALL_KAPPA: IMappingProperty = {
    gr: 'κ',
    bc: 'k',
    tr: 'k'
  };
  private SMALL_LAMBDA: IMappingProperty = {
    gr: 'λ',
    bc: 'l',
    tr: 'l'
  };
  private SMALL_MU: IMappingProperty = {
    gr: 'μ',
    bc: 'm',
    tr: 'm'
  };
  private SMALL_NU: IMappingProperty = {
    gr: 'ν',
    bc: 'n',
    tr: 'n'
  };
  private SMALL_XI: IMappingProperty = {
    gr: 'ξ',
    bc: 'c',
    tr: 'x'
  };
  private SMALL_OMICRON: IMappingProperty = {
    gr: 'ο',
    bc: 'o',
    tr: 'o'
  };
  private SMALL_PI: IMappingProperty = {
    gr: 'π',
    bc: 'p',
    tr: 'p'
  };
  private SMALL_RHO: IMappingProperty = {
    gr: 'ρ',
    bc: 'r',
    tr: 'r'
  };
  private SMALL_SIGMA: IMappingProperty = {
    gr: 'σ',
    bc: 's',
    tr: 's'
  };
  private SMALL_TAU: IMappingProperty = {
    gr: 'τ',
    bc: 't',
    tr: 't'
  };
  private SMALL_UPSILON: IMappingProperty = {
    gr: 'υ',
    bc: 'u',
    tr: 'u'
  };
  private SMALL_ALT_UPSILON: IMappingProperty;
  private SMALL_PHI: IMappingProperty = {
    gr: 'φ',
    bc: 'f',
    tr: 'ph'
  };
  private SMALL_CHI: IMappingProperty = {
    gr: 'χ',
    bc: 'x',
    tr: 'ch'
  };
  private SMALL_PSI: IMappingProperty = {
    gr: 'ψ',
    bc: 'y',
    tr: 'ps'
  };
  private SMALL_OMEGA: IMappingProperty = {
    gr: 'ω',
    bc: 'w',
    tr: 'ō'
  };
  private SMALL_DIGAMMA: IMappingProperty;
  private SMALL_YOT: IMappingProperty;
  private SMALL_LUNATE_SIGMA: IMappingProperty;
  private SMALL_STIGMA: IMappingProperty;
  private SMALL_KOPPA: IMappingProperty;
  private SMALL_ARCHAIC_KOPPA: IMappingProperty;
  private SMALL_SAMPI: IMappingProperty;
  private SMALL_SAN: IMappingProperty;
  private QUESTION_MARK: IMappingProperty = {
    gr: GREEK_QUESTION_MARK,
    bc: ';',
    tr: '?'
  };
  private ANO_TELEIA: IMappingProperty = {
    gr: ANO_TELEIA,
    bc: ':',
    tr: ';'
  };
  private DIACRITICS = {
    SMOOTH_BREATHING: {
      gr: SMOOTH_BREATHING,
      bc: ')',
      tr: SMOOTH_BREATHING
    } as IMappingProperty,
    ROUGH_BREATHING: {
      gr: ROUGH_BREATHING,
      bc: '(',
      tr: undefined
    } as IMappingProperty,
    ACCUTE_ACCENT: {
      gr: ACUTE_ACCENT,
      bc: '/',
      tr: ACUTE_ACCENT
    } as IMappingProperty,
    GRAVE_ACCENT: {
      gr: GRAVE_ACCENT,
      bc: '\\',
      tr: GRAVE_ACCENT
    } as IMappingProperty,
    MACRON: {
      gr: MACRON,
      bc: '%26',
      tr: MACRON
    } as IMappingProperty,
    BREVE: {
      gr: BREVE,
      bc: '%27',
      tr: BREVE
    } as IMappingProperty,
    TILDE: {
      gr: GREEK_TILDE,
      bc: '=',
      tr: LATIN_TILDE
    } as IMappingProperty,
    DIAERESIS: {
      gr: DIAERESIS,
      bc: '+',
      tr: DIAERESIS
    } as IMappingProperty,
    IOTA_SUBSCRIPT: {
      gr: IOTA_SUBSCRIPT,
      bc: '|',
      tr: CEDILLA
    } as IMappingProperty,
    DOT_BELOW: {
      gr: DOT_BELOW,
      bc: '?',
      tr: DOT_BELOW
    } as IMappingProperty
  };

  #isUpperCase: boolean;
  //#betaCodeStyle: IBetaCodeStyle;
  #removeDiacritics: boolean;
  #transliterationStyle: ITransliterationStyle;
  #useAdditionalChars: AdditionalChar[] | AdditionalChar;

  constructor(options?: IInternalConversionOptions) {
    if (!options) return;

    this.#isUpperCase = options?.isUpperCase;
    //this.#betaCodeStyle = options?.setBetaCodeStyle;
    this.#removeDiacritics = options?.removeDiacritics;
    this.#transliterationStyle = options?.setTransliterationStyle;
    this.#useAdditionalChars = options?.useAdditionalChars;

    if (this.#isUpperCase) {
      for (const [k, v] of Object.entries(this)) {
        if (k.startsWith('CAPITAL') && v.tr?.length > 1 /* Th, Ph, etc */) {
          this[k].tr = v.tr.toUpperCase();
        }
      }
    }

    if (this.#useAdditionalChars) {
      for (const [k, v] of Object.entries(ADDITIONAL_CHARS_VALUES())) {
        if (
          this.#useAdditionalChars === AdditionalChar.ALL ||
          this.#useAdditionalChars === k ||
          (Array.isArray(this.#useAdditionalChars) &&
            this.#useAdditionalChars.includes(k as AdditionalChar))
        ) {
          for (const [char, props] of Object.entries(v)) this[char] = props;
        }
      }
    }

    const { useCxOverMacron, xi_ks, chi_kh, rho_rh, upsilon_y, lunatesigma_s } =
      this.#transliterationStyle ?? {};

    if (useCxOverMacron) {
      this.CAPITAL_ETA.tr = 'Ê';
      this.SMALL_ETA.tr = 'ê';

      this.CAPITAL_OMEGA.tr = 'Ô';
      this.SMALL_OMEGA.tr = 'ô';

      if (this.CAPITAL_STIGMA?.tr) {
        this.CAPITAL_STIGMA.tr = 'Ĉ';
        this.SMALL_STIGMA.tr = 'ĉ';
      }

      if (this.CAPITAL_SAMPI?.tr) {
        this.CAPITAL_SAMPI.tr = 'Ŝ';
        this.SMALL_SAMPI.tr = 'ŝ';
      }
    }

    if (xi_ks) {
      this.CAPITAL_XI.tr = 'Ks';
      this.SMALL_XI.tr = 'ks';
    }

    if (chi_kh) {
      this.CAPITAL_CHI.tr = 'Kh';
      this.SMALL_CHI.tr = 'kh';
    }

    if (upsilon_y) {
      this.CAPITAL_UPSILON.tr = 'Y';
      this.SMALL_UPSILON.tr = 'y';
    }

    if (lunatesigma_s) {
      // The lunate sigma might not have been activated using the
      // `useAdditionalChars` option. So, we need to check if its property exists.
      if (this.CAPITAL_LUNATE_SIGMA?.tr) this.CAPITAL_LUNATE_SIGMA.tr = 'S';
      if (this.SMALL_LUNATE_SIGMA?.tr) this.SMALL_LUNATE_SIGMA.tr = 's';

      if (!this.CAPITAL_LUNATE_SIGMA?.tr) {
        console.warn(
          'You must enable `AdditionalChar.LUNATE_SIGMA` for the option',
          '`setTransliterationStyle.lunatesigma_s` to take effect.'
        );
      }
    }
  }

  /**
   * Returns a converted string.
   */
  apply(fromStr: string, fromType: KeyType, toType: KeyType): string {
    fromStr = fromStr.normalize('NFD');

    if (
      fromType === KeyType.TRANSLITERATION &&
      toType !== KeyType.TRANSLITERATION
    ) {
      fromStr = this.#trJoinSpecialChars(fromStr);

      // Add the alternate upsilon form (y/u) to the mapping.
      if (this.#transliterationStyle?.upsilon_y) {
        this.CAPITAL_ALT_UPSILON = {
          bc: this.CAPITAL_UPSILON.bc,
          gr: this.CAPITAL_UPSILON.gr,
          tr: 'U'
        };
        this.SMALL_ALT_UPSILON = {
          bc: this.SMALL_UPSILON.bc,
          gr: this.SMALL_UPSILON.gr,
          tr: 'u'
        };
      }
    }

    if (fromType === KeyType.GREEK) {
      fromStr = Mapping.#grBypassUnicodeEquivalences(fromStr);
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
            conversionArr[matches.index + i] = null;
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
    convertedStr = Mapping.#applyGammaNasals(convertedStr, toType);

    return convertedStr;
  }

  /**
   * Returns a string with the right representation of gamma nasals.
   *
   * @remarks
   * The current implementation is `static`, so it wouldn't reflect
   * hypothetical mapped chars changes.
   */
  static #applyGammaNasals(str: string, type: KeyType): string {
    switch (type) {
      case KeyType.BETA_CODE:
        return str;

      case KeyType.GREEK:
        return str.replace(/(ν)([γκξχ])/gi, (match, first, second) => {
          if (first === first.toUpperCase()) return 'Γ' + second;
          else return 'γ' + second;
        });

      case KeyType.TRANSLITERATION:
        // The case of `ITransliterationStyle` options `xi_ks` & `chi_kh`
        // is covered by the letter K.
        return str.replace(/(g)(g|k|x|ch)/gi, (match, first, second) => {
          if (first === first.toUpperCase()) return 'N' + second;
          else return 'n' + second;
        });

      default:
        console.warn(`KeyType '${type}' is not implemented.`);
        return str;
    }
  }

  /**
   * Returns the `Mapping` properties as a `Map` of values matching the given
   * `fromType` and `toType` and orderd by decomposed string length.
   *
   * @param fromType - The left value of the resulting `Map`
   * @param toType - The right value of the resulting `Map`
   * @param removeDiacritics - If `true`, exclude the `DIACRITICS` property
   */
  #getPropsMapOrderByLengthDesc(
    fromType: KeyType,
    toType: KeyType
  ): Map<string, string> {
    let fromProp: string;
    let toProp: string;

    if (fromType === KeyType.BETA_CODE) fromProp = 'bc';
    else if (fromType === KeyType.GREEK) fromProp = 'gr';
    else if (fromType === KeyType.TRANSLITERATION) fromProp = 'tr';
    else console.warn(`KeyType '${fromType}' is not implemented.`);

    if (toType === KeyType.BETA_CODE) toProp = 'bc';
    else if (toType === KeyType.GREEK) toProp = 'gr';
    else if (toType === KeyType.TRANSLITERATION) toProp = 'tr';
    else console.warn(`KeyType '${toType}' is not implemented.`);

    let chars = [];

    for (const [k, v] of Object.entries(this)) {
      if (this.#isUpperCase && k.startsWith('SMALL')) continue;

      if (v[fromProp] !== undefined && v[toProp] !== undefined) {
        chars.push([v[fromProp], v[toProp]]);
      }
    }

    const sortedChars = chars.sort((a, b) => {
      return b[0].normalize('NFD').length - a[0].normalize('NFD').length;
    });

    if (!this.#removeDiacritics) {
      let diacritics = [];

      for (const [k, v] of Object.entries(this.DIACRITICS)) {
        if (v[fromProp] !== undefined && v[toProp] !== undefined) {
          diacritics.push([v[fromProp], v[toProp]]);
        }
      }

      return new Map([...sortedChars, ...diacritics]);
    }

    return new Map(sortedChars);
  }

  /**
   * Returns a string for which the wrong Unicode canonical equivalences
   * have been replaced by the right Unicode points.
   *
   * @param NFDGreekStr - Expects an `NFD` normalized greek string.
   */
  static #grBypassUnicodeEquivalences(NFDGreekStr: string): string {
    return NFDGreekStr.replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE)
      .replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA)
      .replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK);
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
    // @fixme: this does not work with adjacent small & capital archaic koppa.
    if (this.CAPITAL_ARCHAIC_KOPPA?.tr) {
      NFDTransliteratedStr = NFDTransliteratedStr.replace(
        new RegExp(`${this.CAPITAL_ARCHAIC_KOPPA.tr.normalize('NFD')}`, 'gi'),
        (match) => match.normalize()
      );
    }

    // Join back long wovel marks to the letters that carry them.
    const longVowelMark = this.#transliterationStyle?.useCxOverMacron ? CIRCUMFLEX : MACRON; // prettier-ignore
    const letters: string = this.trLettersWithCxOrMacron().join('');
    const re = new RegExp(`([${letters}])(\\p{M}*?)(${longVowelMark})`, 'gu'); // prettier-ignore
    return NFDTransliteratedStr.replace(re, (match, char, diacritics) => {
      return (char + longVowelMark).normalize() + diacritics;
    });
  }

  /**
   * Returns an array containing the transliterated mapped chars tied
   * to a circumflex or a macron, depnding on the context.
   *
   * @remarks
   * (1) Letters are returned without their diacritical sign.
   * (2) The current implementation is semi-static as it doesn't check
   * the actual mapped chars.
   */
  trLettersWithCxOrMacron(): string[] {
    let letters = [
      this.CAPITAL_ETA,
      this.SMALL_ETA,
      this.CAPITAL_OMEGA,
      this.SMALL_OMEGA
    ];

    if (this.CAPITAL_STIGMA?.tr) {
      letters.push(this.CAPITAL_STIGMA, this.SMALL_STIGMA);
    }

    if (this.CAPITAL_SAMPI?.tr) {
      letters.push(this.CAPITAL_SAMPI, this.SMALL_SAMPI);
    }

    return letters.map((letter) =>
      letter.tr.normalize('NFD').charAt(0).normalize()
    );
  }
}
