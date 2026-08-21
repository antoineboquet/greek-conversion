export enum AdditionalChar {
  ALL = 1,
  DIGAMMA,
  YOT,
  LUNATE_SIGMA,
  STIGMA,
  KOPPA,
  ARCHAIC_KOPPA,
  SAMPI
  //SAN
}

export enum Coronis {
  PSILI = '\u0313', // 'smooth breathing'
  APOSTROPHE = '\u2019', // 'right single quotation mark'
  NO = ''
}

export enum KeyType {
  GREEK = 'gr',
  BETA_CODE = 'bc',
  TLG_BETA_CODE = 'tlg',
  TRANSLITERATION = 'tr'
}

export enum Preset {
  ALA_LC,
  ALA_LC_MODERN,
  BNF_ADAPTED,
  ISO,
  SIMPLE_BC,
  SBL,
  TLG
}
