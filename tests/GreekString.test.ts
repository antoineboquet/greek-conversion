import { keyType, GreekString } from '../src/index'

describe('GreekString', () => {
  const foo = new GreekString('anthrôpos', keyType.TRANSLITERATION)
  const bar = new GreekString('ἵππος', keyType.GREEK, { removeDiacritics: true })

  test('Testing `GreekString` object', () => {
    expect(foo.source).toBe('anthrôpos')
    expect(foo.betaCode).toBe('a)nqrwpos')
    expect(foo.greek).toBe('ἀνθρωπος')
    expect(foo.transliteration).toBe('anthrôpos')
  })

  test('Testing `GreekString` object w/ conversion options', () => {
    expect(bar.source).toBe('ἵππος')
    expect(bar.betaCode).toBe('ippos')
    expect(bar.greek).toBe('ἵππος') // later, we'll want `ιππος`
    expect(bar.transliteration).toBe('ippos')
  })
})
