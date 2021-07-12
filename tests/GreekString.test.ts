import { keyType, GreekString } from '../src/index'

describe('GreekString', () => {
  const foo = new GreekString('ánthrôpos', keyType.TRANSLITERATION)
  const bar = new GreekString('ἵππος', keyType.GREEK, { removeDiacritics: true })
  const baz = new GreekString('αἴξ   κριός', keyType.GREEK)

  test('Testing `GreekString` object', () => {
    expect(foo.source).toBe('ánthrôpos')
    expect(foo.betaCode).toBe('a)/nqrwpos')
    expect(foo.greek).toBe('ἄνθρωπος')
    expect(foo.transliteration).toBe('ánthrôpos')
  })

  test('Testing `GreekString` object w/ conversion options (removeDiacritics)', () => {
    expect(bar.source).toBe('ἵππος')
    expect(bar.betaCode).toBe('ippos')
    expect(bar.greek).toBe('ιππος')
    expect(bar.transliteration).toBe('ippos')
  })

  test('Testing `GreekString` object w/ extra whitespace', () => {
    expect(baz.source).toBe('αἴξ   κριός')
    expect(baz.betaCode).toBe('ai)/c krio/s')
    expect(baz.greek).toBe('αἴξ κριός')
    expect(baz.transliteration).toBe('aíx kriós')
  })
})
