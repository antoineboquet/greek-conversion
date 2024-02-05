import { keyType } from './enums';
import { IConversionOptions } from './interfaces';
import { Mapping } from './Mapping';
import { toBetaCode } from './toBetaCode';
import { toGreek } from './toGreek';
import { toTransliteration } from './toTransliteration';

export class GreekString {
  readonly #fromType: keyType;
  readonly #options: IConversionOptions;
  readonly #mapping: Mapping;
  readonly source: string;

  #betaCode: string;
  #greek: string;
  #transliteration: string;

  constructor(str: string, fromType: keyType, options?: IConversionOptions) {
    this.#fromType = fromType;
    this.#options = options;
    this.#mapping = new Mapping(options);
    this.source = str;

    switch (this.#fromType) {
      case keyType.BETA_CODE:
        this.#betaCode = toBetaCode(
          this.source,
          keyType.BETA_CODE,
          this.#options,
          this.#mapping
        );
        break;

      case keyType.GREEK:
        this.#greek = toGreek(
          this.source,
          keyType.GREEK,
          this.#options,
          this.#mapping
        );
        break;

      case keyType.TRANSLITERATION:
        this.#transliteration = toTransliteration(
          this.source,
          keyType.TRANSLITERATION,
          this.#options,
          this.#mapping
        );
        break;

      default:
        console.warn(`keyType '${this.#fromType}' is not implemented.`);
    }
  }

  get betaCode(): string {
    if (!this.#betaCode) {
      switch (this.#fromType) {
        case keyType.GREEK:
          this.#betaCode = toBetaCode(
            this.source,
            keyType.GREEK,
            this.#options,
            this.#mapping
          );
          break;

        case keyType.TRANSLITERATION:
          this.#betaCode = toBetaCode(
            this.source,
            keyType.TRANSLITERATION,
            this.#options,
            this.#mapping
          );
          break;

        default:
          console.warn(`keyType '${this.#fromType}' is not implemented.`);
      }
    }

    return this.#betaCode;
  }

  get greek(): string {
    if (!this.#greek) {
      switch (this.#fromType) {
        case keyType.BETA_CODE:
          this.#greek = toGreek(
            this.source,
            keyType.BETA_CODE,
            this.#options,
            this.#mapping
          );
          break;

        case keyType.TRANSLITERATION:
          this.#greek = toGreek(
            this.source,
            keyType.TRANSLITERATION,
            this.#options,
            this.#mapping
          );
          break;

        default:
          console.warn(`keyType '${this.#fromType}' is not implemented.`);
      }
    }

    return this.#greek;
  }

  get transliteration(): string {
    if (!this.#transliteration) {
      switch (this.#fromType) {
        case keyType.BETA_CODE:
          this.#transliteration = toTransliteration(
            this.source,
            keyType.BETA_CODE,
            this.#options,
            this.#mapping
          );
          break;

        case keyType.GREEK:
          this.#transliteration = toTransliteration(
            this.source,
            keyType.GREEK,
            this.#options,
            this.#mapping
          );
          break;

        default:
          console.warn(`keyType '${this.#fromType}' is not implemented.`);
      }
    }

    return this.#transliteration;
  }
}
