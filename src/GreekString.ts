import { keyType } from './enums'
import { ConversionOptions } from './interfaces'
import { toBetaCode } from './toBetaCode'
import { toGreek } from './toGreek'
import { toTransliteration } from './toTransliteration'

export class GreekString {
  readonly from: keyType
  readonly options: ConversionOptions
  readonly source: string

  _beta_code: string
  _greek: string
  _transliteration: string

  constructor(str: string, from: keyType, options?: ConversionOptions) {
    this.from = from
    this.options = options ?? {}
    this.source = str

    switch (from) {
      case keyType.BETA_CODE:
        this._beta_code = toBetaCode(str, keyType.BETA_CODE, this.options)
        break

      case keyType.GREEK:
        this._greek = toGreek(str, keyType.GREEK, this.options)
        break

      case keyType.TRANSLITERATION:
        this._transliteration = toTransliteration(str, keyType.TRANSLITERATION, this.options)
        break
    }
  }

  get betaCode(): string {
    if (!this._beta_code) {
      switch (this.from) {
        case keyType.GREEK:
          this._beta_code = toBetaCode(this._greek, keyType.GREEK, this.options)
          break

        case keyType.TRANSLITERATION:
          this._beta_code = toBetaCode(this._transliteration, keyType.TRANSLITERATION, this.options)
          break
      }
    }

    return this._beta_code
  }

  get greek(): string {
    if (!this._greek) {
      switch (this.from) {
        case keyType.BETA_CODE:
          this._greek = toGreek(this._beta_code, keyType.BETA_CODE, this.options)
          break

        case keyType.TRANSLITERATION:
          this._greek = toGreek(this._transliteration, keyType.TRANSLITERATION, this.options)
          break
      }
    }

    return this._greek
  }

  get transliteration(): string {
    if (!this._transliteration) {
      switch (this.from) {
        case keyType.BETA_CODE:
          this._transliteration = toTransliteration(this._beta_code, keyType.BETA_CODE, this.options)
          break

        case keyType.GREEK:
          this._transliteration = toTransliteration(this._greek, keyType.GREEK, this.options)
          break
      }
    }

    return this._transliteration
  }
}
