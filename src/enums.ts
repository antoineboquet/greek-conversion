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
  GREEK,
  BETA_CODE,
  TLG_BETA_CODE,
  TRANSLITERATION
}

export enum Preset {
  ALA_LC,
  ALA_LC_MODERN,
  BNF,
  ISO,
  MODERN_BC,
  SBL,
  TLG
}
