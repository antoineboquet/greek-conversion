import { AdditionalChar, Coronis, KeyType, toGreek } from '../src/index'
import { IConversionOptions } from '../src/interfaces'

/*
 * Special characters:
 *   - \u03D0 = Greek Beta Symbol
 *   - \u03F2 = Greek Lunate Sigma Symbol
 *   - \u037E = Greek Question Mark
 */

const aristotle = {
  bc: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.',
  gr: 'Ἐκεῖναι μὲν δὴ φυσικῆς μετὰ κινήσεως γάρ, αὕτη δὲ ἑτέρας, εἰ μηδεμία αὐτοῖς ἀρχὴ κοινή.',
  grNoAcc: 'Εκειναι μεν δη φυσικης μετα κινησεως γαρ, αυτη δε ετερας, ει μηδεμια αυτοις αρχη κοινη.'
}

const thucydides = {
  trNoAcc: 'Hellēsin egeneto kai merei tini tōn barbarōn, hōs de eipein kai epi pleiston anthrōpōn.',
  grNoAcc: 'Ελλησιν εγενετο και μερει τινι των βαρβαρων, ως δε ειπειν και επι πλειστον ανθρωπων.'
}

const plato = {
  tr: 'Chalepón gé se elénxai, ō̃ Sṓkrates; all\' ouchì ka̓̀n paĩs se elénxeien hóti ouk alēthē̃ légeis?',
  trCx: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì ka̓̀n paĩs se elénxeien hóti ouk alêthễ légeis?',
  gr: 'Χαλεπόν γέ σε ἐλέγξαι, ὦ Σώκρατες· ἀλλ\' οὐχὶ κἂν παῖς σε ἐλέγξειεν ὅτι οὐκ ἀληθῆ λέγεις;'
}

describe('From beta code to greek', () => {

  // Basic conversion

  test.each`
    str                                | expected
    ${'a)/nqrwpos'}                    | ${'ἄνθρωπος'}
    ${'kalo\\s ka)gaqo/s'}             | ${'καλὸς κἀγαθός'}
    ${'au)to/nomos'}                   | ${'αὐτόνομος'}
    ${'poih|='}                        | ${'ποιῇ'}
    ${'A)/i+da'}                       | ${'Ἄϊδα'}
    ${'ba/rbaros'}                     | ${'βάρβαρος'}
    ${'O(pli/ths'}                     | ${'Ὁπλίτης'}
    ${'voi='}                          | ${'vοῖ'}
    ${'a(/gios3'}                      | ${'ἅγιοσ3'}
    ${'a)%27a%26ehi%27i%26owu%27u%26'} | ${'ἀ̆ᾱεηῐῑοωῠῡ'}
    ${aristotle.bc}                    | ${aristotle.gr}
  `('Basic conversion', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected) })

  // Removing diacritics

  test.each`
    str                                | expected
    ${'a)/nqrwpos'}                    | ${'ανθρωπος'}
    ${'kalo\\s ka)gaqo/s'}             | ${'καλος καγαθος'}
    ${'au)to/nomos'}                   | ${'αυτονομος'}
    ${'poih|='}                        | ${'ποιη'}
    ${'A)/i+da'}                       | ${'Αιδα'}
    ${'ba/rbaros'}                     | ${'βαρβαρος'}
    ${'O(pli/ths'}                     | ${'Οπλιτης'}
    ${'voi='}                          | ${'vοι'}
    ${'a(/gios3'}                      | ${'αγιοσ3'}
    ${'a)%27a%26ehi%27i%26owu%27u%26'} | ${'ααεηιιοωυυ'}
    ${aristotle.bc}                    | ${aristotle.grNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE, { removeDiacritics: true })).toBe(expected) })

  // Testing KeyType.TLG_BETA_CODE

  test.each`
    str               | expected
    ${'A)/NQRWPOS'}   | ${'ἄνθρωπος'}
    ${'A)/nqrwpos'}   | ${'ἄνθρωπος'}
    ${'a)/nqrwpos'}   | ${'ἄνθρωπος'}
    ${'*(OPLI/THS'}   | ${'Ὁπλίτης'}
    ${'*(Opli/ths'}   | ${'Ὁπλίτης'}
    ${'*(opli/ths'}   | ${'Ὁπλίτης'}
    ${'*)/AI+DA'}     | ${'Ἄϊδα'}
    ${'*)/ai+da'}     | ${'Ἄϊδα'}
    ${'*P*O*I*=H|'}   | ${'ΠΟΙῌ͂'}
    ${'*p*o*i*=|h'}   | ${'ΠΟΙῌ͂'}
    ${'*(R*/O*D*O*S'} | ${'ῬΌΔΟΣ'}
    ${'*(r*/o*d*o*s'} | ${'ῬΌΔΟΣ'}
    `('Testing KeyType.TLG_BETA_CODE', ({ str, expected }) => expect(toGreek(str, KeyType.TLG_BETA_CODE)).toBe(expected))


  // Using beta variant

  test('Using beta variant', () => {
    expect(toGreek('ba/rbaros', KeyType.BETA_CODE, { greekStyle: { useBetaVariant: true } })).toBe('βάρ\u03D0αρος')
  })

  // Using lunate sigma

  test('Using lunate sigma', () => {
    expect(toGreek('I)hsou=s Xristo\\s Qeou= Ui(o\\s Swth/r', KeyType.BETA_CODE)).toBe('Ἰησοῦς Χριστὸς Θεοῦ Υἱὸς Σωτήρ')
    expect(toGreek('I)hsou=s Xristo\\s Qeou= Ui(o\\s Swth/r', KeyType.BETA_CODE, { greekStyle: { useLunateSigma: true } })).toBe('Ἰη\u03F2οῦ\u03F2 Χρι\u03F2τὸ\u03F2 Θεοῦ Υἱὸ\u03F2 \u03F9ωτήρ')
  })

  // Testing rho rules

  test.each`
    str                | expected
    ${'Ro/dos'}        | ${'Ρόδος'}
    ${'R(o/dos'}       | ${'Ῥόδος'}
    ${'polu/rrizos'}   | ${'πολύρριζος'}
    ${'polu/r)r(izos'} | ${'πολύῤῥιζος'}
    ${'ma/rmaros'}     | ${'μάρμαρος'}
  `('Testing rho rules', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected) })

  // Using additional letters

  test('Using additional letters', () => {
    expect(toGreek('vVjJs3S3#2*#2#1*#1#3*#3#5*#5', KeyType.BETA_CODE, { additionalChars: AdditionalChar.ALL })).toBe('ϝϜ\u03F3\u037F\u03F2\u03F9\u03DB\u03DAϟϞϙϘϡϠ')
    expect(toGreek('vVs3S3', KeyType.BETA_CODE, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('ϝϜ\u03F2\u03F9')
    expect(toGreek('#1*#1#3*#3#5*#5', KeyType.BETA_CODE, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('#1*#1#3*#3#5*#5')
  })

  // Testing uppercase writing

  test.each`
    str               | expected
    ${'BA/RBAROS'}    | ${'ΒΆΡΒΑΡΟΣ'}
    ${'R(O/DOS'}      | ${'ῬΌΔΟΣ'}
    ${'POLU/RRIZOS'}  | ${'ΠΟΛΎΡΡΙΖΟΣ'}
    ${'SUSSEISMO/S'}  | ${'ΣΥΣΣΕΙΣΜΌΣ'}
    ${'A)YEGH/S'}     | ${'ἈΨΕΓΉΣ'}
    ${'UI(O/S'}       | ${'ΥἹΌΣ'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected) })

  // Testing whitespace behavior

  test('Testing whitespace behavior', () => {
    expect(toGreek('ai)/c   krio/s', KeyType.BETA_CODE)).toBe('αἴξ   κριός')
    expect(toGreek('ai)/c   krio/s', KeyType.BETA_CODE, { removeExtraWhitespace: true })).toBe('αἴξ κριός')
  })

  // Testing various diacritics order

  test.each`
    str       | expected
    ${'w(|='} | ${'ᾧ'}
    ${'w(=|'} | ${'ᾧ'}
    ${'w|(='} | ${'ᾧ'}
    ${'w|=('} | ${'ᾧ'}
    ${'w=(|'} | ${'ᾧ'}
    ${'w=|('} | ${'ᾧ'} 
  `('Testing various diacritics order', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected) })

  // Testing beta code string normalization

  test.each`
    str                   | expected
    ${'ánqrwpos'}         | ${'ανθρωπος'}
    ${'h̔méra'}            | ${'ημερα'}
    ${'a(/gios, o)/ros.'} | ${'ἅγιος, ὄρος.'}
    ${'a))nh//r'}         | ${'ἀνήρ'}
  `('Testing beta code string normalization', ({ str, expected }) => expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected))

  // Using monotonic orthography

  test.each`
    str                    | expected
    ${'a)/nqrwpos'}         | ${'άνθρωπος'}
    ${'kalo\\s ka)gaqo/s'} | ${'καλος καγαθός'}
    ${'poih=|'}            | ${'ποιη'}
    ${'A)/i+da'}           | ${'Άϊδα'}
  `('Using monotonic orthography', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE, { greekStyle: { useMonotonicOrthography: true } })).toBe(expected) })
  
})

describe('From transliteration to greek', () => {

  // Basic conversion

  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'ἄνθρωπος'}
    ${'kalòs ka̓gathós'} | ${'καλὸς κἀγαθός'}
    ${'autónomos'}      | ${'αὐτόνομος'}
    ${'huiós'}          | ${'υἱός'}
    ${'Huiós'}          | ${'Υἱός'}
    ${'poiȩ̄̃'}           | ${'ποιῇ'}
    ${'Áïda'}           | ${'Ἄϊδα'}
    ${'bárbaros'}       | ${'βάρβαρος'}
    ${'Húsiris'}        | ${'Ὕσιρις'}
    ${'ō̧ṓdēs'}          | ${'ᾠώδης'}
    ${'woĩ'}            | ${'wοῖ'}
    ${'hágioc'}         | ${'ἅγιοc'}
    ${'Xenophȭn'}       | ${'Ξενοφῶν'}
    ${'chorēgéō'}       | ${'χορηγέω'}
    ${'ăāeēĭīoōŭū'}     | ${'ἀ̆ᾱεηῐῑοωῠῡ'}
    ${'ēēȩ̄̃ōōō̧'}         | ${'ἠηῇωωῳ'}
    ${plato.tr}         | ${plato.gr} 
  `('Basic conversion', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Removing diacritics

  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'ανθρωπος'}
    ${'kalòs ka̓gathós'} | ${'καλος καγαθος'}
    ${'autónomos'}      | ${'αυτονομος'}
    ${'huiós'}          | ${'υιος'}
    ${'Huiós'}          | ${'Υιος'}
    ${'poiȩ̄̃'}           | ${'ποιη'}
    ${'Áïda'}           | ${'Αιδα'}
    ${'bárbaros'}       | ${'βαρβαρος'}
    ${'Húsiris'}        | ${'Υσιρις'}
    ${'ō̧ṓdēs'}          | ${'ωωδης'}
    ${'woĩ'}            | ${'wοι'}
    ${'hágioc'}         | ${'αγιοc'}
    ${'Xenophȭn'}       | ${'Ξενοφων'}
    ${'chorēgéō'}       | ${'χορηγεω'}
    ${'ăāeēĭīoōŭū'}     | ${'ααεηιιοωυυ'}
    ${'ēēȩ̄̃ōōō̧'}         | ${'ηηηωωω'}
    ${thucydides.trNoAcc} | ${thucydides.grNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { removeDiacritics: true })).toBe(expected) })

  // Testing breathings placement rules

  test.each`
    str             | expected
    ${'Ēṓs'}        | ${'Ἠώς'}
    ${'aísthēsis'}  | ${'αἴσθησις'}
    ${'Aĩa'}        | ${'Αἶα'}
    ${'áülos'}      | ${'ἄϋλος'}
    ${'huḯdion'}    | ${'ὑΐδιον'}
  `('Testing breathings placement rules', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing coronides

  test.each`
    str        | expected
    ${'ka̓gṓ'}  | ${'κἀγώ'}
    ${'ka̓́n'}   | ${'κἄν'}
    ${'ka’gṓ'} | ${'κα’γώ'}
    ${'ká’n'}  | ${'κά’ν'}
  `('Testing coronides', ({ str, expected }) => expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected))

  // Testing coronides, using coronis style
  
  test.each`
    str       | expected
    ${'ka̓gṓ'} | ${'κἀγώ'}
    ${'ka̓́n'}  | ${'κἄν'}
    ${'ká’n'} | ${'κά’ν'}
  `('Testing coronides, using coronis style (PSILI)', ({ str, expected }) => expect(toGreek(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.PSILI } })).toBe(expected))

  test.each`
    str        | expected
    ${'ka’gṓ'} | ${'κἀγώ'}
    ${'ká’n'}  | ${'κἄν'}
    ${'ka̓́n'}   | ${'κἄν'}
  `('Testing coronides, using coronis style (APOSTROPHE)', ({ str, expected }) => expect(toGreek(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.APOSTROPHE } })).toBe(expected))

  test.each`
    str        | expected
    ${'ka̓gṓ'}  | ${'κἀγώ'}
    ${'ka’gṓ'} | ${'κα’γώ'}
    ${'ka̓́n'}   | ${'κἄν'}
    ${'ká’n'}  | ${'κά’ν'}
  `('Testing coronides, using coronis style (NO)', ({ str, expected }) => expect(toGreek(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.NO } })).toBe(expected))

  // Testing gamma nasals

  test.each`
    str           | expected
    ${'ángelos'}  | ${'ἄγγελος'}
    ${'spóngos'}  | ${'σπόγγος'} 
    ${'ánkura'}   | ${'ἄγκυρα'}
    ${'sphínx'}   | ${'σφίγξ'} 
    ${'tunchánō'} | ${'τυγχάνω'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing gamma nasals with xi_ks / chi_kh enabled

  test.each`
    str           | expected
    ${'sphínks'}  | ${'σφίγξ'}
    ${'tunkhánō'} | ${'τυγχάνω'}
  `('Testing gamma nasals with xi_ks / chi_kh enabled', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { transliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Using beta variant

  test('Using beta variant', () => {
    expect(toGreek('bárbaros', KeyType.TRANSLITERATION, { greekStyle: { useBetaVariant: true } })).toBe('βάρ\u03D0αρος')
  })

  // Using lunate sigma

  test('Using lunate sigma', () => {
    expect(toGreek('Iēsoũs Christòs Theoũ Huiòs Sōtḗr', KeyType.TRANSLITERATION)).toBe('Ἰησοῦς Χριστὸς Θεοῦ Υἱὸς Σωτήρ')
    expect(toGreek('Iēsoũs Christòs Theoũ Huiòs Sōtḗr', KeyType.TRANSLITERATION, { greekStyle: { useLunateSigma: true } })).toBe('Ἰη\u03F2οῦ\u03F2 Χρι\u03F2τὸ\u03F2 Θεοῦ Υἱὸ\u03F2 \u03F9ωτήρ')
  })

  // Using circumflex on long vowels

  test.each`
    str            | expected
    ${'ánthrôpos'} | ${'ἄνθρωπος'}
    ${'Hoplítês'}  | ${'Ὁπλίτης'}
    ${'Xenophỗn'}  | ${'Ξενοφῶν'}
    ${plato.trCx}  | ${plato.gr}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { transliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  // Testing rho rules

  test.each`
    str              | expected
    ${'Ródos'}       | ${'Ρόδος'}
    ${'Rhódos'}      | ${'Ῥόδος'}
    ${'polúrrizos'}  | ${'πολύρριζος'}
    ${'polúrrhizos'} | ${'πολύρριζος'}
    ${'mármaros'}    | ${'μάρμαρος'}
  `('Testing rho rules', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Applying beta_v
  test('Applying beta_v', () => {
    expect(toGreek('várvaros', KeyType.TRANSLITERATION, { transliterationStyle: { beta_v: true } }))
      .toBe('βάρβαρος')
  })

  // Applying eta_i

  test('Applying eta_i', () => {
    expect(toGreek('hīdonī́', KeyType.TRANSLITERATION, { transliterationStyle: { eta_i: true } }))
      .toBe('ἡδονή')
  })

  // Applying eta_i, using circumflex

  test('Applying eta_i', () => {
    expect(toGreek('hîdonî́', KeyType.TRANSLITERATION, { transliterationStyle: { useCxOverMacron: true, eta_i: true } }))
      .toBe('ἡδονή')
  })

  // Applying muPi_b

  test('Applying muPi_b', () => {
    expect(toGreek('Brant Pit', KeyType.TRANSLITERATION, { transliterationStyle: { muPi_b: true } }))
      .toBe('Βραντ Πιτ')
  })

  // Applying muPi_b, with beta_v

  test('Applying muPi_b, with beta_v', () => {
    expect(toGreek('Brant Pit', KeyType.TRANSLITERATION, { transliterationStyle: { muPi_b: true, beta_v: true } }))
      .toBe('Μπραντ Πιτ')
  })

  // Applying nuTau_d
  
  test('Applying nuTau_d', () => {
    expect(toGreek('D̲aíēbint Mítsel', KeyType.TRANSLITERATION, { transliterationStyle: { nuTau_d: true } }))
      .toBe('Νταίηβιντ Μίτσελ')
  })

  // Applying phi_f

  test.each`
    str            | expected
    ${'fantasía'}  | ${'φαντασία'}
    ${'Fainṓ'}     | ${'Φαινώ'}
    ${'FILOSOFIA'} | ${'ΦΙΛΟΣΟΦΙΑ'}
  `('Applying phi_f', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { transliterationStyle: { phi_f: true } })).toBe(expected) })

  // Applying xi_ks / chi_kh

  test.each`
    str            | expected
    ${'Ksenophȭn'} | ${'Ξενοφῶν'}
    ${'khorēgéō'}  | ${'χορηγέω'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { transliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Applying upsilon_y

  test.each`
    str            | expected
    ${'hybrís'}    | ${'ὑβρίς'}
    ${'autómatos'} | ${'αὐτόματος'}
    ${'áÿlos'}     | ${'ἄϋλος'}
    ${'hyḯdion'}   | ${'ὑΐδιον'}
    ${'hýdōr'}     | ${'ὕδωρ'}
    ${'Hýbla'}     | ${'Ὕβλα'}
    ${'ý hỹ'}      | ${'ὔ ὗ'}
  `('Applying upsilon_y', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { transliterationStyle: { upsilon_y: true } })).toBe(expected) })

  // Using additional letters

  test('Using additional letters', () => {
    expect(toGreek('wWjJcCc̄C̄qQḳḲs̄S̄', KeyType.TRANSLITERATION, { additionalChars: AdditionalChar.ALL })).toBe('ϝϜ\u03F3\u037F\u03F2\u03F9\u03DB\u03DAϟϞϙϘϡϠ')
    expect(toGreek('wWcC', KeyType.TRANSLITERATION, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('ϝϜ\u03F2\u03F9')
    expect(toGreek('qQḳḲs̄S̄', KeyType.TRANSLITERATION, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('qQκ̣Κ̣σ̄Σ̄')
  })

  // Testing uppercase writing

  test.each`
    str              | expected
    ${'BÁRBAROS'}    | ${'ΒΆΡΒΑΡΟΣ'}
    ${'RHÓDOS'}      | ${'ῬΌΔΟΣ'}
    ${'POLÚRRHIZOS'} | ${'ΠΟΛΎΡΡΙΖΟΣ'}
    ${'SUSSEISMÓS'}  | ${'ΣΥΣΣΕΙΣΜΌΣ'}
    ${'APSEGḖS'}     | ${'ἈΨΕΓΉΣ'}
    ${'HUIÓS'}       | ${'ΥἹΌΣ'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing whitespace behavior

  test('Testing whitespace behavior', () => {
    expect(toGreek('aíx   kriόs', KeyType.TRANSLITERATION)).toBe('αἴξ   κριός')
    expect(toGreek('aíx   kriόs', KeyType.TRANSLITERATION, { removeExtraWhitespace: true })).toBe('αἴξ κριός')
  })

  // Testing correctness with various word separators

  test('Testing correctness with various word separators', () => {
    expect(toGreek('Ródos\nRódos\tRódos Ródos Ródos.', KeyType.TRANSLITERATION)).toBe('Ρόδος\nΡόδος\tΡόδος Ρόδος Ρόδος.')
    expect(toGreek('Rhódos\nRhódos\tRhódos Rhódos Rhódos.', KeyType.TRANSLITERATION)).toBe('Ῥόδος\nῬόδος\tῬόδος Ῥόδος Ῥόδος.')
  })

  // Using monotonic orthography

  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'άνθρωπος'}
    ${'kalòs ka̓gathós'} | ${'καλος καγαθός'}
    ${'poiȩ̄̃'}           | ${'ποιη'}
    ${'Áïda'}           | ${'Άϊδα'}
  `('Using monotonic orthography', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { greekStyle: { useMonotonicOrthography: true } })).toBe(expected) })
  
})

describe('Self-conversion', () => {

  // Testing gamma nasals

  test.each`
    str          | expected
    ${'ἄνγελος'} | ${'ἄγγελος'}
    ${'σπόνγος'} | ${'σπόγγος'} 
    ${'ἄνκυρα'}  | ${'ἄγκυρα'}
    ${'σφίνξ'}   | ${'σφίγξ'} 
    ${'τυνχάνω'} | ${'τυγχάνω'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toGreek(str, KeyType.GREEK)).toBe(expected) })

  // Using beta variant

  test('Using beta variant', () => {
    const options: IConversionOptions = {
      greekStyle: {
        useBetaVariant: true
      }
    }
    expect(toGreek('βάρβαρος', KeyType.GREEK)).toBe('βάρβαρος')
    expect(toGreek('βάρ\u03D0αρος', KeyType.GREEK)).toBe('βάρβαρος')
    expect(toGreek('βάρβαρος', KeyType.GREEK, options)).toBe('βάρ\u03D0αρος')
  })

  // Using greek question mark

  test('Using greek question mark', () => {
    const options: IConversionOptions = {
      greekStyle: {
        useGreekQuestionMark: true
      }
    }
    expect(toGreek('πῶς;', KeyType.GREEK)).toBe('πῶς;')
    expect(toGreek('πῶς\u037E', KeyType.GREEK)).toBe('πῶς;')
    expect(toGreek('πῶς;', KeyType.GREEK, options)).toBe('πῶς\u037E')
    expect(toGreek('πῶς\u037E', KeyType.GREEK, options)).toBe('πῶς\u037E')
  })

  // Using lunate sigma

  test('Using lunate sigma', () => {
    const options: IConversionOptions = {
      greekStyle: {
        useLunateSigma: true
      }
    }
    expect(toGreek('ἅγιος', KeyType.GREEK, options)).toBe('ἅγιο\u03F2')
  })

  // Using monotonic orthography

  test.each`
    str                | expected
    ${'ἄνθρωπος'}      | ${'άνθρωπος'}
    ${'καλὸς κἀγαθός'} | ${'καλος καγαθός'}
    ${'ποιῇ'}          | ${'ποιη'}
    ${'Ἄϊδα'}         | ${'Άϊδα'}
  `('Using monotonic orthography', ({ str, expected }) => { expect(toGreek(str, KeyType.GREEK, { greekStyle: { useMonotonicOrthography: true } })).toBe(expected) })
  
})
