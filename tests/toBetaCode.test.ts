import { keyType, toBetaCode } from '../src/index'

test('Testing `toBetaCode` function', () => {
  // Greek (without diacritics)
  expect(toBetaCode('ανθρωπος', keyType.GREEK)).toBe('anqrwpos')
  expect(toBetaCode('α α', keyType.GREEK)).toBe('a a')

  // Greek (with diacritics)
  expect(toBetaCode('ἄνθρωπος', keyType.GREEK)).toBe('anqrwpos')
  expect(toBetaCode('ἵππος', keyType.GREEK)).toBe('ippos')

  // Transliteration
  expect(toBetaCode('anthrôpos', keyType.TRANSLITERATION)).toBe('anqrwpos')
  expect(toBetaCode('hippos', keyType.TRANSLITERATION)).toBe('ippos')
})
