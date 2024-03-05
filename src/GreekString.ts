import { KeyType, Preset } from './enums';
import { IConversionOptions, MixedPreset } from './interfaces';
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

    this.#handleConversion(this.#fromType);
  }

  #handleConversion(toType: KeyType): void {
    switch (toType) {
      case KeyType.BETA_CODE:
        this.#betaCode = toBetaCode(
          this.source,
          this.#fromType,
          this.#options,
          this.#mapping
        );
        break;

      case KeyType.GREEK:
        this.#greek = toGreek(
          this.source,
          this.#fromType,
          this.#options,
          this.#mapping
        );
        break;

      case KeyType.TRANSLITERATION:
        this.#transliteration = toTransliteration(
          this.source,
          this.#fromType,
          this.#options,
          this.#mapping
        );
        break;

      default:
        throw new RangeError(`KeyType '${toType}' is not implemented.`);
    }
  }

  get betaCode(): string {
    if (!this.#betaCode) this.#handleConversion(KeyType.BETA_CODE);
    return this.#betaCode;
  }

  get greek(): string {
    if (!this.#greek) this.#handleConversion(KeyType.GREEK);
    return this.#greek;
  }

  get transliteration(): string {
    if (!this.#transliteration) this.#handleConversion(KeyType.TRANSLITERATION);
    return this.#transliteration;
  }
}
