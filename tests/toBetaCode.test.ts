import { AdditionalChar, KeyType, toBetaCode } from '../src/index'

/*
 * Special characters:
 *   - \u03D0 = Greek Beta Symbol
 *   - \u03F2 = Greek Lunate Sigma Symbol
 */

const aristotle = {
  gr: 'Ἐκεῖναι μὲν δὴ φυσικῆς μετὰ κινήσεως γάρ, αὕτη δὲ ἑτέρας, εἰ μηδεμία αὐτοῖς ἀρχὴ κοινή.',
  tr: 'Ekeĩnai mèn dḕ phusikē̃s metà kinḗseōs gár, haútē dè hetéras, ei mēdemía autoĩs archḕ koinḗ.',
  bc: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.',
  bcNoAcc: 'Ekeinai men dh fusikhs meta kinhsews gar, auth de eteras, ei mhdemia autois arxh koinh.'
}

describe('From greek to beta code', () => {
  test.each`
    str                | expected
    ${'ἄνθρωπος'}      | ${'a)/nqrwpos'}
    ${'καλὸς κἀγαθός'} | ${'kalo\\s ka)gaqo/s'}
    ${'αὐτόνομος'}     | ${'au)to/nomos'}
    ${'ποιῇ'}          | ${'poih=|'}
    ${'Ἄϊδα'}          | ${'A)/i+da'}
    ${'βάρ\u03D0αρος'} | ${'ba/rbaros'}
    ${'Ὕσιρις'}        | ${'U(/siris'}
    ${'wοῖ'}           | ${'woi='}
    ${'ἅγιοc'}         | ${'a(/gioc'}
    ${'Ξενοφῶν'}       | ${'Cenofw=n'}
    ${'χορηγέω'}       | ${'xorhge/w'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}    | ${'a)%27a%26ehi%27i%26owu%27u%26'}
    ${aristotle.gr}    | ${aristotle.bc}
  `('Basic conversion', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  test.each`
    str                | expected
    ${'ανθρωπος'}      | ${'anqrwpos'}
    ${'καλὸς κἀγαθός'} | ${'kalos kagaqos'}
    ${'αὐτόνομος'}     | ${'autonomos'}
    ${'ποιῇ'}          | ${'poih'}
    ${'Ἄϊδα'}          | ${'Aida'}
    ${'βάρ\u03D0αρος'} | ${'barbaros'}
    ${'Ὕσιρις'}        | ${'Usiris'}
    ${'wοῖ'}           | ${'woi'}
    ${'ἅγιοc'}         | ${'agioc'}
    ${'Ξενοφῶν'}       | ${'Cenofwn'}
    ${'χορηγέω'}       | ${'xorhgew'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}    | ${'aaehiiowuu'}
    ${aristotle.gr}    | ${aristotle.bcNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { removeDiacritics: true })).toBe(expected) })

  test('Disabling beta variant', () => {
    expect(toBetaCode('βάρβαρος', KeyType.GREEK, { setGreekStyle: { disableBetaVariant: true } })).toBe('ba/rbaros')
  })

  test.each`
    str             | expected
    ${'Ρόδος'}      | ${'Ro/dos'}
    ${'Ῥόδος'}      | ${'R(o/dos'}
    ${'πολύρριζος'} | ${'polu/rrizos'}
    ${'πολύῤῥιζος'} | ${'polu/r)r(izos'}
    ${'μάρμαρος'}   | ${'ma/rmaros'}
  `('Testing rho rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  test.each`
    str          | expected
    ${'Ξενοφῶν'} | ${'Cenofw=n'}
    ${'χορηγέω'} | ${'xorhge/w'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  test('Using additional letters', () => {
    expect(toBetaCode('ϝϜ\u03F3\u037F\u03F2\u03F9\u03DB\u03DAϟϞϙϘϡϠ', KeyType.GREEK, { useAdditionalChars: AdditionalChar.ALL })).toBe('vVjJs3S3#2*#2#1*#1#3*#3#5*#5')
    expect(toBetaCode('ϝϜ\u03F2\u03F9', KeyType.GREEK, { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('vVs3S3')
    expect(toBetaCode('\u03F3\u037F\u03DB\u03DAϟϞϡϠ', KeyType.GREEK, { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('\u03F3\u037F\u03DB\u03DAϟϞϡϠ')
  })

  test.each`
    str             | expected
    ${'ΒΆΡΒΑΡΟΣ'}   | ${'BA/RBAROS'}
    ${'ῬΌΔΟΣ'}      | ${'R(O/DOS'}
    ${'ΠΟΛΎΡΡΙΖΟΣ'} | ${'POLU/RRIZOS'}
    ${'ΣΥΣΣΕΙΣΜΌΣ'} | ${'SUSSEISMO/S'}
    ${'ἈΨΕΓΉΣ'}     | ${'A)YEGH/S'}
    ${'ὙΙΌΣ'}       | ${'U(IO/S'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  test('Testing whitespace behavior', () => {
    expect(toBetaCode('αἴξ   κριός', KeyType.GREEK)).toBe('ai)/c   krio/s')
    expect(toBetaCode('αἴξ   κριός', KeyType.GREEK, { removeExtraWhitespace: true })).toBe('ai)/c krio/s')
  })

  test('Testing correctness with various word separators', () => {
    expect(toBetaCode('Ρόδος\nΡόδος\tΡόδος Ρόδος', KeyType.GREEK)).toBe('Ro/dos\nRo/dos\tRo/dos Ro/dos')
    expect(toBetaCode('Ῥόδος\nῬόδος\tῬόδος Ῥόδος', KeyType.GREEK)).toBe('R(o/dos\nR(o/dos\tR(o/dos R(o/dos')
  })
})

describe('From transliteration to beta code', () => {
  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'a)/nqrwpos'}
    ${'kalòs kagathós'} | ${'kalo\\s kagaqo/s'}
    ${'autónomos'}      | ${'au)to/nomos'}
    ${'huiós'}          | ${'ui(o/s'}
    ${'Huiós'}          | ${'Ui(o/s'}
    ${'poiȩ̄̃'}           | ${'poih=|'}
    ${'Áïda'}           | ${'A)/i+da'}
    ${'bárbaros'}       | ${'ba/rbaros'}
    ${'Hoplítēs'}       | ${'O(pli/ths'}
    ${'Húsiris'}        | ${'U(/siris'}
    ${'ō̧ṓdēs'}          | ${'w)|w/dhs'}
    ${'voĩ'}            | ${'voi='}
    ${'hágioc'}         | ${'a(/gioc'}
    ${'Xenophō̃n'}       | ${'Cenofw=n'}
    ${'chorēgéō'}       | ${'xorhge/w'}
    ${'āăē'}            | ${'a)%26a%27h'}
    ${aristotle.tr}     | ${aristotle.bc}
  `('Basic conversion', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'anqrwpos'}
    ${'kalòs kagathós'} | ${'kalos kagaqos'}
    ${'autónomos'}      | ${'autonomos'}
    ${'huiós'}          | ${'uios'}
    ${'Huiós'}          | ${'Uios'}
    ${'poiȩ̄̃'}           | ${'poih'}
    ${'Áïda'}           | ${'Aida'}
    ${'bárbaros'}       | ${'barbaros'}
    ${'Hoplítēs'}       | ${'Opliths'}
    ${'Húsiris'}        | ${'Usiris'}
    ${'ō̧ṓdēs'}          | ${'wwdhs'}
    ${'voĩ'}            | ${'voi'}
    ${'hágioc'}         | ${'agioc'}
    ${'Xenophō̃n'}       | ${'Cenofwn'}
    ${'chorēgéō'}       | ${'xorhgew'}
    ${'āăē'}            | ${'aah'}
    ${aristotle.tr}     | ${aristotle.bcNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { removeDiacritics: true })).toBe(expected) })

  // @fixme(v0.13)
  test('Testing the combining dot below', () => {
    expect(toBetaCode('Pátroḳlos', KeyType.TRANSLITERATION, { useAdditionalChars: AdditionalChar.ALL })).toBe('Pa/tro#3los')
    expect(toBetaCode('Pátroḳlos', KeyType.TRANSLITERATION, { removeDiacritics: true, useAdditionalChars: AdditionalChar.ALL })).toBe('Patro#3los')
  })

  test.each`
    str             | expected
    ${'Ēṓs'}        | ${'H)w/s'}
    ${'aísthēsis'}  | ${'ai)/sqhsis'}
    ${'Aĩa'}        | ${'Ai)=a'}
    ${'áülos'}      | ${'a)/u+los'}
    ${'huḯdion'}    | ${'u(i+/dion'}
  `('Testing breathings placement rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str           | expected
    ${'ka̓́n'}      | ${'ka)/n'}
    ${'tau̓tó'}    | ${'tau)to/'}
  `('Testing coronides', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str              | expected
    ${'Ródos'}       | ${'Ro/dos'}
    ${'Rhódos'}      | ${'R(o/dos'}
    ${'polúrrizos'}  | ${'polu/rrizos'}
    ${'polúrrhizos'} | ${'polu/rrizos'}
    ${'mármaros'}    | ${'ma/rmaros'}
  `('Testing rho rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test.each`
    str            | expected
    ${'ánthrôpos'} | ${'a)/nqrwpos'}
    ${'Hoplítês'}  | ${'O(pli/ths'}
    ${'Xenophỗn'}  | ${'Cenofw=n'}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  test('Applying beta_v', () => {
    expect(toBetaCode('várvaros', KeyType.TRANSLITERATION, { setTransliterationStyle: { beta_v: true } }))
      .toBe('ba/rbaros')
  })

  test('Applying eta_i', () => {
    expect(toBetaCode('hīdonī́', KeyType.TRANSLITERATION, { setTransliterationStyle: { eta_i: true } }))
      .toBe('h(donh/')
  })

  test('Applying eta_i', () => {
    expect(toBetaCode('hîdonî́', KeyType.TRANSLITERATION, { setTransliterationStyle: { useCxOverMacron: true, eta_i: true } }))
      .toBe('h(donh/')
  })
  
  test.each`
    str            | expected
    ${'fantasía'}  | ${'fantasi/a'}
    ${'Fainṓ'}     | ${'Fainw/'}
    ${'FILOSOFIA'} | ${'FILOSOFIA'}
  `('Applying phi_f', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { phi_f: true } })).toBe(expected) })

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

  test('Using additional letters', () => {
    expect(toBetaCode('wWjJcCc̄C̄qQḳḲs̄S̄', KeyType.TRANSLITERATION, { useAdditionalChars: AdditionalChar.ALL })).toBe('vVjJs3S3#2*#2#1*#1#3*#3#5*#5')
    expect(toBetaCode('wWcC', KeyType.TRANSLITERATION, { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('vVs3S3')
    expect(toBetaCode('qQḳḲs̄S̄', KeyType.TRANSLITERATION, { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('qQk?K?s%26S%26')
  })

  // @fixme(v0.13): check if rough breathings diphthongs rules must be overridden when converting from
  // transliteration to beta code, as 'HUIÓS' -> 'UI(O/S' but 'ὙΙΌΣ' produces 'U(IO/S' (greek to beta code).
  test.each`
    str             | expected
    ${'BÁRBAROS'}   | ${'BA/RBAROS'}
    ${'RHÓDOS'}     | ${'R(O/DOS'}
    ${'POLÚRRIZOS'} | ${'POLU/RRIZOS'}
    ${'SUSSEISMÓS'} | ${'SUSSEISMO/S'}
    ${'APSEGḖS'}    | ${'A)YEGH/S'}
    ${'HUIÓS'}      | ${'UI(O/S'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  test('Testing whitespace behavior', () => {
    expect(toBetaCode('aíx   kriós', KeyType.TRANSLITERATION)).toBe('ai)/c   krio/s')
    expect(toBetaCode('aíx   kriós', KeyType.TRANSLITERATION, { removeExtraWhitespace: true })).toBe('ai)/c krio/s')
  })
})
