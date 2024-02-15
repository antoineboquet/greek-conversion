import { AdditionalChars, KeyType, toBetaCode } from '../src/index'

/*
 * Special characters:
 *   - \u03D0 = Greek Beta Symbol
 *   - \u03F2 = Greek Lunate Sigma Symbol
 */

const aristotle = { // challenge: `(meta\\ kinh/sews ga/r)`
  gr: 'Ἐκεῖναι μὲν δὴ φυσικῆς μετὰ κινήσεως γάρ, αὕτη δὲ ἑτέρας, εἰ μηδεμία αὐτοῖς ἀρχὴ κοινή.',
  tr: 'Ekeĩnai mèn dḕ phusikē̃s metà kinḗseōs gár, haútē dè hetéras, ei mēdemía autoĩs archḕ koinḗ.',
  bc: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.'
}

describe('From greek to beta code', () => {
  test.each`
    str                | expected
    ${'ἄνθρωπος'}      | ${'a)/nqrwpos'}
    ${'ποιῇ'}          | ${'poih=|'}
    ${'Ἄϊδα'}         | ${'A)/i+da'}
    ${'βάρ\u03D0αρος'} | ${'ba/rbaros'}
    ${'Ὕσιρις'}       | ${'U(/siris'}
    ${'wοῖ'}           | ${'woi='}
    ${'ἅγιοc'}         | ${'a(/gioc'}
    ${'Ξενοφῶν'}       | ${'Cenofw=n'}
    ${'χορηγέω'}       | ${'xorhge/w'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}    | ${'a)%27a%26ehi%27i%26owu%27u%26'}
  `('Basic conversion', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  test.each`
    str             | expected
    ${'Ρόδος'}      | ${'Ro/dos'}
    ${'Ῥόδος'}      | ${'R(o/dos'}
    ${'πολύρριζος'} | ${'polu/rrizos'}
    ${'πολύῤῥιζος'} | ${'polu/r)r(izos'}
    ${'μάρμαρος'}   | ${'ma/rmaros'}
  `('Testing rho rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  test('Testing correctness with various word separators', () => {
    expect(toBetaCode('Ρόδος\nΡόδος\tΡόδος Ρόδος', KeyType.GREEK)).toBe('Ro/dos\nRo/dos\tRo/dos Ro/dos')
    expect(toBetaCode('Ῥόδος\nῬόδος\tῬόδος Ῥόδος', KeyType.GREEK)).toBe('R(o/dos\nR(o/dos\tR(o/dos R(o/dos')
  })

  test.each`
    str                   | expected
    ${'ϝοῖ'}              | ${'voi='}
    ${'ἅγιο\u03F2'}       | ${'a(/gios3'}
    ${'\u03DB\u03DAϟϞϡϠ'} | ${'#2*#2#1*#1#5*#5'}
  `('Using additional letters', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { useAdditionalChars: AdditionalChars.ALL })).toBe(expected) })
  
  test('Using a subset of additional letters', () => {
    expect(toBetaCode('ϝϜ\u03F2\u03F9', KeyType.GREEK, { useAdditionalChars: [AdditionalChars.DIGAMMA, AdditionalChars.LUNATE_SIGMA] })).toBe('vVs3S3')
    expect(toBetaCode('\u03F3\u037F\u03DB\u03DAϟϞϡϠ', KeyType.GREEK, { useAdditionalChars: [AdditionalChars.DIGAMMA, AdditionalChars.LUNATE_SIGMA] })).toBe('\u03F3\u037F\u03DB\u03DAϟϞϡϠ')
  })

  test.each`
    str             | expected
    ${'ανθρωπος'}   | ${'anqrwpos'}
    ${'ποιῇ'}       | ${'poih'}
    ${'Ἄϊδα'}      | ${'Aida'}
    ${'bárbaros'}   | ${'barbaros'}
    ${'Ὕσιρις'}    | ${'Usiris'}
    ${'Ξενοφῶν'}    | ${'Cenofwn'}
    ${'χορηγέω'}    | ${'xorhgew'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'} | ${'aaehiiowuu'}
  `('Removing diacritics', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { removeDiacritics: true })).toBe(expected) })

  test('Disabling beta variant', () => {
    expect(toBetaCode('βάρβαρος', KeyType.GREEK, { setGreekStyle: { disableBetaVariant: true } })).toBe('ba/rbaros')
  })

  test('Testing whitespace behavior', () => {
    expect(toBetaCode('αἴξ κριός', KeyType.GREEK)).toBe('ai)/c krio/s')
    expect(toBetaCode('αἴξ   κριός', KeyType.GREEK, { preserveWhitespace: true })).toBe('ai)/c   krio/s')
  })

  test.each`
    str           | expected
    ${'ἄνθρωπος'} | ${'a)/nqrwpos'}
    ${'Ὁπλίτης'}  | ${'O(pli/ths'}
    ${'Ξενοφῶν'}  | ${'Cenofw=n'}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { setTransliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  test.each`
    str          | expected
    ${'Ξενοφῶν'} | ${'Cenofw=n'}
    ${'χορηγέω'} | ${'xorhge/w'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })
})

describe('From transliteration to beta code', () => {
  test.each`
    str             | expected
    ${'ánthrōpos'}  | ${'a)/nqrwpos'}
    ${'poiȩ̄̃'}       | ${'poih=|'}
    ${'Áïda'}       | ${'A)/i+da'}
    ${'bárbaros'}   | ${'ba/rbaros'}
    ${'Hoplítēs'}   | ${'O(pli/ths'}
    ${'voĩ'}        | ${'voi='}
    ${'hágioc'}     | ${'a(/gioc'}
    ${aristotle.tr} | ${aristotle.bc}
  `('Basic conversion', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str             | expected
    ${'Ēṓs'}        | ${'H)w/s'}
    ${'aísthēsis'}  | ${'ai)/sqhsis'}
    ${'Aĩa'}        | ${'Ai)=a'}
    ${'áülos'}      | ${'a)/u+los'}
    ${'huḯdion'}    | ${'u(i+/dion'}
  `('Testing breathings placement rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str              | expected
    ${'Ródos'}       | ${'Ro/dos'}
    ${'Rhódos'}      | ${'R(o/dos'}
    ${'polúrrizos'}  | ${'polu/rrizos'}
    ${'polúrrhizos'} | ${'polu/rrizos'}
    ${'mármaros'}    | ${'ma/rmaros'}
  `('Testing rho rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str         | expected
    ${'woĩ'}    | ${'voi='}
    ${'hágioc'} | ${'a(/gios3'}
    ${'c̄C̄qQs̄S̄'} | ${'#2*#2#1*#1#5*#5'}
  `('Using additional letters', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { useAdditionalChars: AdditionalChars.ALL })).toBe(expected) })

  test('Using a subset of additional letters', () => {
    expect(toBetaCode('wWcC', KeyType.TRANSLITERATION, { useAdditionalChars: [AdditionalChars.DIGAMMA, AdditionalChars.LUNATE_SIGMA] })).toBe('vVs3S3')
  })

  test.each`
    str              | expected
    ${'ánthrōpos'}   | ${'anqrwpos'}
    ${'poiȩ̄̃'}        | ${'poih'}
    ${'Áïda'}        | ${'Aida'}
    ${'bárbaros'}    | ${'barbaros'}
    ${'Hoplítēs'}    | ${'Opliths'}
    ${'polúrrhizos'} | ${'polurrizos'}
  `('Removing diacritics', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { removeDiacritics: true })).toBe(expected) })

  test('Testing whitespace behavior', () => {
    expect(toBetaCode('aíx kriós', KeyType.TRANSLITERATION)).toBe('ai)/c krio/s')
    expect(toBetaCode('aíx   kriós', KeyType.TRANSLITERATION, { preserveWhitespace: true })).toBe('ai)/c   krio/s')
  })

  test.each`
    str            | expected
    ${'ánthrôpos'} | ${'a)/nqrwpos'}
    ${'Hoplítês'}  | ${'O(pli/ths'}
    ${'Xenophỗn'}  | ${'Cenofw=n'}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  test.each`
    str            | expected
    ${'Ksenophȭn'} | ${'Cenofw=n'}
    ${'khorēgéō'}  | ${'xorhge/w'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  test.each`
    str            | expected
    ${'hybrís'}    | ${'u(bri/s'}
    ${'autómatos'} | ${'au)to/matos'}
    ${'áÿlos'}     | ${'a)/u+los'}
    ${'hyḯdion'}   | ${'u(i+/dion'}
    ${'hýdōr'}     | ${'u(/dwr'}
    ${'Hýbla'}     | ${'U(/bla'}
    ${'ý hỹ'}      | ${'u)/ u(='}
  `('Applying upsilon_y', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { upsilon_y: true } })).toBe(expected) })
})
