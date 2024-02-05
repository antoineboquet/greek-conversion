import { additionalLetters, keyType, toGreek } from '../src/index'

/*
 * Special characters:
 *   - \u03D0 = Greek Beta Symbol
 *   - \u03F2 = Greek Lunate Sigma Symbol
 */

const aristotle = { // challenge: `(meta\\ kinh/sews ga/r)`
  bc: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.',
  gr: 'Ἐκεῖναι μὲν δὴ φυσικῆς μετὰ κινήσεως γάρ, αὕτη δὲ ἑτέρας, εἰ μηδεμία αὐτοῖς ἀρχὴ κοινή.',
  grNoAcc: 'Εκειναι μεν δη φυσικης μετα κινησεως γαρ, αυτη δε ετερας, ει μηδεμια αυτοις αρχη κοινη.'
}

const thucydides = {
  trNoAcc: 'Hellēsin egeneto kai merei tini tōn barbarōn, hōs de eipein kai epi pleiston anthrōpōn.',
  grNoAcc: 'Ελλησιν εγενετο και μερει τινι των βαρϐαρων, ως δε ειπειν και επι πλειστον ανθρωπων.'
}

const plato = { // Notice that in the greek output, `κὰν` currently doesn't have the coronis (κἂν).
  tr: 'Chalepón gé se elénxai, ō̃ Sṓkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alēthē̃ légeis?',
  trCrx: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alêthễ légeis?',
  gr: 'Χαλεπόν γέ σε ἐλέγξαι, ὦ Σώκρατες· ἀλλ\' οὐχὶ κὰν παῖς σε ἐλέγξειεν ὅτι οὐκ ἀληθῆ λέγεις\u037E'
}

describe('From beta code to greek', () => {
  test.each`
    str             | expected
    ${'a)/nqrwpos'} | ${'ἄνθρωπος'}
    ${'poih|='}     | ${'ποιῇ'}
    ${'A)/i+da'}    | ${'Ἄϊδα'}
    ${'ba/rbaros'}  | ${'βάρ\u03D0αρος'}
    ${'O(pli/ths'}  | ${'Ὁπλίτης'}
    ${'voi='}       | ${'vοῖ'}
    ${'a(/gios3'}   | ${'ἅγιοσ3'}
    ${'a%26'}       | ${'ᾱ'}
    ${aristotle.bc} | ${aristotle.gr}
  `('Basic conversion', ({ str, expected }) => { expect(toGreek(str, keyType.BETA_CODE)).toBe(expected) })

  // Scheduled for v. 0.12.
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
  `('Testing classical TLG writing system', ({ str, expected }) => { expect(toGreek(str, keyType.BETA_CODE, { setBetaCodeStyle: { useClassical: true } })).toBe(expected) })*/

  test.each`
    str                | expected
    ${'Ro/dos'}        | ${'Ρόδος'}
    ${'R(o/dos'}       | ${'Ῥόδος'}
    ${'polu/rrizos'}   | ${'πολύρριζος'}
    ${'polu/r)r(izos'} | ${'πολύῤῥιζος'}
    ${'ma/rmaros'}     | ${'μάρμαρος'}
  `('Testing rho rules', ({ str, expected }) => { expect(toGreek(str, keyType.BETA_CODE)).toBe(expected) })

  test.each`
    str                  | expected
    ${'voi='}            | ${'ϝοῖ'}
    ${'a(/gios3'}        | ${'ἅγιο\u03F2'}
    ${'#2*#2#1*#1#5*#5'} | ${'\u03DB\u03DAϟϞϡϠ'}
  `('Using additional letters', ({ str, expected }) => { expect(toGreek(str, keyType.BETA_CODE, { useAdditionalLetters: additionalLetters.ALL })).toBe(expected) })

  test('Using a subset of additional letters', () => {
    expect(toGreek('vVs3S3', keyType.BETA_CODE, { useAdditionalLetters: [additionalLetters.DIGAMMA, additionalLetters.LUNATE_SIGMA] })).toBe('ϝϜ\u03F2\u03F9')
    //expect(toGreek('', keyType.BETA_CODE, { useAdditionalLetters: [additionalLetters.DIGAMMA, additionalLetters.LUNATE_SIGMA] })).toBe('')
  })

  test.each`
    str             | expected
    ${'a)/nqrwpos'} | ${'ανθρωπος'}
    ${'poih|='}     | ${'ποιη'}
    ${'A)/i+da'}    | ${'Αιδα'}
    ${'ba/rbaros'}  | ${'βαρ\u03D0αρος'}
    ${'O(pli/ths'}  | ${'Οπλιτης'}
    ${aristotle.bc} | ${aristotle.grNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toGreek(str, keyType.BETA_CODE, { removeDiacritics: true })).toBe(expected) })

  test('Disabling beta variant', () => {
    expect(toGreek('ba/rbaros', keyType.BETA_CODE, { setGreekStyle: { disableBetaVariant: true } })).toBe('βάρβαρος')
  })

  test('Testing whitespace behavior', () => {
    expect(toGreek('ai)/c   krio/s', keyType.BETA_CODE)).toBe('αἴξ κριός')
    expect(toGreek('ai)/c   krio/s', keyType.BETA_CODE, { preserveWhitespace: true })).toBe('αἴξ   κριός')
  })

  // Scheduled for v. 0.12 (broken orders: `w|=(`, `w=(|`, `w=|(` ).
  /*test.each`
    str       | expected
    ${'w(|='} | ${'ᾧ'}
    ${'w(=|'} | ${'ᾧ'}
    ${'w|(='} | ${'ᾧ'}
    ${'w|=('} | ${'ᾧ'}
    ${'w=(|'} | ${'ᾧ'}
    ${'w=|('} | ${'ᾧ'} 
  `('Applying various diacritics order', ({ str, expected }) => { expect(toGreek(str, keyType.BETA_CODE)).toBe(expected) })*/
})

describe('From transliteration to greek', () => {
  test.each`
    str             | expected
    ${'ánthrōpos'}  | ${'ἄνθρωπος'}
    ${'poiȩ̄̃'}       | ${'ποιῇ'}
    ${'Áïda'}       | ${'Ἄϊδα'}
    ${'bárbaros'}   | ${'βάρ\u03D0αρος'}
    ${'Húsiris'}    | ${'Ὕσιρις'}
    ${'ō̧ṓdēs'}      | ${'ᾠώδης'}
    ${'woĩ'}        | ${'wοῖ'}
    ${'hágioc'}     | ${'ἅγιοc'}
    ${'Xenophȭn'}   | ${'Ξενοφῶν'}
    ${'chorēgéō'}   | ${'χορηγέω'}
    ${'ăāeēĭīoōŭū'} | ${'ἀ̆ᾱεηῐῑοωῠῡ'}
    ${plato.tr}     | ${plato.gr} 
  `('Basic conversion', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str             | expected
    ${'Ēṓs'}        | ${'Ἠώς'}
    ${'aísthēsis'}  | ${'αἴσθησις'}
    ${'Aĩa'}        | ${'Αἶα'}
    ${'áülos'}      | ${'ἄϋλος'}
    ${'huḯdion'}    | ${'ὑΐδιον'}
  `('Testing breathings placement rules', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str           | expected
    ${'ángelos'}  | ${'ἄγγελος'}
    ${'spóngos'}  | ${'σπόγγος'} 
    ${'ánkura'}   | ${'ἄγκυρα'}
    ${'sphínx'}   | ${'σφίγξ'} 
    ${'tunchánō'} | ${'τυγχάνω'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str           | expected
    ${'sphínks'}  | ${'σφίγξ'}
    ${'tunkhánō'} | ${'τυγχάνω'}
  `('Testing gamma nasals with xi_ks / chi_kh enabled', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  test.each`
    str              | expected
    ${'Ródos'}       | ${'Ρόδος'}
    ${'Rhódos'}      | ${'Ῥόδος'}
    ${'polúrrizos'}  | ${'πολύρριζος'}
    ${'polúrrhizos'} | ${'πολύρριζος'}
    ${'mármaros'}    | ${'μάρμαρος'}
  `('Testing rho rules', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION)).toBe(expected) })

  test('Testing correctness with various word separators', () => {
    expect(toGreek('Ródos\nRódos\tRódos Ródos Ródos.', keyType.TRANSLITERATION)).toBe('Ρόδος\nΡόδος\tΡόδος Ρόδος Ρόδος.')
    expect(toGreek('Rhódos\nRhódos\tRhódos Rhódos Rhódos.', keyType.TRANSLITERATION)).toBe('Ῥόδος\nῬόδος\tῬόδος Ῥόδος Ῥόδος.')
  })

  test.each`
    str         | expected
    ${'woĩ'}    | ${'ϝοῖ'}
    ${'hágioc'} | ${'ἅγιο\u03F2'}
  `('Using additional letters', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION, { useAdditionalLetters: additionalLetters.ALL })).toBe(expected) })

  test('Using a subset of additional letters', () => {
    expect(toGreek('wWcC', keyType.TRANSLITERATION, { useAdditionalLetters: [additionalLetters.DIGAMMA, additionalLetters.LUNATE_SIGMA] })).toBe('ϝϜ\u03F2\u03F9')
    expect(toGreek('jJc̄C̄qQs̄S̄', keyType.TRANSLITERATION, { useAdditionalLetters: [additionalLetters.DIGAMMA, additionalLetters.LUNATE_SIGMA] })).toBe('jJϲ̄Ϲ̄qQσ̄Σ̄')
  })

  test.each`
    str             | expected
    ${'ánthrōpos'}  | ${'ανθρωπος'}
    ${'poiȩ̄̃'}       | ${'ποιη'}
    ${'Áïda'}       | ${'Αιδα'}
    ${'bárbaros'}   | ${'βαρ\u03D0αρος'}
    ${'Húsiris'}    | ${'Υσιρις'}
    ${'ō̧ṓdēs'}      | ${'ωωδης'}
    ${'Xenophȭn'}   | ${'Ξενοφων'}
    ${'chorēgéō'}   | ${'χορηγεω'}
    ${'ăāeēĭīoōŭū'} | ${'ααεηιιοωυυ'}
    ${thucydides.trNoAcc} | ${thucydides.grNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION, { removeDiacritics: true })).toBe(expected) })

  test('Disabling beta variant', () => {
    expect(toGreek('bárbaros', keyType.TRANSLITERATION, { setGreekStyle: { disableBetaVariant: true } })).toBe('βάρβαρος')
  })

  test('Testing whitespace behavior', () => {
    expect(toGreek('aíx   kriós', keyType.TRANSLITERATION)).toBe('αἴξ κριός')
    expect(toGreek('aíx   kriós', keyType.TRANSLITERATION, { preserveWhitespace: true })).toBe('αἴξ   κριός')
  })

  test.each`
    str            | expected
    ${'ánthrôpos'} | ${'ἄνθρωπος'}
    ${'Hoplítês'}  | ${'Ὁπλίτης'}
    ${'Xenophỗn'}  | ${'Ξενοφῶν'}
    ${plato.trCrx} | ${plato.gr}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION, { setTransliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  test.each`
    str            | expected
    ${'Ksenophȭn'} | ${'Ξενοφῶν'}
    ${'khorēgéō'}  | ${'χορηγέω'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toGreek(str, keyType.TRANSLITERATION, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })
})
