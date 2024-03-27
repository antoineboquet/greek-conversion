import {
  AdditionalChar,
  Coronis,
  GreekString,
  KeyType,
  Preset,
  removeDiacritics,
  toBetaCode,
  toGreek,
  toTransliteration
} from '../src/index';

describe('Testing erroneous inputs', () => {

  test('Testing bad KeyType /w conversion functions', () => {
    expect(() => toBetaCode('foo', 0)).toThrow(RangeError);
    expect(() => toBetaCode('foo', 'badKeyType')).toThrow(RangeError);
    expect(() => toBetaCode('foo', KeyType.BAD_KEY_TYPE)).toThrow(RangeError);
    expect(() => toGreek('foo', 0)).toThrow(RangeError);
    expect(() => toGreek('foo', 'badKeyType')).toThrow(RangeError);
    expect(() => toGreek('foo', KeyType.BAD_KEY_TYPE)).toThrow(RangeError);
    expect(() => toTransliteration('foo', 0)).toThrow(RangeError);
    expect(() => toTransliteration('foo', 'badKeyType')).toThrow(RangeError);
    expect(() => toTransliteration('foo', KeyType.BAD_KEY_TYPE)).toThrow(RangeError);

    // The following are OK as they use the literal values defined by the KeyType enum.
    expect(toBetaCode('ἀνήρ', 'gr')).toBe('a)nh/r');
    expect(toGreek('anḗr', 'tr')).toBe('ἀνήρ');
    expect(toTransliteration('a)nh/r', 'bc')).toBe('anḗr');
  });

  test('Testing bad KeyType /w GreekString', () => {
    expect(() => new GreekString('foo', 0)).toThrow(RangeError);
    expect(() => new GreekString('foo', 'badKeyType')).toThrow(RangeError);
    expect(() => new GreekString('foo', KeyType.BAD_KEY_TYPE)).toThrow(RangeError);
    expect(() => new GreekString('foo', 'gr')).not.toThrow(RangeError);
  });

  test('Testing bad KeyType /w function removeDiacritics', () => {
    expect(() => removeDiacritics('foo', 0)).toThrow(RangeError);
    expect(() => removeDiacritics('foo', 'badKeyType')).toThrow(RangeError);
    expect(() => removeDiacritics('foo', KeyType.BAD_KEY_TYPE)).toThrow(RangeError);
    expect(() => removeDiacritics('foo', 'gr')).not.toThrow(RangeError);
  });

  test('Testing bad Preset /w conversion functions', () => {
    expect(() => toBetaCode('foo', KeyType.GREEK, 999)).toThrow(RangeError);
    expect(() => toBetaCode('foo', KeyType.GREEK, 'badPreset')).toThrow(RangeError);
    expect(() => toBetaCode('foo', KeyType.GREEK, [999, { removeDiacritics: true }])).toThrow(RangeError);
    expect(() => toBetaCode('foo', KeyType.GREEK, ['badPreset', { removeDiacritics: true }])).toThrow(RangeError);
    expect(() => toGreek('foo', KeyType.TRANSLITERATION, 999)).toThrow(RangeError);
    expect(() => toGreek('foo', KeyType.TRANSLITERATION, 'badPreset')).toThrow(RangeError);
    expect(() => toGreek('foo', KeyType.TRANSLITERATION, [999, { removeDiacritics: true }])).toThrow(RangeError);
    expect(() => toGreek('foo', KeyType.TRANSLITERATION, ['badPreset', { removeDiacritics: true }])).toThrow(RangeError);
    expect(() => toTransliteration('foo', KeyType.BETA_CODE, 999)).toThrow(RangeError);
    expect(() => toTransliteration('foo', KeyType.BETA_CODE, 'badPreset')).toThrow(RangeError);
    expect(() => toTransliteration('foo', KeyType.BETA_CODE, [999, { removeDiacritics: true }])).toThrow(RangeError);
    expect(() => toTransliteration('foo', KeyType.BETA_CODE, ['badPreset', { removeDiacritics: true }])).toThrow(RangeError);

    // The following are OK as an undefined enum member produces an empty object (= no preset).
    expect(() => toBetaCode('foo', KeyType.GREEK, Preset.BAD_PRESET)).not.toThrow(RangeError);
    expect(() => toGreek('foo', KeyType.TRANSLITERATION, Preset.BAD_PRESET)).not.toThrow(RangeError);
    expect(() => toTransliteration('foo', KeyType.BETA_CODE, Preset.BAD_PRESET)).not.toThrow(RangeError);

    // But the following are NOT OK as the first value in the array appears undefined.
    expect(() => toBetaCode('foo', KeyType.GREEK, [Preset.BAD_PRESET, { removeDiacritics: true }])).toThrow(RangeError);
    expect(() => toGreek('foo', KeyType.TRANSLITERATION, [Preset.BAD_PRESET, { removeDiacritics: true }])).toThrow(RangeError);
    expect(() => toTransliteration('foo', KeyType.BETA_CODE, [Preset.BAD_PRESET, { removeDiacritics: true }])).toThrow(RangeError);

    // The following are OK as they use the numeric values defined by the Preset enum.
    expect(() => toBetaCode('foo', KeyType.GREEK, 0)).not.toThrow(RangeError);
    expect(() => toGreek('foo', KeyType.TRANSLITERATION, 1)).not.toThrow(RangeError);
    expect(() => toTransliteration('foo', KeyType.BETA_CODE, 2)).not.toThrow(RangeError);
  });

  test('Testing bad Preset /w GreekString', () => {
    expect(() => new GreekString('foo', KeyType.BETA_CODE, 999)).toThrow(RangeError);
    expect(() => new GreekString('foo', KeyType.BETA_CODE, 'badPreset')).toThrow(RangeError);
    expect(() => new GreekString('foo', KeyType.BETA_CODE, [Preset.BAD_PRESET, { removeDiacritics: true }])).toThrow(RangeError);
    expect(() => new GreekString('foo', KeyType.BETA_CODE, Preset.BAD_PRESET)).not.toThrow(RangeError);
    expect(() => new GreekString('foo', KeyType.BETA_CODE, 3)).not.toThrow(RangeError);
  });

  test('Testing bad AdditionalChar', () => {
    // The following are OK and will silently fail to add chars to the mapping.
    expect(() => toBetaCode('foo', KeyType.GREEK, { additionalChars: 999 })).not.toThrow(RangeError);
    expect(() => toBetaCode('foo', KeyType.GREEK, { additionalChars: 'badAdditionalChar' })).not.toThrow(RangeError);
    expect(() => toBetaCode('foo', KeyType.GREEK, { additionalChars: AdditionalChar.BAD_CHAR })).not.toThrow(RangeError);
  });

  test('Testing bad Coronis', () => {
    // The following are OK and will silently use the defaut Coronis value.
    expect(() => toTransliteration('ka)/n', KeyType.BETA_CODE, { transliterationStyle: { setCoronisStyle: 999 } })).not.toThrow(RangeError);
    expect(() => toTransliteration('ka)/n', KeyType.BETA_CODE, { transliterationStyle: { setCoronisStyle: 'badCoronis' } })).not.toThrow(RangeError);
    expect(() => toTransliteration('ka)/n', KeyType.BETA_CODE, { transliterationStyle: { setCoronisStyle: Coronis.BAD_CORONIS } })).not.toThrow(RangeError);
  });

});
