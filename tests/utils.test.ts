import { keyType, isMappedKey, removeDiacritics } from '../src/index'

describe('isMappedKey', () => {
  test('Testing `isMappedKey` function',
    () => expect(isMappedKey('a', keyType.BETA_CODE)).toBe(true))
  test('Testing `isMappedKey` function',
    () => expect(isMappedKey('$', keyType.GREEK)).toBe(false))
})

describe('removeDiacritics', () => {
  test('Testing `removeDiacritics` function',
    () => expect(removeDiacritics('ai)/+dalos', keyType.BETA_CODE)).toBe('aidalos'))
  test('Testing `removeDiacritics` function',
    () => expect(removeDiacritics('ἀΐδαλος', keyType.GREEK)).toBe('αιδαλος'))
  test('Testing `removeDiacritics` function',
    () => expect(removeDiacritics('aḯdalos', keyType.TRANSLITERATION)).toBe('aidalos'))
  test('Testing `removeDiacritics` function',
    () => expect(removeDiacritics('hoplítês', keyType.TRANSLITERATION)).toBe('hoplitês'))
})
