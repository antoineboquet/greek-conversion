import { additionalChars, keyType, style } from './enums';
import {
  BetaCodeStyle,
  IConversionOptions,
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
export const CEDILLA = '\u0327';
export const IOTA_SUBSCRIPT = '\u0345';
export const ANO_TELEIA = '\u0387';
export const MIDDLE_DOT = '\u00B7';
export const GREEK_QUESTION_MARK = '\u037E';

export class Mapping {
  CAPITAL_ALPHA: IMappingProperty = {
    gr: 'Α',
    bc: 'A',
    tr: 'A'
  };
  CAPITAL_BETA: IMappingProperty = {
    gr: 'Β',
    bc: 'B',
    tr: 'B'
  };
  CAPITAL_GAMMA: IMappingProperty = {
    gr: 'Γ',
    bc: 'G',
    tr: 'G'
  };
  CAPITAL_DELTA: IMappingProperty = {
    gr: 'Δ',
    bc: 'D',
    tr: 'D'
  };
  CAPITAL_EPSILON: IMappingProperty = {
    gr: 'Ε',
    bc: 'E',
    tr: 'E'
  };
  CAPITAL_ZETA: IMappingProperty = {
    gr: 'Ζ',
    bc: 'Z',
    tr: 'Z'
  };
  CAPITAL_ETA: IMappingProperty = {
    gr: 'Η',
    bc: 'H',
    tr: 'Ē'
  };
  CAPITAL_THETA: IMappingProperty = {
    gr: 'Θ',
    bc: 'Q',
    tr: 'Th'
  };
  CAPITAL_IOTA: IMappingProperty = {
    gr: 'Ι',
    bc: 'I',
    tr: 'I'
  };
  CAPITAL_KAPPA: IMappingProperty = {
    gr: 'Κ',
    bc: 'K',
    tr: 'K'
  };
  CAPITAL_LAMBDA: IMappingProperty = {
    gr: 'Λ',
    bc: 'L',
    tr: 'L'
  };
  CAPITAL_MU: IMappingProperty = {
    gr: 'Μ',
    bc: 'M',
    tr: 'M'
  };
  CAPITAL_NU: IMappingProperty = {
    gr: 'Ν',
    bc: 'N',
    tr: 'N'
  };
  CAPITAL_XI: IMappingProperty = {
    gr: 'Ξ',
    bc: 'C',
    tr: 'X'
  };
  CAPITAL_OMICRON: IMappingProperty = {
    gr: 'Ο',
    bc: 'O',
    tr: 'O'
  };
  CAPITAL_PI: IMappingProperty = {
    gr: 'Π',
    bc: 'P',
    tr: 'P'
  };
  CAPITAL_RHO: IMappingProperty = {
    gr: 'Ρ',
    bc: 'R',
    tr: 'R'
  };
  CAPITAL_SIGMA: IMappingProperty = {
    gr: 'Σ',
    bc: 'S',
    tr: 'S'
  };
  CAPITAL_TAU: IMappingProperty = {
    gr: 'Τ',
    bc: 'T',
    tr: 'T'
  };
  CAPITAL_UPSILON: IMappingProperty = {
    gr: 'Υ',
    bc: 'U',
    tr: 'U'
  };
  CAPITAL_PHI: IMappingProperty = {
    gr: 'Φ',
    bc: 'F',
    tr: 'Ph'
  };
  CAPITAL_CHI: IMappingProperty = {
    gr: 'Χ',
    bc: 'X',
    tr: 'Ch'
  };
  CAPITAL_PSI: IMappingProperty = {
    gr: 'Ψ',
    bc: 'Y',
    tr: 'Ps'
  };
  CAPITAL_OMEGA: IMappingProperty = {
    gr: 'Ω',
    bc: 'W',
    tr: 'Ō'
  };
  CAPITAL_DIGAMMA: IMappingProperty;
  CAPITAL_YOT: IMappingProperty;
  CAPITAL_LUNATE_SIGMA: IMappingProperty;
  CAPITAL_STIGMA: IMappingProperty;
  CAPITAL_KOPPA: IMappingProperty;
  CAPITAL_SAMPI: IMappingProperty;
  CAPITAL_SAN: IMappingProperty;
  SMALL_ALPHA: IMappingProperty = {
    gr: 'α',
    bc: 'a',
    tr: 'a'
  };
  SMALL_BETA: IMappingProperty = {
    gr: 'β',
    bc: 'b',
    tr: 'b'
  };
  SMALL_GAMMA: IMappingProperty = {
    gr: 'γ',
    bc: 'g',
    tr: 'g'
  };
  SMALL_DELTA: IMappingProperty = {
    gr: 'δ',
    bc: 'd',
    tr: 'd'
  };
  SMALL_EPSILON: IMappingProperty = {
    gr: 'ε',
    bc: 'e',
    tr: 'e'
  };
  SMALL_ZETA: IMappingProperty = {
    gr: 'ζ',
    bc: 'z',
    tr: 'z'
  };
  SMALL_ETA: IMappingProperty = {
    gr: 'η',
    bc: 'h',
    tr: 'ē'
  };
  SMALL_THETA: IMappingProperty = {
    gr: 'θ',
    bc: 'q',
    tr: 'th'
  };
  SMALL_IOTA: IMappingProperty = {
    gr: 'ι',
    bc: 'i',
    tr: 'i'
  };
  SMALL_KAPPA: IMappingProperty = {
    gr: 'κ',
    bc: 'k',
    tr: 'k'
  };
  SMALL_LAMBDA: IMappingProperty = {
    gr: 'λ',
    bc: 'l',
    tr: 'l'
  };
  SMALL_MU: IMappingProperty = {
    gr: 'μ',
    bc: 'm',
    tr: 'm'
  };
  SMALL_NU: IMappingProperty = {
    gr: 'ν',
    bc: 'n',
    tr: 'n'
  };
  SMALL_XI: IMappingProperty = {
    gr: 'ξ',
    bc: 'c',
    tr: 'x'
  };
  SMALL_OMICRON: IMappingProperty = {
    gr: 'ο',
    bc: 'o',
    tr: 'o'
  };
  SMALL_PI: IMappingProperty = {
    gr: 'π',
    bc: 'p',
    tr: 'p'
  };
  SMALL_RHO: IMappingProperty = {
    gr: 'ρ',
    bc: 'r',
    tr: 'r'
  };
  SMALL_SIGMA: IMappingProperty = {
    gr: 'σ',
    bc: 's',
    tr: 's'
  };
  SMALL_TAU: IMappingProperty = {
    gr: 'τ',
    bc: 't',
    tr: 't'
  };
  SMALL_UPSILON: IMappingProperty = {
    gr: 'υ',
    bc: 'u',
    tr: 'u'
  };
  SMALL_PHI: IMappingProperty = {
    gr: 'φ',
    bc: 'f',
    tr: 'ph'
  };
  SMALL_CHI: IMappingProperty = {
    gr: 'χ',
    bc: 'x',
    tr: 'ch'
  };
  SMALL_PSI: IMappingProperty = {
    gr: 'ψ',
    bc: 'y',
    tr: 'ps'
  };
  SMALL_OMEGA: IMappingProperty = {
    gr: 'ω',
    bc: 'w',
    tr: 'ō'
  };
  SMALL_DIGAMMA: IMappingProperty;
  SMALL_YOT: IMappingProperty;
  SMALL_LUNATE_SIGMA: IMappingProperty;
  SMALL_STIGMA: IMappingProperty;
  SMALL_KOPPA: IMappingProperty;
  SMALL_SAMPI: IMappingProperty;
  SMALL_SAN: IMappingProperty;
  QUESTION_MARK: IMappingProperty = {
    gr: GREEK_QUESTION_MARK,
    bc: '?',
    tr: '?'
  };
  ANO_TELEIA: IMappingProperty = {
    gr: ANO_TELEIA,
    bc: ';',
    tr: ';'
  };
  DIACRITICS = {
    SMOOTH_BREATHING: {
      gr: SMOOTH_BREATHING,
      bc: ')',
      tr: ''
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
    } as IMappingProperty
  };

  #betaCodeStyle: BetaCodeStyle;
  #removeDiacritics: boolean;
  #transliterationStyle: ITransliterationStyle;
  #useAdditionalChars: additionalChars[] | additionalChars;

  constructor(options?: IConversionOptions) {
    if (!options) return;

    this.#removeDiacritics = options?.removeDiacritics;
    this.#useAdditionalChars = options?.useAdditionalChars;

    // Instantiate the beta code style.
    if (options?.setBetaCodeStyle) {
      switch (options.setBetaCodeStyle) {
        case style.MODERN:
          break;

        case style.TLG:
          break;

        default:
          console.warn(
            `style '${options.setBetaCodeStyle}' is not implemented.`
          );
      }
    }

    // Instantiate the transliteration style.
    if (options?.setTransliterationStyle) {
      if (typeof options.setTransliterationStyle === 'string') {
        switch (options.setTransliterationStyle) {
          case style.ALA_LC:
            this.#transliterationStyle = {
              upsilon_y: true
            };
            break;

          case style.BNF:
            this.#transliterationStyle = {};
            break;

          case style.SBL:
            this.#transliterationStyle = {
              upsilon_y: true
            };
            break;

          default:
            console.warn(
              `style '${options.setTransliterationStyle}' is not implemented.`
            );
        }
      } else {
        this.#transliterationStyle = options.setTransliterationStyle;
      }
    }

    const extraChars = this.#useAdditionalChars;

    if (extraChars) {
      if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.DIGAMMA ||
        (Array.isArray(extraChars) &&
          extraChars.includes(additionalChars.DIGAMMA))
      ) {
        this.CAPITAL_DIGAMMA = {
          gr: 'Ϝ',
          bc: 'V',
          tr: 'W'
        };
        this.SMALL_DIGAMMA = {
          gr: 'ϝ',
          bc: 'v',
          tr: 'w'
        };
      }

      if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.YOT ||
        (Array.isArray(extraChars) && extraChars.includes(additionalChars.YOT))
      ) {
        this.CAPITAL_YOT = {
          gr: '\u037F',
          bc: 'J',
          tr: 'J'
        };
        this.SMALL_YOT = {
          gr: '\u03F3',
          bc: 'j',
          tr: 'j'
        };
      }

      if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.LUNATE_SIGMA ||
        (Array.isArray(extraChars) &&
          extraChars.includes(additionalChars.LUNATE_SIGMA))
      ) {
        this.CAPITAL_LUNATE_SIGMA = {
          gr: '\u03F9',
          bc: 'S3',
          tr: 'C'
        };
        this.SMALL_LUNATE_SIGMA = {
          gr: '\u03F2',
          bc: 's3',
          tr: 'c'
        };
      }

      if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.STIGMA ||
        (Array.isArray(extraChars) &&
          extraChars.includes(additionalChars.STIGMA))
      ) {
        this.CAPITAL_STIGMA = {
          gr: '\u03DA',
          bc: '*#2',
          tr: 'C̄'
        };
        this.SMALL_STIGMA = {
          gr: '\u03DB',
          bc: '#2',
          tr: 'c̄'
        };
      }

      if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.KOPPA ||
        (Array.isArray(extraChars) &&
          extraChars.includes(additionalChars.KOPPA))
      ) {
        this.CAPITAL_KOPPA = {
          gr: 'Ϟ',
          bc: '*#1',
          tr: 'Q'
        };
        this.SMALL_KOPPA = {
          gr: 'ϟ',
          bc: '#1',
          tr: 'q'
        };
      }

      if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.SAMPI ||
        (Array.isArray(extraChars) &&
          extraChars.includes(additionalChars.SAMPI))
      ) {
        this.CAPITAL_SAMPI = {
          gr: 'Ϡ',
          bc: '*#5',
          tr: 'S̄'
        };
        this.SMALL_SAMPI = {
          gr: 'ϡ',
          bc: '#5',
          tr: 's̄'
        };
      }

      /*if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.SAN ||
        (Array.isArray(extraChars) && extraChars.includes(additionalChars.SAN))
      ) {
        this.CAPITAL_SAN = {
          gr: '\u03FA',
          bc: undefined,
          tr: undefined
        };
        this.SMALL_SAN = {
          gr: 'ϻ',
          bc: undefined,
          tr: undefined
        };
      }*/
    }

    if (this.#transliterationStyle?.useCxOverMacron) {
      // Eta
      this.CAPITAL_ETA.tr = 'Ê';
      this.SMALL_ETA.tr = 'ê';

      // Omega
      this.CAPITAL_OMEGA.tr = 'Ô';
      this.SMALL_OMEGA.tr = 'ô';

      if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.STIGMA ||
        (Array.isArray(extraChars) &&
          extraChars.includes(additionalChars.STIGMA))
      ) {
        this.CAPITAL_STIGMA = {
          gr: '\u03DA',
          bc: undefined,
          tr: 'Ĉ'
        };
        this.SMALL_STIGMA = {
          gr: '\u03DB',
          bc: undefined,
          tr: 'ĉ'
        };
      }

      if (
        extraChars === additionalChars.ALL ||
        extraChars === additionalChars.SAMPI ||
        (Array.isArray(extraChars) &&
          extraChars.includes(additionalChars.SAMPI))
      ) {
        this.CAPITAL_SAMPI = {
          gr: 'Ϡ',
          bc: undefined,
          tr: 'Ŝ'
        };
        this.SMALL_SAMPI = {
          gr: 'ϡ',
          bc: undefined,
          tr: 'ŝ'
        };
      }
    }

    if (this.#transliterationStyle?.chi_kh) {
      this.CAPITAL_CHI.tr = 'Kh';
      this.SMALL_CHI.tr = 'kh';
    }

    if (this.#transliterationStyle?.xi_ks) {
      this.CAPITAL_XI.tr = 'Ks';
      this.SMALL_XI.tr = 'ks';
    }

    // For `transliterationStyle.upsilon_y`, see `./toTransliteration.ts`.
  }

  /**
   * Returns a converted string.
   */
  apply(fromStr: string, fromType: keyType, toType: keyType): string {
    fromStr = fromStr.normalize('NFD');

    // Transliteration: join back long wovel marks, which should
    // not be treated as diacritics, to their associated chars.
    if (fromType === keyType.TRANSLITERATION) {
      const longVowelMark = this.#transliterationStyle?.useCxOverMacron
        ? CIRCUMFLEX
        : MACRON;
      const letters: string = this.trLettersWithCxOrMacron().join('');

      const re = new RegExp(
        `(?<char>[${letters}])(?<diacritics>\\p{M}*?)(${longVowelMark})`,
        'gu'
      );

      fromStr = fromStr.replace(re, (match, char, diacritics) => {
        return (char + longVowelMark).normalize('NFC') + diacritics;
      });
    }

    // Greek: enforce the right Unicode points for
    // wrong Unicode canonical equivalences.
    if (fromType === keyType.GREEK) {
      fromStr = fromStr
        .replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE)
        .replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA)
        .replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK);
    }

    const mappingProps = this.#getPropsMapOrderByLengthDesc(fromType, toType);
    let conversionArr: string[] = new Array(fromStr.length);

    // Apply mapped chars.
    for (const [lval, rval] of mappingProps) {
      // Left value can be empty/undefined.
      if (!lval) continue;

      const re = new RegExp(sanitizeRegExpString(lval), 'g');
      let matches;

      while ((matches = re.exec(fromStr)) !== null) {
        const lastIndex = matches.index + matches[0].normalize('NFD').length;

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

    let convertedStr = conversionArr.join('').normalize('NFC');
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
  static #applyGammaNasals(str: string, type: keyType): string {
    switch (type) {
      case keyType.BETA_CODE:
        return str.replace(/(g)(g|c|k|x)/gi, (match, first, second) => {
          if (first === first.toUpperCase()) return 'N' + second;
          else return 'n' + second;
        });

      case keyType.GREEK:
        return str.replace(/(ν)([γκξχ])/gi, (match, first, second) => {
          if (first === first.toUpperCase()) return 'Γ' + second;
          else return 'γ' + second;
        });

      case keyType.TRANSLITERATION:
        // The case of `ITransliterationStyle` options `xi_ks` &
        // `chi_kh` is covered by letter K.
        return str.replace(/(g)(g|k|x|ch)/gi, (match, first, second) => {
          if (first === first.toUpperCase()) return 'N' + second;
          else return 'n' + second;
        });

      default:
        console.warn(`keyType '${type}' is not implemented.`);
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
    fromType: keyType,
    toType: keyType
  ): Map<string, string> {
    let fromProp: string;
    let toProp: string;

    if (fromType === keyType.BETA_CODE) fromProp = 'bc';
    else if (fromType === keyType.GREEK) fromProp = 'gr';
    else if (fromType === keyType.TRANSLITERATION) fromProp = 'tr';
    else console.warn(`keyType '${fromType}' is not implemented.`);

    if (toType === keyType.BETA_CODE) toProp = 'bc';
    else if (toType === keyType.GREEK) toProp = 'gr';
    else if (toType === keyType.TRANSLITERATION) toProp = 'tr';
    else console.warn(`keyType '${toType}' is not implemented.`);

    let chars = [];

    for (const [i, v] of Object.entries(this)) {
      if (v[fromProp] !== undefined && v[toProp] !== undefined) {
        chars.push([v[fromProp], v[toProp]]);
      }
    }

    const sortedChars = chars.sort((a, b) => {
      return b[0].normalize('NFD').length - a[0].normalize('NFD').length;
    });

    if (!this.#removeDiacritics) {
      let diacritics = [];

      for (const [i, v] of Object.entries(this.DIACRITICS)) {
        if (v[fromProp] !== undefined && v[toProp] !== undefined) {
          diacritics.push([v[fromProp], v[toProp]]);
        }
      }

      return new Map([...sortedChars, ...diacritics]);
    }

    return new Map(sortedChars);
  }

  /**
   * Returns the instantiated transliteration style.
   *
   * @remarks
   * This is useful as `IConversionOption.setTransliterationStyle` can be either
   * an `ITransliterationStyle` interface or a `Style` enum (e.g. `Style.ALA_LC`)
   * that needs to be setup as `ITransliterationStyle` in the constructor.
   */
  getTransliterationStyle(): ITransliterationStyle {
    return this.#transliterationStyle;
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

    if (
      this.#useAdditionalChars === additionalChars.ALL ||
      this.#useAdditionalChars === additionalChars.STIGMA ||
      (Array.isArray(this.#useAdditionalChars) &&
        this.#useAdditionalChars.includes(additionalChars.STIGMA))
    ) {
      letters.push(this.CAPITAL_STIGMA, this.SMALL_STIGMA);
    }

    if (
      this.#useAdditionalChars === additionalChars.ALL ||
      this.#useAdditionalChars === additionalChars.STIGMA ||
      (Array.isArray(this.#useAdditionalChars) &&
        this.#useAdditionalChars.includes(additionalChars.STIGMA))
    ) {
      letters.push(this.CAPITAL_SAMPI, this.SMALL_SAMPI);
    }

    return letters.map((letter) =>
      letter.tr.normalize('NFD').charAt(0).normalize('NFC')
    );
  }
}
