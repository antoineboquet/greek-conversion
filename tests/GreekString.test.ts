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
      greekStyle: {
        disableBetaVariant: true
      }
    })

    expect(gs1.source).toBe('βάρβαρος')
    expect(gs1.betaCode).toBe('ba/rbaros')
    expect(gs1.greek).toBe('βάρ\u03D0αρος')
    expect(gs1.transliteration).toBe('bárbaros')

    expect(gs2.source).toBe('βάρβαρος')
    expect(gs2.betaCode).toBe('ba/rbaros')
    expect(gs2.greek).toBe('βάρβαρος')
    expect(gs2.transliteration).toBe('bárbaros')
  })

  test('From gr: Testing gamma nasals', () => {
    const gs1 = new GreekString('αγγελος', KeyType.GREEK, {
      transliterationStyle: {
        gammaNasal_n: true
      }
    })

    expect(gs1.source).toBe('αγγελος')
    expect(gs1.betaCode).toBe('aggelos')
    expect(gs1.greek).toBe('αγγελος')
    expect(gs1.transliteration).toBe('angelos')

    const gs2 = new GreekString('σφίγξ, τυγχάνω', KeyType.GREEK, {
      transliterationStyle: {
        gammaNasal_n: true
      }
    })

    expect(gs2.source).toBe('σφίγξ, τυγχάνω')
    expect(gs2.betaCode).toBe('sfi/gc, tugxa/nw')
    expect(gs2.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs2.transliteration).toBe('sphínx, tunchánō')

    const gs3 = new GreekString('σφίγξ, τυγχάνω', KeyType.GREEK, {
      transliterationStyle: {
        gammaNasal_n: true,
        xi_ks: true,
        chi_kh: true
      }
    })

    expect(gs3.source).toBe('σφίγξ, τυγχάνω')
    expect(gs3.betaCode).toBe('sfi/gc, tugxa/nw')
    expect(gs3.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs3.transliteration).toBe('sphínks, tunkhánō')
  })

  test('From tr: Testing gamma nasals', () => {
    const gs1 = new GreekString('aggelos', KeyType.TRANSLITERATION, {
      removeDiacritics: true,
      transliterationStyle: {
        gammaNasal_n: true
      }
    })

    expect(gs1.source).toBe('aggelos')
    expect(gs1.betaCode).toBe('aggelos')
    expect(gs1.greek).toBe('αγγελος')
    expect(gs1.transliteration).toBe('angelos')

    const gs2 = new GreekString('sphínx, tunchánō', KeyType.TRANSLITERATION, {
      transliterationStyle: {
        gammaNasal_n: true
      }
    })

    expect(gs2.source).toBe('sphínx, tunchánō')
    expect(gs2.betaCode).toBe('sfi/gc, tugxa/nw')
    expect(gs2.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs2.transliteration).toBe('sphínx, tunchánō')

    const gs3 = new GreekString('sphínks, tunkhánō', KeyType.TRANSLITERATION, {
      transliterationStyle: {
        gammaNasal_n: true,
        xi_ks: true,
        chi_kh: true
      }
    })

    expect(gs3.source).toBe('sphínks, tunkhánō')
    expect(gs3.betaCode).toBe('sfi/gc, tugxa/nw')
    expect(gs3.greek).toBe('σφίγξ, τυγχάνω')
    expect(gs3.transliteration).toBe('sphínks, tunkhánō')
  })

  test('From tr: using circumflex on long vowels', () => {
    const gs = new GreekString('ánthrôpos', KeyType.TRANSLITERATION, {
      transliterationStyle: {
        useCxOverMacron: true
      }
    })

    expect(gs.source).toBe('ánthrôpos')
    expect(gs.betaCode).toBe('a)/nqrwpos')
    expect(gs.greek).toBe('ἄνθρωπος')
    expect(gs.transliteration).toBe('ánthrôpos')
  })

  test('Testing presets', () => {
    const gs = new GreekString('ánthrōpos', KeyType.TRANSLITERATION, Preset.ALA_LC)

    expect(gs.source).toBe('ánthrōpos')
    expect(gs.betaCode).toBe('anqrwpos')
    expect(gs.greek).toBe('ανθρωπος')
    expect(gs.transliteration).toBe('anthrōpos')
  })

  test('Testing mixed presets', () => {
    const gs1 = new GreekString(
      'ánthrōpos',
      KeyType.TRANSLITERATION,
      [Preset.ALA_LC, { removeDiacritics: false }]
    )

    expect(gs1.source).toBe('ánthrōpos')
    expect(gs1.betaCode).toBe('a)/nqrwpos')
    expect(gs1.greek).toBe('ἄνθρωπος')
    expect(gs1.transliteration).toBe('ánthrōpos')

    const trStyleGs2: IConversionOptions = {
      transliterationStyle: {
        lunatesigma_s: false
      }
    }
    const gs2 = new GreekString('ἄνθρωπος', KeyType.GREEK, [Preset.ALA_LC, trStyleGs2])

    expect(gs2.source).toBe('ἄνθρωπος')
    expect(gs2.betaCode).toBe('anqrwpos')
    expect(gs2.greek).toBe('ανθρωπος')
    expect(gs2.transliteration).toBe('anthrōpos')

    const trStyleGs3: IConversionOptions = {
      additionalChars: undefined
    }
    const gs3 = new GreekString('a)/nqrwpos3', KeyType.BETA_CODE, [Preset.ALA_LC, trStyleGs3])

    expect(gs3.source).toBe('a)/nqrwpos3')
    expect(gs3.betaCode).toBe('anqrwpos3')
    expect(gs3.greek).toBe('ανθρωποϲ')
    expect(gs3.transliteration).toBe('anthrōpos')

    const trStyleGs4: IConversionOptions = {
      additionalChars: AdditionalChar.DIGAMMA
    }
    const gs4 = new GreekString('a)/nqrwpos3', KeyType.BETA_CODE, [Preset.ALA_LC, trStyleGs4])

    expect(gs4.source).toBe('a)/nqrwpos3')
    expect(gs4.betaCode).toBe('anqrwpos3')
    expect(gs4.greek).toBe('ανθρωποϲ')
    expect(gs4.transliteration).toBe('anthrōpos')

    const trStyleGs5: IConversionOptions = {
      additionalChars: AdditionalChar.LUNATE_SIGMA,
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
      transliterationStyle: {
        upsilon_y: true
      }
    }
  
    const gs = new GreekString("πυρός, οὐρανός, ἄϋλος", KeyType.GREEK, options)
    expect(gs.transliteration).toBe('pyrós, ouranós, áÿlos')
  })

  test('Testing useLunateSigma', () => {
    // `AdditionalChar.LUNATE_SIGMA` is silently enabled.
    const options: IConversionOptions = {
      greekStyle: {
        useLunateSigma: true
      }
    }
  
    const gs = new GreekString('puróc, ouranóc, aüloc', KeyType.TRANSLITERATION, options)
    expect(gs.betaCode).toBe('puro/s3, ou)rano/s3, a)u+los3')
    expect(gs.greek).toBe('πυρόϲ, οὐρανόϲ, ἀϋλοϲ')
    expect(gs.transliteration).toBe('puróc, ouranóc, aüloc')
  })

  test('Testing lunatesigma_s', () => {
    // `AdditionalChar.LUNATE_SIGMA` is silently enabled.
    const options: IConversionOptions = {
      transliterationStyle: {
        lunatesigma_s: true
      }
    }
  
    const gs = new GreekString('puróc, ouranóc, aüloc', KeyType.TRANSLITERATION, options)
    expect(gs.betaCode).toBe('puro/s, ou)rano/s, a)u+los')
    expect(gs.greek).toBe('πυρός, οὐρανός, ἀϋλος')
    expect(gs.transliteration).toBe('purós, ouranós, aülos')
  })
  
  test('Testing useLunateSigma + lunatesigma_s', () => {
    // `AdditionalChar.LUNATE_SIGMA` is silently enabled.
    const options: IConversionOptions = {
      greekStyle: {
        useLunateSigma: true
      },
      transliterationStyle: {
        lunatesigma_s: true
      }
    }
  
    const gs = new GreekString('puróc, ouranóc, aüloc', KeyType.TRANSLITERATION, options)
    expect(gs.betaCode).toBe('puro/s, ou)rano/s, a)u+los')
    expect(gs.greek).toBe('πυρόϲ, οὐρανόϲ, ἀϋλοϲ')
    expect(gs.transliteration).toBe('purós, ouranós, aülos')
  })
})