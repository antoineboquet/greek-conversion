import { IConversionOptions } from './interfaces';

export enum AdditionalChar {
  ALL = 'all',
  DIGAMMA = 'digamma',
  YOT = 'yot',
  LUNATE_SIGMA = 'lunate-sigma',
  STIGMA = 'stigma',
  KOPPA = 'koppa',
  ARCHAIC_KOPPA = 'archaic-koppa',
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
  MODERN_BC = 'modern-bc',
  SBL = 'sbl'
  //TLG = 'tlg'
}

export type MixedPreset = [Preset, IConversionOptions];
