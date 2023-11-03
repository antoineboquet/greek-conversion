import { additionalLetters, keyType } from './enums';
import { IConversionOptions } from './interfaces';

interface IMappingProperty {
  gr: string;
  bc?: string;
  tr?: string;
}

interface IMappingPropertiesMap {
  chars: Map<string, string>;
  diacritics: Map<string, string>;
}

export const GRAVE_ACCENT = '\u0300';
export const ACUTE_ACCENT = '\u0301';
export const CIRCUMFLEX = '\u0302';
export const LATIN_TILDE = '\u0303';
export const MACRON = '\u0304';
export const BREVE = '\u0306';
export const DIAERESIS = '\u0308';
export const SMOOTH_BREATHING = '\u0313';
export const ROUGH_BREATHING = '\u0314';
export const CEDILLA = '\u0327';
export const GREEK_TILDE = '\u0342'; // `Combining Greek Perispomeni`
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
      tr: IOTA_SUBSCRIPT
    } as IMappingProperty
  };

  constructor(options?: IConversionOptions) {
    if (options?.useAdditionalLetters) {
      if (
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.DIGAMMA ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.DIGAMMA))
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
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.YOT ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.YOT))
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
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.LUNATE_SIGMA ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.LUNATE_SIGMA))
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
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.STIGMA ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.STIGMA))
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
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.KOPPA ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.KOPPA))
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
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.SAMPI ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.SAMPI))
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
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.SAN ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.SAN))
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

    if (options?.setTransliterationStyle?.useCxOverMacron) {
      this.CAPITAL_ETA = {
        gr: 'Η',
        bc: 'H',
        tr: 'Ê'
      };
      this.SMALL_ETA = {
        gr: 'η',
        bc: 'h',
        tr: 'ê'
      };
      this.CAPITAL_OMEGA = {
        gr: 'Ω',
        bc: 'W',
        tr: 'Ô'
      };
      this.SMALL_OMEGA = {
        gr: 'ω',
        bc: 'w',
        tr: 'ô'
      };

      if (
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.STIGMA ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.STIGMA))
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
        options.useAdditionalLetters === additionalLetters.ALL ||
        options.useAdditionalLetters === additionalLetters.SAMPI ||
        (Array.isArray(options.useAdditionalLetters) &&
          options.useAdditionalLetters.includes(additionalLetters.SAMPI))
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

    if (options?.setTransliterationStyle?.chi_kh) {
      this.CAPITAL_CHI = {
        gr: 'Χ',
        bc: 'X',
        tr: 'Kh'
      };
      this.SMALL_CHI = {
        gr: 'χ',
        bc: 'x',
        tr: 'kh'
      };
    }

    if (options?.setTransliterationStyle?.xi_ks) {
      this.CAPITAL_XI = {
        gr: 'Ξ',
        bc: 'C',
        tr: 'Ks'
      };
      this.SMALL_XI = {
        gr: 'ξ',
        bc: 'c',
        tr: 'ks'
      };
    }
  }

  lettersWithCxOrMacron(options?: IConversionOptions): IMappingProperty[] {
    let letters = [
      this.CAPITAL_ETA,
      this.SMALL_ETA,
      this.CAPITAL_OMEGA,
      this.SMALL_OMEGA
    ];

    if (
      options?.useAdditionalLetters === additionalLetters.ALL ||
      options?.useAdditionalLetters === additionalLetters.STIGMA ||
      (Array.isArray(options.useAdditionalLetters) &&
        options?.useAdditionalLetters.includes(additionalLetters.STIGMA))
    ) {
      letters.push(this.CAPITAL_STIGMA, this.SMALL_STIGMA);
    }

    if (
      options?.useAdditionalLetters === additionalLetters.ALL ||
      options?.useAdditionalLetters === additionalLetters.STIGMA ||
      (Array.isArray(options.useAdditionalLetters) &&
        options?.useAdditionalLetters.includes(additionalLetters.STIGMA))
    ) {
      letters.push(this.CAPITAL_SAMPI, this.SMALL_SAMPI);
    }

    return letters;
  }

  getPropertiesAsMap(from: keyType, to: keyType): IMappingPropertiesMap {
    let chars = new Map();
    let diacritics = new Map();

    for (const [i, v] of Object.entries(this)) {
      if (from === keyType.BETA_CODE && v.bc !== undefined) {
        if (to === keyType.GREEK && v.gr !== undefined) chars.set(v.bc, v.gr);
        else if (to === keyType.TRANSLITERATION && v.tr !== undefined)
          chars.set(v.bc, v.tr);
      } else if (from === keyType.GREEK && v.gr !== undefined) {
        if (to === keyType.BETA_CODE && v.bc !== undefined)
          chars.set(v.gr, v.bc);
        else if (to === keyType.TRANSLITERATION && v.tr !== undefined)
          chars.set(v.gr, v.tr);
      } else if (from === keyType.TRANSLITERATION && v.tr !== undefined) {
        if (to === keyType.BETA_CODE && v.bc !== undefined)
          chars.set(v.tr, v.bc);
        else if (to === keyType.GREEK && v.gr !== undefined)
          chars.set(v.tr, v.gr);
      }
    }

    for (const [i, v] of Object.entries(this.DIACRITICS)) {
      if (from === keyType.BETA_CODE && v.bc !== undefined) {
        if (to === keyType.GREEK && v.gr !== undefined)
          diacritics.set(v.bc, v.gr);
        else if (to === keyType.TRANSLITERATION && v.tr !== undefined)
          diacritics.set(v.bc, v.tr);
      } else if (from === keyType.GREEK && v.gr !== undefined) {
        if (to === keyType.BETA_CODE && v.bc !== undefined)
          diacritics.set(v.gr, v.bc);
        else if (to === keyType.TRANSLITERATION && v.tr !== undefined)
          diacritics.set(v.gr, v.tr);
      } else if (from === keyType.TRANSLITERATION && v.tr !== undefined) {
        if (to === keyType.BETA_CODE && v.bc !== undefined)
          diacritics.set(v.tr, v.bc);
        else if (to === keyType.GREEK && v.gr !== undefined)
          diacritics.set(v.tr, v.gr);
      }
    }

    return {
      chars: chars,
      diacritics: diacritics
    };
  }
}
