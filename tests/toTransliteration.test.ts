import { additionalChars, keyType, toTransliteration } from '../src/index'

/*
 * Special characters:
 *   - \u03D0 = Greek Beta Symbol
 *   - \u03F2 = Greek Lunate Sigma Symbol
 */

const aristotle = { // challenge: `(meta\\ kinh/sews ga/r)`
  bc: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.',
  tr: 'Ekeĩnai mèn dḕ phusikē̃s metà kinḗseōs gár, haútē dè hetéras, ei mēdemía autoĩs archḕ koinḗ.',
  trNoAcc: 'Ekeinai men dē phusikēs meta kinēseōs gar, hautē de heteras, ei mēdemia autois archē koinē.'
}

const thucydides = {
  gr: 'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',
  grNoAcc: 'Ελλησιν εγενετο και μερει τινι των βαρϐαρων, ως δε ειπειν και επι πλειστον ανθρωπων.',
  trNoAcc: 'Hellēsin egeneto kai merei tini tōn barbarōn, hōs de eipein kai epi pleiston anthrōpōn.'
}

const plato = {
  gr: 'Χαλεπόν γέ σε ἐλέγξαι, ὦ Σώκρατες· ἀλλ\' οὐχὶ κὰν παῖς σε ἐλέγξειεν ὅτι οὐκ ἀληθῆ λέγεις\u037E',
  tr: 'Chalepón gé se elénxai, ō̃ Sṓkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alēthē̃ légeis?',
  trCrx: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alêthễ légeis?'
}

// ē̃ͅȩ̄̃ōͅō̧
describe('From beta code to transliteration', () => {
  test.each`
    str             | expected
    ${'a)/nqrwpos'} | ${'ánthrōpos'}
    ${'poih|='}     | ${'poiȩ̄̃'}
    ${'A)/i+da'}    | ${'Áïda'}
    ${'ba/rbaros'}  | ${'bárbaros'}
    ${'O(pli/ths'}  | ${'Hoplítēs'}
    ${'voi='}       | ${'voĩ'}
    ${'a(/gios3'}   | ${'hágios3'}
    ${'a%26'}       | ${'ā'}
    ${aristotle.bc} | ${aristotle.tr}
  `('Basic conversion', ({ str, expected }) => { expect(toTransliteration(str, keyType.BETA_CODE)).toBe(expected) })

  test.each`
    str                | expected
    ${'Ro/dos'}        | ${'Ródos'}
    ${'R(o/dos'}       | ${'Rhódos'}
    ${'polu/rrizos'}   | ${'polúrrizos'}
    ${'polu/r)r(izos'} | ${'polúrrhizos'}
    ${'ma/rmaros'}     | ${'mármaros'}
  `('Testing rho rules', ({ str, expected }) => { expect(toTransliteration(str, keyType.BETA_CODE)).toBe(expected) })

  test.each`
    str                  | expected
    ${'voi='}            | ${'woĩ'}
    ${'a(/gios3'}        | ${'hágioc'}
    ${'#2*#2#1*#1#5*#5'} | ${'c̄C̄qQs̄S̄'}

  `('Using additional letters', ({ str, expected }) => { expect(toTransliteration(str, keyType.BETA_CODE, { useAdditionalChars: additionalChars.ALL })).toBe(expected) })

  test('Using a subset of additional letters', () => {
    expect(toTransliteration('vVs3S3', keyType.BETA_CODE, { useAdditionalChars: [additionalChars.DIGAMMA, additionalChars.LUNATE_SIGMA] })).toBe('wWcC')
    //expect(toTransliteration('', keyType.BETA_CODE, { useAdditionalChars: [additionalChars.DIGAMMA, additionalChars.LUNATE_SIGMA] })).toBe('')
  })

  test.each`
    str             | expected
    ${'a)/nqrwpos'} | ${'anthrōpos'}
    ${'poih|='}     | ${'poiē'}
    ${'A)/i+da'}    | ${'Aida'}
    ${'ba/rbaros'}  | ${'barbaros'}
    ${'O(pli/ths'}  | ${'Hoplitēs'}
    ${aristotle.bc} | ${aristotle.trNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toTransliteration(str, keyType.BETA_CODE, { removeDiacritics: true })).toBe(expected) })

  test('Testing whitespace behavior', () => {
    expect(toTransliteration('ai)/c   krio/s', keyType.BETA_CODE)).toBe('aíx kriós')
    expect(toTransliteration('ai)/c   krio/s', keyType.BETA_CODE, { preserveWhitespace: true })).toBe('aíx   kriós')
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
  `('Applying various diacritics order', ({ str, expected }) => { expect(toTransliteration(str, keyType.BETA_CODE)).toBe(expected) })*/

  test.each`
    str              | expected
    ${'u(bri/s'}     | ${'hybrís'}
    ${'au)to/matos'} | ${'autómatos'}
    ${'a)/u+los'}    | ${'áülos'}
    ${'u(i/+dion'}   | ${'huḯdion'}
    ${'u(/dwr'}      | ${'hýdōr'}
    ${'U(/bla'}      | ${'Hýbla'}
    ${'u)/ u(='}     | ${'ý hỹ'}
  `('Applying upsilon_y', ({ str, expected }) => { expect(toTransliteration(str, keyType.BETA_CODE, { setTransliterationStyle: { upsilon_y: true } })).toBe(expected) })

})

describe('From greek to transliteration', () => {
  test.each`
    str                | expected
    ${'ἄνθρωπος'}      | ${'ánthrōpos'}
    ${'ποιῇ'}          | ${'poiȩ̄̃'}
    ${'Ἄϊδα'}         | ${'Áïda'}
    ${'βάρ\u03D0αρος'} | ${'bárbaros'}
    ${'Ὕσιρις'}       | ${'Húsiris'}
    ${'ᾠώδης'}         | ${'ō̧ṓdēs'}
    ${'wοῖ'}           | ${'woĩ'}
    ${'ἅγιοc'}         | ${'hágioc'}
    ${'Ξενοφῶν'}       | ${'Xenophō̃n'}
    ${'χορηγέω'}       | ${'chorēgéō'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}    | ${'ăāeēĭīoōŭū'}
    ${plato.gr}        | ${plato.tr} 
  `('Basic conversion', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK)).toBe(expected) })

  test.each`
    str           | expected
    ${'Ἠώς'}      | ${'Ēṓs'}
    ${'αἴσθησις'} | ${'aísthēsis'}
    ${'Αἶα'}      | ${'Aĩa'}
    ${'ἄϋλος'}    | ${'áülos'}
    ${'ὑΐδιον'}   | ${'huḯdion'}
  `('Testing breathings placement rules', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK)).toBe(expected) })

  test.each`
    str          | expected
    ${'ἄγγελος'} | ${'ángelos'}
    ${'σπόγγος'} | ${'spóngos'} 
    ${'ἄγκυρα'}  | ${'ánkura'}
    ${'σφίγξ'}   | ${'sphínx'} 
    ${'τυγχάνω'} | ${'tunchánō'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK)).toBe(expected) })

  test.each`
    str          | expected
    ${'σφίγξ'}   | ${'sphínks'}
    ${'τυγχάνω'} | ${'tunkhánō'}
  `('Testing gamma nasals with xi_ks / chi_kh enabled', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  test.each`
    str             | expected
    ${'Ρόδος'}      | ${'Ródos'}
    ${'Ῥόδος'}      | ${'Rhódos'}
    ${'πολύρριζος'} | ${'polúrrhizos'}
    ${'πολύῤῥιζος'} | ${'polúrrhizos'}
    ${'μάρμαρος'}   | ${'mármaros'}
  `('Testing rho rules', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK)).toBe(expected) })

  test('Testing correctness with various word separators', () => {
    expect(toTransliteration('Ρόδος\nΡόδος\tΡόδος Ρόδος', keyType.GREEK)).toBe('Ródos\nRódos\tRódos Ródos')
    expect(toTransliteration('Ῥόδος\nῬόδος\tῬόδος Ῥόδος', keyType.GREEK)).toBe('Rhódos\nRhódos\tRhódos Rhódos')
  })

  test.each`
    str             | expected
    ${'ϝοῖ'}        | ${'woĩ'}
    ${'ἅγιο\u03F2'} | ${'hágioc'}
  `('Using additional letters', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK, { useAdditionalChars: additionalChars.ALL })).toBe(expected) })
  
  test('Using a subset of additional letters', () => {
    expect(toTransliteration('ϝϜ\u03F2\u03F9', keyType.GREEK, { useAdditionalChars: [additionalChars.DIGAMMA, additionalChars.LUNATE_SIGMA] })).toBe('wWcC')
    expect(toTransliteration('\u03F3\u037F\u03DB\u03DAϟϞϡϠ', keyType.GREEK, { useAdditionalChars: [additionalChars.DIGAMMA, additionalChars.LUNATE_SIGMA] })).toBe('\u03F3\u037F\u03DB\u03DAϟϞϡϠ')
  })

  test.each`
    str              | expected
    ${'ανθρωπος'}    | ${'anthrōpos'}
    ${'ποιῇ'}        | ${'poiē'}
    ${'Ἄϊδα'}       | ${'Aida'}
    ${'bárbaros'}    | ${'barbaros'}
    ${'Ὕσιρις'}     | ${'Husiris'}
    ${'ᾠώδης'}       | ${'ōōdēs'}
    ${'Ξενοφῶν'}     | ${'Xenophōn'}
    ${'χορηγέω'}     | ${'chorēgeō'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}  | ${'aaeēiioōuu'}
    ${thucydides.gr} | ${thucydides.trNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK, { removeDiacritics: true })).toBe(expected) })

  test('Disabling beta variant', () => {
    expect(toTransliteration('βάρβαρος', keyType.GREEK, { setGreekStyle: { disableBetaVariant: true } })).toBe('bárbaros')
  })

  test('Testing whitespace behavior', () => {
    expect(toTransliteration('αἴξ κριός', keyType.GREEK)).toBe('aíx kriós')
    expect(toTransliteration('αἴξ   κριός', keyType.GREEK, { preserveWhitespace: true })).toBe('aíx   kriós')
  })

  test.each`
    str           | expected
    ${'ἄνθρωπος'} | ${'ánthrôpos'}
    ${'Ὁπλίτης'}  | ${'Hoplítês'}
    ${'Ξενοφῶν'}  | ${'Xenophỗn'}
    ${plato.gr}   | ${plato.trCrx}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK, { setTransliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  test.each`
    str             | expected
    ${'Ξενοφῶν'}    | ${'Ksenophō̃n'}
    ${'χορηγέω'}    | ${'khorēgéō'}
    ${'σφίγξ'}      | ${'sphínks'}
    ${'μελαγχολία'} | ${'melankholía'}
    ${'σφίνξ'}      | ${'sphínks'}
    ${'μελανχολία'} | ${'melankholía'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  test.each`
    str            | expected
    ${'ὑϐρίς'}     | ${'hybrís'}
    ${'αὐτόματος'} | ${'autómatos'}
    ${'ἄϋλος'}     | ${'áülos'}
    ${'ὑΐδιον'}    | ${'huḯdion'}
    ${'ὕδωρ'}      | ${'hýdōr'}
    ${'Ὕϐλα'}     | ${'Hýbla'}
    ${'ὔ ὗ'}       | ${'ý hỹ'}
  `('Applying upsilon_y', ({ str, expected }) => { expect(toTransliteration(str, keyType.GREEK, { setTransliterationStyle: { upsilon_y: true } })).toBe(expected) })
})
