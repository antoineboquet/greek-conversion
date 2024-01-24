import { keyType, GreekString } from '../src/index'

describe('GreekString', () => {
  
  test('From bc: Basic conversion', () => {
    const gs = new GreekString('a)/nqrwpos', keyType.BETA_CODE)

    expect(gs.source).toBe('a)/nqrwpos')
    expect(gs.betaCode).toBe('a)/nqrwpos')
    expect(gs.greek).toBe('ἄνθρωπος')
    expect(gs.transliteration).toBe('ánthrōpos')
  })

  test('From gr: Basic conversion', () => {
    const gs = new GreekString('ἄνθρωπος', keyType.GREEK)

    expect(gs.source).toBe('ἄνθρωπος')
    expect(gs.betaCode).toBe('a)/nqrwpos')
    expect(gs.greek).toBe('ἄνθρωπος')
    expect(gs.transliteration).toBe('ánthrōpos')
  })

  test('From tr: Basic conversion', () => {
    const gs = new GreekString('ánthrōpos', keyType.TRANSLITERATION)

    expect(gs.source).toBe('ánthrōpos')
    expect(gs.betaCode).toBe('a)/nqrwpos')
    expect(gs.greek).toBe('ἄνθρωπος')
    expect(gs.transliteration).toBe('ánthrōpos')
  })

  test('From bc: Removing diacritics', () => {
    const gs = new GreekString('a)sth/r', keyType.BETA_CODE, { removeDiacritics: true })

    expect(gs.source).toBe('a)sth/r')
    expect(gs.betaCode).toBe('asthr')
    expect(gs.greek).toBe('αστηρ')
    expect(gs.transliteration).toBe('astēr')
  })

  test('From gr: Removing diacritics', () => {
    const gs = new GreekString('ἵππος', keyType.GREEK, { removeDiacritics: true })

    expect(gs.source).toBe('ἵππος')
    expect(gs.betaCode).toBe('ippos')
    expect(gs.greek).toBe('ιππος')
    expect(gs.transliteration).toBe('hippos')
  })

  test('From tr: Removing diacritics', () => {
    const gs1 = new GreekString('ánthrōpos', keyType.TRANSLITERATION, { removeDiacritics: true })

    expect(gs1.source).toBe('ánthrōpos')
    expect(gs1.betaCode).toBe('anqrwpos')
    expect(gs1.greek).toBe('ανθρωπος')
    expect(gs1.transliteration).toBe('anthrōpos')

    const gs2 = new GreekString('áülos', keyType.TRANSLITERATION, { removeDiacritics: true })
    
    expect(gs2.source).toBe('áülos')
    expect(gs2.betaCode).toBe('aulos')
    expect(gs2.greek).toBe('αυλος')
    expect(gs2.transliteration).toBe('aulos')
  })

  test('From gr: Testing whitespace behavior', () => {
    const gs1 = new GreekString('αἴξ   κριός', keyType.GREEK)
    const gs2 = new GreekString('αἴξ   κριός', keyType.GREEK, { preserveWhitespace: true })

    expect(gs1.source).toBe('αἴξ   κριός')
    expect(gs1.betaCode).toBe('ai)/c krio/s')
    expect(gs1.greek).toBe('αἴξ κριός')
    expect(gs1.transliteration).toBe('aíx kriós')

    expect(gs2.source).toBe('αἴξ   κριός')
    expect(gs2.betaCode).toBe('ai)/c   krio/s')
    expect(gs2.greek).toBe('αἴξ   κριός')
    expect(gs2.transliteration).toBe('aíx   kriós')
  })

  test('From gr: Enabling/Disabling beta variant', () => {
    const gs1 = new GreekString('βάρβαρος', keyType.GREEK)
    const gs2 = new GreekString('βάρβαρος', keyType.GREEK, {
      setGreekStyle: {
        disableBetaVariant: true
      }
    })

    expect(gs1.source).toBe('βάρβαρος')
    expect(gs1.betaCode).toBe('ba/rbaros')
    expect(gs1.greek).toBe('βάρ\u03D0αρος')
    expect(gs1.transliteration).toBe('bárbaros')

    expect(gs2.source).toBe('βάρβαρος')
    expect(gs1.betaCode).toBe('ba/rbaros')
    expect(gs2.greek).toBe('βάρβαρος')
    expect(gs1.transliteration).toBe('bárbaros')
  })

  test('From gr: Testing gamma nasals', () => {
    const gs = new GreekString('ανγελος', keyType.GREEK)

    expect(gs.source).toBe('ανγελος')
    expect(gs.betaCode).toBe('angelos')
    expect(gs.greek).toBe('αγγελος')
    expect(gs.transliteration).toBe('angelos')
  })

  test('From tr: Testing gamma nasals', () => {
    const gs1 = new GreekString('aggelos', keyType.TRANSLITERATION, { removeDiacritics: true })

    expect(gs1.source).toBe('aggelos')
    expect(gs1.betaCode).toBe('angelos')
    expect(gs1.greek).toBe('αγγελος')
    expect(gs1.transliteration).toBe('angelos')

    const gs2 = new GreekString('sphínx, tunchánō', keyType.TRANSLITERATION)

    expect(gs2.source).toBe('sphínx, tunchánō')
    expect(gs2.betaCode).toBe('sfi/nc, tunxa/nw')
    expect(gs2.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs2.transliteration).toBe('sphínx, tunchánō')

    const gs3 = new GreekString('sphínks, tunkhánō', keyType.TRANSLITERATION, {
      setTransliterationStyle: {
        xi_ks: true,
        chi_kh: true
      }
    })

    expect(gs3.source).toBe('sphínks, tunkhánō')
    expect(gs3.betaCode).toBe('sfi/nc, tunxa/nw')
    expect(gs3.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs3.transliteration).toBe('sphínks, tunkhánō')
  })
})
