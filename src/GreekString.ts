import { keyType } from './enums'
import { toBetaCode } from './toBetaCode'
import { toGreek } from './toGreek'
import { toTransliteration } from './toTransliteration'
import { removeDiacritics, removeExtraWhitespace } from './utils'

export class GreekString {
  readonly from: keyType
  readonly options: ConversionOptions

  source: string

  _beta_code: string
  _greek: string
  _transliteration: string

  constructor(str: string, from: keyType, options?: ConversionOptions) {
    this.from = from
    this.options = options ?? {}

    this.source = str

    if (this.options.removeDiacritics) str = removeDiacritics(str, from)
    if (!this.options.preserveWhitespace) str = removeExtraWhitespace(str)

    switch (from) {
      case keyType.BETA_CODE:
        this._beta_code = str
        break

      case keyType.GREEK:
        this._greek = str
        break

      case keyType.TRANSLITERATION:
        this._transliteration = str
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
