import {
  isMappedChar,
  KeyType
} from '../src/index';
import { IConversionOptions } from '../src/interfaces';

describe('Testing utility functions', () => {

  test('Testing isMappedChar() w/ KeyType.BETA_CODE, KeyType.GREEK', () => {
    expect(isMappedChar('c', KeyType.BETA_CODE)).toBe(true);
    expect(isMappedChar('+', KeyType.BETA_CODE)).toBe(true); // diaeresis
    expect(isMappedChar('δ', KeyType.GREEK)).toBe(true);
    expect(isMappedChar('\u0313', KeyType.GREEK)).toBe(true); // smooth breathing
    expect(isMappedChar('µ', KeyType.BETA_CODE)).toBe(false);
    expect(isMappedChar('o', KeyType.GREEK)).toBe(false);
  });

  test('Testing isMappedChar() w/ KeyType.TRANSLITERATION', () => {
    const xi_ks: IConversionOptions = { transliterationStyle: { xi_ks: true }};
    const beta_v: IConversionOptions = { transliterationStyle: { beta_v: true }};

    expect(isMappedChar('a', KeyType.TRANSLITERATION)).toBe(true);
    expect(isMappedChar('ch', KeyType.TRANSLITERATION)).toBe(true);
    expect(isMappedChar('TH', KeyType.TRANSLITERATION)).toBe(true);
    expect(isMappedChar('\u0301', KeyType.TRANSLITERATION)).toBe(true); // acute
    expect(isMappedChar('?', KeyType.TRANSLITERATION)).toBe(true);
    expect(isMappedChar('v', KeyType.TRANSLITERATION, beta_v)).toBe(true);
    expect(isMappedChar('Ks', KeyType.TRANSLITERATION, xi_ks)).toBe(true);
    expect(isMappedChar('b', KeyType.TRANSLITERATION, beta_v)).toBe(false);
    expect(isMappedChar('x', KeyType.TRANSLITERATION, xi_ks)).toBe(false);
  });

});
