import { AdditionalChar, GreekString, KeyType, Preset } from '../src/index'
import { IConversionOptions } from '../src/interfaces'

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

    expect(gs1.source).toBe('αἴξ   κριός')
    expect(gs1.betaCode).toBe('ai)/c   krio/s')
    expect(gs1.greek).toBe('αἴξ   κριός')
    expect(gs1.transliteration).toBe('aíx   kriós')

    const gs2 = new GreekString('αἴξ   κριός', KeyType.GREEK, { removeExtraWhitespace: true })

    expect(gs2.source).toBe('αἴξ   κριός')
    expect(gs2.betaCode).toBe('ai)/c krio/s')
    expect(gs2.greek).toBe('αἴξ κριός')
    expect(gs2.transliteration).toBe('aíx kriós')
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

  test('Testing presets', () => {
    // Preset ALA_LC is not reversible; so, for instance, 's' are converted back
    // to lunate sigmas (as option `lunatesigma_s` is activated).
    const gs = new GreekString('ánthrōpos', KeyType.TRANSLITERATION, Preset.ALA_LC)

    expect(gs.source).toBe('ánthrōpos')
    expect(gs.betaCode).toBe('anqrwpos3')
    expect(gs.greek).toBe('ανθρωποϲ')
    expect(gs.transliteration).toBe('anthrōpos')
  })

  test('Testing mixed presets', () => {
    const gs1 = new GreekString(
      'ánthrōpos',
      KeyType.TRANSLITERATION,
      [Preset.ALA_LC, { removeDiacritics: false }]
    )

    expect(gs1.source).toBe('ánthrōpos')
    expect(gs1.betaCode).toBe('a)/nqrwpos3')
    expect(gs1.greek).toBe('ἄνθρωποϲ')
    expect(gs1.transliteration).toBe('ánthrōpos')

    const trStyleGs2: IConversionOptions = {
      setTransliterationStyle: {
        lunatesigma_s: false
      }
    }
    const gs2 = new GreekString('ἄνθρωπος', KeyType.GREEK, [Preset.ALA_LC, trStyleGs2])

    expect(gs2.source).toBe('ἄνθρωπος')
    expect(gs2.betaCode).toBe('anqrwpos')
    expect(gs2.greek).toBe('ανθρωπος')
    expect(gs2.transliteration).toBe('anthrōpos')

    const trStyleGs3: IConversionOptions = {
      useAdditionalChars: undefined
    }
    const gs3 = new GreekString('a)/nqrwpos3', KeyType.BETA_CODE, [Preset.ALA_LC, trStyleGs3])

    expect(gs3.source).toBe('a)/nqrwpos3')
    expect(gs3.betaCode).toBe('anqrwpos3')
    expect(gs3.greek).toBe('ανθρωποσ3')
    expect(gs3.transliteration).toBe('anthrōpos3')

    const trStyleGs4: IConversionOptions = {
      useAdditionalChars: AdditionalChar.DIGAMMA
    }
    const gs4 = new GreekString('a)/nqrwpos3', KeyType.BETA_CODE, [Preset.ALA_LC, trStyleGs4])

    expect(gs4.source).toBe('a)/nqrwpos3')
    expect(gs4.betaCode).toBe('anqrwpos3')
    expect(gs4.greek).toBe('ανθρωποσ3')
    expect(gs4.transliteration).toBe('anthrōpos3')

    const trStyleGs5: IConversionOptions = {
      useAdditionalChars: AdditionalChar.LUNATE_SIGMA,
      removeExtraWhitespace: true
    }
    const gs5 = new GreekString('a)/nqrwpos3', KeyType.BETA_CODE, [Preset.ALA_LC, trStyleGs5])
  
    expect(gs5.source).toBe('a)/nqrwpos3')
    expect(gs5.betaCode).toBe('anqrwpos3')
    expect(gs5.greek).toBe('ανθρωποϲ')
    expect(gs5.transliteration).toBe('anthrōpos')
  })

  test('Testing upsilon_y', () => {
    const options = {
      setTransliterationStyle: {
        upsilon_y: true
      }
    }
  
    const gs = new GreekString("πυρός, οὐρανός, ἄϋλος", KeyType.GREEK, options)
    expect(gs.transliteration).toBe('pyrós, ouranós, áÿlos')
  })
})
