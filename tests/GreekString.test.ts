import { KeyType, GreekString } from '../src/index'

describe('GreekString', () => {
  test('From bc: Basic conversion', () => {
    const gs = new GreekString('a)/nqrwpos', KeyType.BETA_CODE)

    expect(gs.source).toBe('a)/nqrwpos')
    expect(gs.betaCode).toBe('a)/nqrwpos')
    expect(gs.greek).toBe('ἄνθρωπος')
    expect(gs.transliteration).toBe('ánthrōpos')
  })

  test('From gr: Basic conversion', () => {
    const gs = new GreekString('ἄνθρωπος', KeyType.GREEK)

    expect(gs.source).toBe('ἄνθρωπος')
    expect(gs.betaCode).toBe('a)/nqrwpos')
    expect(gs.greek).toBe('ἄνθρωπος')
    expect(gs.transliteration).toBe('ánthrōpos')
  })

  test('From tr: Basic conversion', () => {
    const gs = new GreekString('ánthrōpos', KeyType.TRANSLITERATION)

    expect(gs.source).toBe('ánthrōpos')
    expect(gs.betaCode).toBe('a)/nqrwpos')
    expect(gs.greek).toBe('ἄνθρωπος')
    expect(gs.transliteration).toBe('ánthrōpos')
  })

  test('From bc: Removing diacritics', () => {
    const gs = new GreekString('a)/nqrwpos', KeyType.BETA_CODE, { removeDiacritics: true })

    expect(gs.source).toBe('a)/nqrwpos')
    expect(gs.betaCode).toBe('anqrwpos')
    expect(gs.greek).toBe('ανθρωπος')
    expect(gs.transliteration).toBe('anthrōpos')
  })

  test('From gr: Removing diacritics', () => {
    const gs = new GreekString('ἄνθρωπος', KeyType.GREEK, { removeDiacritics: true })

    expect(gs.source).toBe('ἄνθρωπος')
    expect(gs.betaCode).toBe('anqrwpos')
    expect(gs.greek).toBe('ανθρωπος')
    expect(gs.transliteration).toBe('anthrōpos')
  })

  test('From tr: Removing diacritics', () => {
    const gs = new GreekString('ánthrōpos', KeyType.TRANSLITERATION, { removeDiacritics: true })

    expect(gs.source).toBe('ánthrōpos')
    expect(gs.betaCode).toBe('anqrwpos')
    expect(gs.greek).toBe('ανθρωπος')
    expect(gs.transliteration).toBe('anthrōpos')
  })

  test('From gr: Testing whitespace behavior', () => {
    const gs1 = new GreekString('αἴξ   κριός', KeyType.GREEK)
    const gs2 = new GreekString('αἴξ   κριός', KeyType.GREEK, { preserveWhitespace: true })

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
    const gs1 = new GreekString('βάρβαρος', KeyType.GREEK)
    const gs2 = new GreekString('βάρβαρος', KeyType.GREEK, {
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
    const gs1 = new GreekString('ανγελος', KeyType.GREEK)

    expect(gs1.source).toBe('ανγελος')
    expect(gs1.betaCode).toBe('angelos')
    expect(gs1.greek).toBe('αγγελος')
    expect(gs1.transliteration).toBe('angelos')

    const gs2 = new GreekString('σφίγξ, τυγχάνω', KeyType.GREEK)

    expect(gs2.source).toBe('σφίγξ, τυγχάνω')
    expect(gs2.betaCode).toBe('sfi/nc, tunxa/nw')
    expect(gs2.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs2.transliteration).toBe('sphínx, tunchánō')

    const gs3 = new GreekString('σφίγξ, τυγχάνω', KeyType.GREEK, {
      setTransliterationStyle: {
        xi_ks: true,
        chi_kh: true
      }
    })

    expect(gs3.source).toBe('σφίγξ, τυγχάνω')
    expect(gs3.betaCode).toBe('sfi/nc, tunxa/nw')
    expect(gs3.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs3.transliteration).toBe('sphínks, tunkhánō')
  })

  test('From tr: Testing gamma nasals', () => {
    const gs1 = new GreekString('aggelos', KeyType.TRANSLITERATION, { removeDiacritics: true })

    expect(gs1.source).toBe('aggelos')
    expect(gs1.betaCode).toBe('angelos')
    expect(gs1.greek).toBe('αγγελος')
    expect(gs1.transliteration).toBe('angelos')

    const gs2 = new GreekString('sphínx, tunchánō', KeyType.TRANSLITERATION)

    expect(gs2.source).toBe('sphínx, tunchánō')
    expect(gs2.betaCode).toBe('sfi/nc, tunxa/nw')
    expect(gs2.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs2.transliteration).toBe('sphínx, tunchánō')

    const gs3 = new GreekString('sphínks, tunkhánō', KeyType.TRANSLITERATION, {
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

  test('From tr: using circumflex on long vowels', () => {
    const gs = new GreekString('ánthrôpos', KeyType.TRANSLITERATION, {
      setTransliterationStyle: {
        useCxOverMacron: true
      }
    })

    expect(gs.source).toBe('ánthrôpos')
    expect(gs.betaCode).toBe('a)/nqrwpos')
    expect(gs.greek).toBe('ἄνθρωπος')
    expect(gs.transliteration).toBe('ánthrôpos')
  })
})
