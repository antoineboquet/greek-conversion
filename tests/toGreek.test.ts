import { AdditionalChar, KeyType, toGreek } from '../src/index'

/*
 * Special characters:
 *   - \u03D0 = Greek Beta Symbol
 *   - \u03F2 = Greek Lunate Sigma Symbol
 */

const aristotle = {
  bc: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.',
  gr: 'Ἐκεῖναι μὲν δὴ φυσικῆς μετὰ κινήσεως γάρ, αὕτη δὲ ἑτέρας, εἰ μηδεμία αὐτοῖς ἀρχὴ κοινή.',
  grNoAcc: 'Εκειναι μεν δη φυσικης μετα κινησεως γαρ, αυτη δε ετερας, ει μηδεμια αυτοις αρχη κοινη.'
}

const thucydides = {
  trNoAcc: 'Hellēsin egeneto kai merei tini tōn barbarōn, hōs de eipein kai epi pleiston anthrōpōn.',
  grNoAcc: 'Ελλησιν εγενετο και μερει τινι των βαρϐαρων, ως δε ειπειν και επι πλειστον ανθρωπων.'
}

const plato = {
  tr: 'Chalepón gé se elénxai, ō̃ Sṓkrates; all\' ouchì ka̓̀n paĩs se elénxeien hóti ouk alēthē̃ légeis?',
  trCx: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì ka̓̀n paĩs se elénxeien hóti ouk alêthễ légeis?',
  gr: 'Χαλεπόν γέ σε ἐλέγξαι, ὦ Σώκρατες· ἀλλ\' οὐχὶ κἂν παῖς σε ἐλέγξειεν ὅτι οὐκ ἀληθῆ λέγεις\u037E'
}

describe('From beta code to greek', () => {
  test.each`
    str                                | expected
    ${'a)/nqrwpos'}                    | ${'ἄνθρωπος'}
    ${'kalo\\s ka)gaqo/s'}             | ${'καλὸς κἀγαθός'}
    ${'au)to/nomos'}                   | ${'αὐτόνομος'}
    ${'poih|='}                        | ${'ποιῇ'}
    ${'A)/i+da'}                       | ${'Ἄϊδα'}
    ${'ba/rbaros'}                     | ${'βάρ\u03D0αρος'}
    ${'O(pli/ths'}                     | ${'Ὁπλίτης'}
    ${'voi='}                          | ${'vοῖ'}
    ${'a(/gios3'}                      | ${'ἅγιοσ3'}
    ${'a)%27a%26ehi%27i%26owu%27u%26'} | ${'ἀ̆ᾱεηῐῑοωῠῡ'}
    ${aristotle.bc}                    | ${aristotle.gr}
  `('Basic conversion', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected) })

  test.each`
    str                                | expected
    ${'a)/nqrwpos'}                    | ${'ανθρωπος'}
    ${'kalo\\s ka)gaqo/s'}             | ${'καλος καγαθος'}
    ${'au)to/nomos'}                   | ${'αυτονομος'}
    ${'poih|='}                        | ${'ποιη'}
    ${'A)/i+da'}                       | ${'Αιδα'}
    ${'ba/rbaros'}                     | ${'βαρ\u03D0αρος'}
    ${'O(pli/ths'}                     | ${'Οπλιτης'}
    ${'voi='}                          | ${'vοι'}
    ${'a(/gios3'}                      | ${'αγιοσ3'}
    ${'a)%27a%26ehi%27i%26owu%27u%26'} | ${'ααεηιιοωυυ'}
    ${aristotle.bc}                    | ${aristotle.grNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE, { removeDiacritics: true })).toBe(expected) })

  // v0.13
  /*test.each`
    str             | expected
    ${')/ANQRWPOS'} | ${'ἄνθρωπος'}
    ${'POIH|='}     | ${'ποιῇ'}
    ${')/*AI+DA'}   | ${'Ἄϊδα'}
    ${'BA/RBAROS'}  | ${'βάρ\u03D0αρος'}
    ${'(*OPLI/THS'} | ${'Ὁπλίτης'}
    ${'(*Opli/ths'} | ${'Ὁπλίτης'}
    ${'NOI='}       | ${'vοῖ'}
    ${'(/AGIOS3'}   | ${'ἅγιοσ3'}
  `('Testing TLG preset', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE, Preset.TLG)).toBe(expected) })*/

  test('Disabling beta variant', () => {
    expect(toGreek('ba/rbaros', KeyType.BETA_CODE, { setGreekStyle: { disableBetaVariant: true } })).toBe('βάρβαρος')
  })

  test('Using lunate sigma', () => {
    expect(toGreek('I)hsou=s Xristo\\s Qeou= Ui(o\\s Swth/r', KeyType.BETA_CODE)).toBe('Ἰησοῦς Χριστὸς Θεοῦ Υἱὸς Σωτήρ')
    expect(toGreek('I)hsou=s Xristo\\s Qeou= Ui(o\\s Swth/r', KeyType.BETA_CODE, { setGreekStyle: { useLunateSigma: true } })).toBe('Ἰη\u03F2οῦ\u03F2 Χρι\u03F2τὸ\u03F2 Θεοῦ Υἱὸ\u03F2 \u03F9ωτήρ')
  })

  test.each`
    str                | expected
    ${'Ro/dos'}        | ${'Ρόδος'}
    ${'R(o/dos'}       | ${'Ῥόδος'}
    ${'polu/rrizos'}   | ${'πολύρριζος'}
    ${'polu/r)r(izos'} | ${'πολύῤῥιζος'}
    ${'ma/rmaros'}     | ${'μάρμαρος'}
  `('Testing rho rules', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected) })

  test('Using additional letters', () => {
    expect(toGreek('vVjJs3S3#2*#2#1*#1#3*#3#5*#5', KeyType.BETA_CODE, { useAdditionalChars: AdditionalChar.ALL })).toBe('ϝϜ\u03F3\u037F\u03F2\u03F9\u03DB\u03DAϟϞϙϘϡϠ')
    expect(toGreek('vVs3S3', KeyType.BETA_CODE, { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('ϝϜ\u03F2\u03F9')
    expect(toGreek('#1*#1#3*#3#5*#5', KeyType.BETA_CODE, { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('#1*#1#3*#3#5*#5')
  })

  // @fixme(v0.13): 
  test.each`
    str               | expected
    ${'BA/RBAROS'}    | ${'ΒΆΡΒΑΡΟΣ'}
    ${'R(O/DOS'}      | ${'ῬΌΔΟΣ'}
    ${'POLU/RRIZOS'}  | ${'ΠΟΛΎΡΡΙΖΟΣ'}
    ${'SUSSEISMO/S'}  | ${'ΣΥΣΣΕΙΣΜΌΣ'}
    ${'A)YEGH/S'}     | ${'ἈΨΕΓΉΣ'}
    ${'U(IO/S'}       | ${'ὙΙΌΣ'}
    ${'UI(O/S'}       | ${'ὙΙΌΣ'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected) })

  test('Testing whitespace behavior', () => {
    expect(toGreek('ai)/c   krio/s', KeyType.BETA_CODE)).toBe('αἴξ   κριός')
    expect(toGreek('ai)/c   krio/s', KeyType.BETA_CODE, { removeExtraWhitespace: true })).toBe('αἴξ κριός')
  })

  // v0.13 
  // Broken orders: `w|=(`, `w=(|`, `w=|(`.
  /*test.each`
    str       | expected
    ${'w(|='} | ${'ᾧ'}
    ${'w(=|'} | ${'ᾧ'}
    ${'w|(='} | ${'ᾧ'}
    ${'w|=('} | ${'ᾧ'}
    ${'w=(|'} | ${'ᾧ'}
    ${'w=|('} | ${'ᾧ'} 
  `('Applying various diacritics order', ({ str, expected }) => { expect(toGreek(str, KeyType.BETA_CODE)).toBe(expected) })*/
})

describe('From transliteration to greek', () => {
  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'ἄνθρωπος'}
    ${'kalòs ka̓gathós'} | ${'καλὸς κἀγαθός'}
    ${'autónomos'}      | ${'αὐτόνομος'}
    ${'huiós'}          | ${'υἱός'}
    ${'Huiós'}          | ${'Υἱός'}
    ${'poiȩ̄̃'}           | ${'ποιῇ'}
    ${'Áïda'}           | ${'Ἄϊδα'}
    ${'bárbaros'}       | ${'βάρ\u03D0αρος'}
    ${'Húsiris'}        | ${'Ὕσιρις'}
    ${'ō̧ṓdēs'}          | ${'ᾠώδης'}
    ${'woĩ'}            | ${'wοῖ'}
    ${'hágioc'}         | ${'ἅγιοc'}
    ${'Xenophȭn'}       | ${'Ξενοφῶν'}
    ${'chorēgéō'}       | ${'χορηγέω'}
    ${'ăāeēĭīoōŭū'}     | ${'ἀ̆ᾱεηῐῑοωῠῡ'}
    ${'ēēȩ̄̃ōōō̧'}         | ${'ἠηῇωωῳ'}
    ${plato.tr}         | ${plato.gr} 
  `('Basic conversion', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'ανθρωπος'}
    ${'kalòs ka̓gathós'} | ${'καλος καγαθος'}
    ${'autónomos'}      | ${'αυτονομος'}
    ${'huiós'}          | ${'υιος'}
    ${'Huiós'}          | ${'Υιος'}
    ${'poiȩ̄̃'}           | ${'ποιη'}
    ${'Áïda'}           | ${'Αιδα'}
    ${'bárbaros'}       | ${'βαρ\u03D0αρος'}
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

  test.each`
    str             | expected
    ${'Ēṓs'}        | ${'Ἠώς'}
    ${'aísthēsis'}  | ${'αἴσθησις'}
    ${'Aĩa'}        | ${'Αἶα'}
    ${'áülos'}      | ${'ἄϋλος'}
    ${'huḯdion'}    | ${'ὑΐδιον'}
  `('Testing breathings placement rules', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str           | expected
    ${'ka̓́n'}      | ${'κἄν'}
    ${'tau̓tó'}    | ${'ταὐτό'}
  `('Testing coronides', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str           | expected
    ${'ángelos'}  | ${'ἄγγελος'}
    ${'spóngos'}  | ${'σπόγγος'} 
    ${'ánkura'}   | ${'ἄγκυρα'}
    ${'sphínx'}   | ${'σφίγξ'} 
    ${'tunchánō'} | ${'τυγχάνω'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str           | expected
    ${'sphínks'}  | ${'σφίγξ'}
    ${'tunkhánō'} | ${'τυγχάνω'}
  `('Testing gamma nasals with xi_ks / chi_kh enabled', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  test('Disabling beta variant', () => {
    expect(toGreek('bárbaros', KeyType.TRANSLITERATION, { setGreekStyle: { disableBetaVariant: true } })).toBe('βάρβαρος')
  })

  test('Using lunate sigma', () => {
    expect(toGreek('Iēsoũs Christòs Theoũ Huiòs Sōtḗr', KeyType.TRANSLITERATION)).toBe('Ἰησοῦς Χριστὸς Θεοῦ Υἱὸς Σωτήρ')
    expect(toGreek('Iēsoũs Christòs Theoũ Huiòs Sōtḗr', KeyType.TRANSLITERATION, { setGreekStyle: { useLunateSigma: true } })).toBe('Ἰη\u03F2οῦ\u03F2 Χρι\u03F2τὸ\u03F2 Θεοῦ Υἱὸ\u03F2 \u03F9ωτήρ')
  })

  test.each`
    str            | expected
    ${'ánthrôpos'} | ${'ἄνθρωπος'}
    ${'Hoplítês'}  | ${'Ὁπλίτης'}
    ${'Xenophỗn'}  | ${'Ξενοφῶν'}
    ${plato.trCx}  | ${plato.gr}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  test.each`
    str              | expected
    ${'Ródos'}       | ${'Ρόδος'}
    ${'Rhódos'}      | ${'Ῥόδος'}
    ${'polúrrizos'}  | ${'πολύρριζος'}
    ${'polúrrhizos'} | ${'πολύρριζος'}
    ${'mármaros'}    | ${'μάρμαρος'}
  `('Testing rho rules', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str            | expected
    ${'Ksenophȭn'} | ${'Ξενοφῶν'}
    ${'khorēgéō'}  | ${'χορηγέω'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  test.each`
    str            | expected
    ${'hybrís'}    | ${'ὑϐρίς'}
    ${'autómatos'} | ${'αὐτόματος'}
    ${'áÿlos'}     | ${'ἄϋλος'}
    ${'hyḯdion'}   | ${'ὑΐδιον'}
    ${'hýdōr'}     | ${'ὕδωρ'}
    ${'Hýbla'}     | ${'Ὕϐλα'}
    ${'ý hỹ'}      | ${'ὔ ὗ'}
  `('Applying upsilon_y', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { upsilon_y: true } })).toBe(expected) })

  test('Using additional letters', () => {
    expect(toGreek('wWjJcCc̄C̄qQḳḲs̄S̄', KeyType.TRANSLITERATION, { useAdditionalChars: AdditionalChar.ALL })).toBe('ϝϜ\u03F3\u037F\u03F2\u03F9\u03DB\u03DAϟϞϙϘϡϠ')
    expect(toGreek('wWcC', KeyType.TRANSLITERATION, { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('ϝϜ\u03F2\u03F9')
    expect(toGreek('qQḳḲs̄S̄', KeyType.TRANSLITERATION, { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('qQκ̣Κ̣σ̄Σ̄')
  })

  test.each`
    str              | expected
    ${'BÁRBAROS'}    | ${'ΒΆΡΒΑΡΟΣ'}
    ${'RHÓDOS'}      | ${'ῬΌΔΟΣ'}
    ${'POLÚRRHIZOS'} | ${'ΠΟΛΎΡΡΙΖΟΣ'}
    ${'SUSSEISMÓS'}  | ${'ΣΥΣΣΕΙΣΜΌΣ'}
    ${'APSEGḖS'}     | ${'ἈΨΕΓΉΣ'}
    ${'HUIÓS'}       | ${'ὙΙΌΣ'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toGreek(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test('Testing whitespace behavior', () => {
    expect(toGreek('aíx   kriós', KeyType.TRANSLITERATION)).toBe('αἴξ   κριός')
    expect(toGreek('aíx   kriós', KeyType.TRANSLITERATION, { removeExtraWhitespace: true })).toBe('αἴξ κριός')
  })

  test('Testing correctness with various word separators', () => {
    expect(toGreek('Ródos\nRódos\tRódos Ródos Ródos.', KeyType.TRANSLITERATION)).toBe('Ρόδος\nΡόδος\tΡόδος Ρόδος Ρόδος.')
    expect(toGreek('Rhódos\nRhódos\tRhódos Rhódos Rhódos.', KeyType.TRANSLITERATION)).toBe('Ῥόδος\nῬόδος\tῬόδος Ῥόδος Ῥόδος.')
  })
})
