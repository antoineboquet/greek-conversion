import { RIGHT_SINGLE_QUOTATION_MARK, SMOOTH_BREATHING } from './Mapping';

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
  PSILI = SMOOTH_BREATHING,
  APOSTROPHE = RIGHT_SINGLE_QUOTATION_MARK,
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
