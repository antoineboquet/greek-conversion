import { keyType } from './enums';
import { IConversionOptions } from './interfaces';
import { Mapping } from './Mapping';
import { toBetaCode } from './toBetaCode';
import { toGreek } from './toGreek';
import { toTransliteration } from './toTransliteration';

export class GreekString {
  readonly #from: keyType;
  readonly #options: IConversionOptions;
  readonly #mapping: Mapping;
  readonly source: string;

  #betaCode: string;
  #greek: string;
  #transliteration: string;

  constructor(str: string, from: keyType, options?: IConversionOptions) {
    this.#from = from;
    this.#options = options ?? {};
    this.#mapping = new Mapping(options);
    this.source = str;

    switch (this.#from) {
      case keyType.BETA_CODE:
        this.#betaCode = toBetaCode(
          str,
          keyType.BETA_CODE,
          this.#options,
          this.#mapping
        );
        break;

      case keyType.GREEK:
        this.#greek = toGreek(str, keyType.GREEK, this.#options, this.#mapping);
        break;

      case keyType.TRANSLITERATION:
        this.#transliteration = toTransliteration(
          str,
          keyType.TRANSLITERATION,
          this.#options,
          this.#mapping
        );
        break;
    }
  }

  get betaCode(): string {
    if (!this.#betaCode) {
      switch (this.#from) {
        case keyType.GREEK:
          this.#betaCode = toBetaCode(
            this.#greek,
            keyType.GREEK,
            this.#options,
            this.#mapping
          );
          break;

        case keyType.TRANSLITERATION:
          this.#betaCode = toBetaCode(
            this.#transliteration,
            keyType.TRANSLITERATION,
            this.#options,
            this.#mapping
          );
          break;
      }
    }

    return this.#betaCode;
  }

  get greek(): string {
    if (!this.#greek) {
      switch (this.#from) {
        case keyType.BETA_CODE:
          this.#greek = toGreek(
            this.#betaCode,
            keyType.BETA_CODE,
            this.#options,
            this.#mapping
          );
          break;

        case keyType.TRANSLITERATION:
          this.#greek = toGreek(
            this.#transliteration,
            keyType.TRANSLITERATION,
            this.#options,
            this.#mapping
          );
          break;
      }
    }

    return this.#greek;
  }

  get transliteration(): string {
    if (!this.#transliteration) {
      switch (this.#from) {
        case keyType.BETA_CODE:
          this.#transliteration = toTransliteration(
            this.#betaCode,
            keyType.BETA_CODE,
            this.#options,
            this.#mapping
          );
          break;

        case keyType.GREEK:
          this.#transliteration = toTransliteration(
            this.#greek,
            keyType.GREEK,
            this.#options,
            this.#mapping
          );
          break;
      }
    }

    return this.#transliteration;
  }
}
