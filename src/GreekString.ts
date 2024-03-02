import { KeyType, MixedPreset, Preset } from './enums';
import { IConversionOptions } from './interfaces';
import { Mapping } from './Mapping';
import { toBetaCode } from './toBetaCode';
import { toGreek } from './toGreek';
import { toTransliteration } from './toTransliteration';
import { handleOptions } from './utils';

export class GreekString {
  readonly #fromType: KeyType;
  readonly #options: IConversionOptions;
  readonly #mapping: Mapping;
  readonly source: string;

  #betaCode: string;
  #greek: string;
  #transliteration: string;

  constructor(
    str: string,
    fromType: KeyType,
    settings?: Preset | MixedPreset | IConversionOptions
  ) {
    const options = handleOptions(str, fromType, settings);

    this.#fromType = fromType;
    this.#options = options;
    this.#mapping = new Mapping(options);
    this.source = str;

    switch (this.#fromType) {
      case KeyType.BETA_CODE:
        this.#betaCode = toBetaCode(
          this.source,
          KeyType.BETA_CODE,
          this.#options,
          this.#mapping
        );
        break;

      case KeyType.GREEK:
        this.#greek = toGreek(
          this.source,
          KeyType.GREEK,
          this.#options,
          this.#mapping
        );
        break;

      case KeyType.TRANSLITERATION:
        this.#transliteration = toTransliteration(
          this.source,
          KeyType.TRANSLITERATION,
          this.#options,
          this.#mapping
        );
        break;

      default:
        console.warn(`KeyType '${this.#fromType}' is not implemented.`);
    }
  }

  get betaCode(): string {
    if (!this.#betaCode) {
      switch (this.#fromType) {
        case KeyType.GREEK:
          this.#betaCode = toBetaCode(
            this.source,
            KeyType.GREEK,
            this.#options,
            this.#mapping
          );
          break;

        case KeyType.TRANSLITERATION:
          this.#betaCode = toBetaCode(
            this.source,
            KeyType.TRANSLITERATION,
            this.#options,
            this.#mapping
          );
          break;

        default:
          console.warn(`KeyType '${this.#fromType}' is not implemented.`);
      }
    }

    return this.#betaCode;
  }

  get greek(): string {
    if (!this.#greek) {
      switch (this.#fromType) {
        case KeyType.BETA_CODE:
          this.#greek = toGreek(
            this.source,
            KeyType.BETA_CODE,
            this.#options,
            this.#mapping
          );
          break;

        case KeyType.TRANSLITERATION:
          this.#greek = toGreek(
            this.source,
            KeyType.TRANSLITERATION,
            this.#options,
            this.#mapping
          );
          break;

        default:
          console.warn(`KeyType '${this.#fromType}' is not implemented.`);
      }
    }

    return this.#greek;
  }

  get transliteration(): string {
    if (!this.#transliteration) {
      switch (this.#fromType) {
        case KeyType.BETA_CODE:
          this.#transliteration = toTransliteration(
            this.source,
            KeyType.BETA_CODE,
            this.#options,
            this.#mapping
          );
          break;

        case KeyType.GREEK:
          this.#transliteration = toTransliteration(
            this.source,
            KeyType.GREEK,
            this.#options,
            this.#mapping
          );
          break;

        default:
          console.warn(`KeyType '${this.#fromType}' is not implemented.`);
      }
    }

    return this.#transliteration;
  }
}
