import { keyType, GreekString } from '../src/index'

describe('GreekString', () => {
  const foo    = new GreekString('ánthrôpos', keyType.TRANSLITERATION)
  const bar    = new GreekString('ἵππος', keyType.GREEK, { removeDiacritics: true })
  const baz    = new GreekString('αἴξ   κριός', keyType.GREEK)
  const qux    = new GreekString('βάρβαρος', keyType.GREEK)
  const quux   = new GreekString('βάρβαρος', keyType.GREEK, { disableBetaVariant: true })
  const corge  = new GreekString('ανγελος', keyType.GREEK)
  const grault = new GreekString('aggelos', keyType.TRANSLITERATION)

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

  test('Testing `GreekString` object w/ beta variant', () => {
    expect(qux.source).toBe('βάρβαρος')
    expect(qux.greek).toBe('βάρϐαρος')
  })

  test('Testing `GreekString` object w/ conversion options (disableBetaVariant)', () => {
    expect(quux.source).toBe('βάρβαρος')
    expect(quux.greek).toBe('βάρβαρος')
  })

  test('Testing `GreekString` object w/ gamma diphthong (from greek)', () => {
    expect(corge.source).toBe('ανγελος')
    expect(corge.greek).toBe('αγγελος')
  })

  test('Testing `GreekString` object w/ gamma diphthong (from transliteration)', () => {
    expect(grault.source).toBe('aggelos')
    expect(grault.transliteration).toBe('angelos')
  })
})
