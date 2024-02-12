export enum AdditionalChars {
  ALL = 'all',
  DIGAMMA = 'digamma',
  YOT = 'yot',
  LUNATE_SIGMA = 'lunate-sigma',
  STIGMA = 'stigma',
  KOPPA = 'koppa',
  SAMPI = 'sampi'
  //SAN = 'san'
}

export enum KeyType {
  GREEK = 'greek',
  BETA_CODE = 'beta-code',
  TRANSLITERATION = 'transliteration'
}

export enum Preset {
  ALA_LC = 'ala-lc',
  BNF = 'bnf',
  MODERN = 'modern',
  SBL = 'sbl',
  TLG = 'tlg'
}

export type BetaCodePreset = Preset.MODERN | Preset.TLG;
export type TransliterationPreset = Preset.ALA_LC | Preset.BNF | Preset.SBL;
