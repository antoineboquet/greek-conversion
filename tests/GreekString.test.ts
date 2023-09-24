import { keyType, GreekString } from '../src/index'

describe('GreekString', () => {
  const a = new GreekString('ánthrôpos', keyType.TRANSLITERATION)
  const b = new GreekString('ἵππος', keyType.GREEK, { removeDiacritics: true })
  const c = new GreekString('a)sth/r', keyType.BETA_CODE, { removeDiacritics: true })
  const d = new GreekString('áülos', keyType.TRANSLITERATION, { removeDiacritics: true })
  const e = new GreekString('αἴξ   κριός', keyType.GREEK)
  const f = new GreekString('αἴξ   κριός', keyType.GREEK, { preserveWhitespace: true })
  const g = new GreekString('βάρβαρος', keyType.GREEK)
  const h = new GreekString('βάρβαρος', keyType.GREEK, { disableBetaVariant: true /* greek only */ })
  const i = new GreekString('ανγελος', keyType.GREEK)
  const j = new GreekString('aggelos', keyType.TRANSLITERATION)

  test('Testing `GreekString` object', () => {
    expect(a.source).toBe('ánthrôpos')
    expect(a.betaCode).toBe('a)/nqrwpos')
    expect(a.greek).toBe('ἄνθρωπος')
    expect(a.transliteration).toBe('ánthrôpos')
  })

  test('Testing `GreekString` object w/ conversion options (removeDiacritics)', () => {
    expect(b.source).toBe('ἵππος')
    expect(b.betaCode).toBe('ippos')
    expect(b.greek).toBe('ιππος')
    expect(b.transliteration).toBe('ippos')
  })

  test('Testing `GreekString` object w/ conversion options (removeDiacritics)', () => {
    expect(c.source).toBe('a)sth/r')
    expect(c.betaCode).toBe('asthr')
    expect(c.greek).toBe('αστηρ')
    expect(c.transliteration).toBe('astêr')
  })

  test('Testing `GreekString` object w/ conversion options (removeDiacritics)', () => {
    expect(d.source).toBe('áülos')
    expect(d.betaCode).toBe('aulos')
    expect(d.greek).toBe('αυλος')
    expect(d.transliteration).toBe('aulos')
  })

  test('Testing `GreekString` object w/ extra whitespace', () => {
    expect(e.source).toBe('αἴξ   κριός')
    expect(e.betaCode).toBe('ai)/c krio/s')
    expect(e.greek).toBe('αἴξ κριός')
    expect(e.transliteration).toBe('aíx kriós')
  })

  test('Testing `GreekString` object w/ conversion options (preserveWhitespace)', () => {
    expect(f.source).toBe('αἴξ   κριός')
    expect(f.betaCode).toBe('ai)/c   krio/s')
    expect(f.greek).toBe('αἴξ   κριός')
    expect(f.transliteration).toBe('aíx   kriós')
  })

  test('Testing `GreekString` object w/ beta variant', () => {
    expect(g.source).toBe('βάρβαρος')
    expect(g.greek).toBe('βάρϐαρος')
  })

  test('Testing `GreekString` object w/ conversion options (disableBetaVariant)', () => {
    expect(h.source).toBe('βάρβαρος')
    expect(h.greek).toBe('βάρβαρος')
  })

  test('Testing `GreekString` object w/ gamma diphthong (from greek)', () => {
    expect(i.source).toBe('ανγελος')
    expect(i.greek).toBe('αγγελος')
  })

  test('Testing `GreekString` object w/ gamma diphthong (from transliteration)', () => {
    expect(j.source).toBe('aggelos')
    expect(j.transliteration).toBe('angelos')
  })
})
