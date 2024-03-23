import { AdditionalChar, Coronis, KeyType, Preset, toBetaCode } from '../src/index'

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

  // Basic conversion
  
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

  // Removing diacritics

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

  // Testing useTLGStyle / TLG preset

  test.each`
    str           | expected
    ${'ἄνθρωπος'} | ${'A)/NQRWPOS'}
    ${'Ὁπλίτης'}  | ${'*(OPLI/THS'}
    ${'Ἄϊδα'}     | ${'*)/AI+DA'}
    ${'ΠΟΙῌ͂'}     | ${'*P*O*I*=H|'}
    ${'ῬΌΔΟΣ'}    | ${'*(R*/O*D*O*S'}
  `('Testing useTLGStyle / TLG preset', ({ str, expected }) => {
    expect(toBetaCode(str, KeyType.GREEK, { betaCodeStyle: { useTLGStyle: true } })).toBe(expected)
    expect(toBetaCode(str, KeyType.GREEK, Preset.TLG)).toBe(expected)
  })

  // Disabling beta variant

  test('Disabling beta variant', () => {
    expect(toBetaCode('βάρβαρος', KeyType.GREEK, { greekStyle: { disableBetaVariant: true } })).toBe('ba/rbaros')
  })

  // Testing rho rules

  test.each`
    str             | expected
    ${'Ρόδος'}      | ${'Ro/dos'}
    ${'Ῥόδος'}      | ${'R(o/dos'}
    ${'πολύρριζος'} | ${'polu/rrizos'}
    ${'πολύῤῥιζος'} | ${'polu/r)r(izos'}
    ${'μάρμαρος'}   | ${'ma/rmaros'}
  `('Testing rho rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  // Applying xi_ks / chi_kh

  test.each`
    str          | expected
    ${'Ξενοφῶν'} | ${'Cenofw=n'}
    ${'χορηγέω'} | ${'xorhge/w'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { transliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Using additional letters

  test('Using additional letters', () => {
    expect(toBetaCode('ϝϜ\u03F3\u037F\u03F2\u03F9\u03DB\u03DAϟϞϙϘϡϠ', KeyType.GREEK, { additionalChars: AdditionalChar.ALL })).toBe('vVjJs3S3#2*#2#1*#1#3*#3#5*#5')
    expect(toBetaCode('ϝϜ\u03F2\u03F9', KeyType.GREEK, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('vVs3S3')
    expect(toBetaCode('\u03F3\u037F\u03DB\u03DAϟϞϡϠ', KeyType.GREEK, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('')
  })

  // Testing uppercase writing

  test.each`
    str             | expected
    ${'ΒΆΡΒΑΡΟΣ'}   | ${'BA/RBAROS'}
    ${'ῬΌΔΟΣ'}      | ${'R(O/DOS'}
    ${'ΠΟΛΎΡΡΙΖΟΣ'} | ${'POLU/RRIZOS'}
    ${'ΣΥΣΣΕΙΣΜΌΣ'} | ${'SUSSEISMO/S'}
    ${'ἈΨΕΓΉΣ'}     | ${'A)YEGH/S'}
    ${'ΥἹΌΣ'}       | ${'UI(O/S'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  // Testing whitespace behavior

  test('Testing whitespace behavior', () => {
    expect(toBetaCode('αἴξ   κριός', KeyType.GREEK)).toBe('ai)/c   krio/s')
    expect(toBetaCode('αἴξ   κριός', KeyType.GREEK, { removeExtraWhitespace: true })).toBe('ai)/c krio/s')
  })

  // Testing correctness with various word separators

  test('Testing correctness with various word separators', () => {
    expect(toBetaCode('Ρόδος\nΡόδος\tΡόδος Ρόδος', KeyType.GREEK)).toBe('Ro/dos\nRo/dos\tRo/dos Ro/dos')
    expect(toBetaCode('Ῥόδος\nῬόδος\tῬόδος Ῥόδος', KeyType.GREEK)).toBe('R(o/dos\nR(o/dos\tR(o/dos R(o/dos')
  })

  // Testing diacritics order

  test.each`
    str        | expected
    ${'ἀΰλως'} | ${'a)u+/lws'}
    ${'ᾖ'}     | ${'h)=|'}
    ${'ᾧ'}     | ${'w(=|'}
  `('Testing diacritics order', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

})

describe('From transliteration to beta code', () => {

  // Basic conversion

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

  // Removing diacritics

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

  // Testing useTLGStyle / TLG preset

  test.each`
    str            | expected
    ${'ánthrōpos'} | ${'A)/NQRWPOS'}
    ${'Hoplítēs'}  | ${'*(OPLI/THS'}
    ${'Áïda'}      | ${'*)/AI+DA'}
    ${'POIȨ̄̃'}      | ${'*P*O*I*=H|'}
    ${'RHÓDOS'}    | ${'*(R*/O*D*O*S'}
  `('Testing useTLGStyle / TLG preset', ({ str, expected }) => {
    expect(toBetaCode(str, KeyType.TRANSLITERATION, { betaCodeStyle: { useTLGStyle: true } })).toBe(expected)
    expect(toBetaCode(str, KeyType.TRANSLITERATION, Preset.TLG)).toBe(expected)
  })

  // Testing the combining dot below

  test('Testing the combining dot below', () => {
    expect(toBetaCode('Pátroḳlos', KeyType.TRANSLITERATION, { additionalChars: AdditionalChar.ALL })).toBe('Pa/tro#3los')
    expect(toBetaCode('Pátroḳlos', KeyType.TRANSLITERATION, { removeDiacritics: true, additionalChars: AdditionalChar.ALL })).toBe('Patro#3los')
  })

  // Testing breathings placement rules

  test.each`
    str             | expected
    ${'Ēṓs'}        | ${'H)w/s'}
    ${'aísthēsis'}  | ${'ai)/sqhsis'}
    ${'Aĩa'}        | ${'Ai)=a'}
    ${'áülos'}      | ${'a)/u+los'}
    ${'huḯdion'}    | ${'u(i+/dion'}
  `('Testing breathings placement rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing coronides

  test.each`
    str        | expected
    ${'ka̓gṓ'}  | ${'ka)gw/'}
    ${'ka̓́n'}   | ${'ka)/n'}
    ${'ka’gṓ'} | ${'kagw/'}
    ${'ká’n'}  | ${'ka/n'}
  `('Testing coronides', ({ str, expected }) => expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected))

  // Testing coronides, using coronis style
  
  test.each`
    str       | expected
    ${'ka̓gṓ'} | ${'ka)gw/'}
    ${'ka̓́n'}  | ${'ka)/n'}
    ${'ká’n'} | ${'ka/n'}
  `('Testing coronides, using coronis style (PSILI)', ({ str, expected }) => expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.PSILI } })).toBe(expected))

  test.each`
    str        | expected
    ${'ka’gṓ'} | ${'ka)gw/'}
    ${'ká’n'}  | ${'ka)/n'}
    ${'ka̓́n'}   | ${'ka)/n'}
  `('Testing coronides, using coronis style (APOSTROPHE)', ({ str, expected }) => expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.APOSTROPHE } })).toBe(expected))

  test.each`
    str        | expected
    ${'ka̓gṓ'}  | ${'ka)gw/'}
    ${'ka’gṓ'} | ${'kagw/'}
    ${'ka̓́n'}   | ${'ka)/n'}
    ${'ká’n'}  | ${'ka/n'}
  `('Testing coronides, using coronis style (NO)', ({ str, expected }) => expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.NO } })).toBe(expected))

  // Testing gamma nasals

  test.each`
    str           | expected
    ${'ángelos'}  | ${'a)/ggelos'}
    ${'spóngos'}  | ${'spo/ggos'} 
    ${'ánkura'}   | ${'a)/gkura'}
    ${'sphínx'}   | ${'sfi/gc'} 
    ${'tunchánō'} | ${'tugxa/nw'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing gamma nasals with xi_ks / chi_kh enabled

  test.each`
    str           | expected
    ${'sphínks'}  | ${'sfi/gc'}
    ${'tunkhánō'} | ${'tugxa/nw'}
  `('Testing gamma nasals with xi_ks / chi_kh enabled', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Testing rho rules

  test.each`
    str              | expected
    ${'Ródos'}       | ${'Ro/dos'}
    ${'Rhódos'}      | ${'R(o/dos'}
    ${'polúrrizos'}  | ${'polu/rrizos'}
    ${'polúrrhizos'} | ${'polu/rrizos'}
    ${'mármaros'}    | ${'ma/rmaros'}
  `('Testing rho rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Using circumflex on long vowels

  test.each`
    str            | expected
    ${'ánthrôpos'} | ${'a)/nqrwpos'}
    ${'Hoplítês'}  | ${'O(pli/ths'}
    ${'Xenophỗn'}  | ${'Cenofw=n'}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  // Applying beta_v

  test('Applying beta_v', () => {
    expect(toBetaCode('várvaros', KeyType.TRANSLITERATION, { transliterationStyle: { beta_v: true } }))
      .toBe('ba/rbaros')
  })

  // Applying eta_i

  test('Applying eta_i', () => {
    expect(toBetaCode('hīdonī́', KeyType.TRANSLITERATION, { transliterationStyle: { eta_i: true } }))
      .toBe('h(donh/')
  })

  // Applying eta_i, using circumflex

  test('Applying eta_i, using circumflex', () => {
    expect(toBetaCode('hîdonî́', KeyType.TRANSLITERATION, { transliterationStyle: { useCxOverMacron: true, eta_i: true } }))
      .toBe('h(donh/')
  })

  // Applying muPi_b

  test('Applying muPi_b', () => {
    expect(toBetaCode('Brant Pit', KeyType.TRANSLITERATION, { transliterationStyle: { muPi_b: true } }))
      .toBe('Brant Pit')
  })

  // Applying muPi_b, with beta_v

  test('Applying muPi_b, with beta_v', () => {
    expect(toBetaCode('Brant Pit', KeyType.TRANSLITERATION, { transliterationStyle: { muPi_b: true, beta_v: true } }))
      .toBe('Mprant Pit')
  })

  // Applying nuTau_d
  
  test('Applying nuTau_d', () => {
    expect(toBetaCode('D̲aíēvint Mítsel', KeyType.TRANSLITERATION, { transliterationStyle: { nuTau_d: true } }))
      .toBe('Ntai/hvint Mi/tsel')
  })

  // Applying phi_f
  
  test.each`
    str            | expected
    ${'fantasía'}  | ${'fantasi/a'}
    ${'Fainṓ'}     | ${'Fainw/'}
    ${'FILOSOFIA'} | ${'FILOSOFIA'}
  `('Applying phi_f', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { phi_f: true } })).toBe(expected) })

  // Applying xi_ks / chi_kh

  test.each`
    str            | expected
    ${'Ksenophȭn'} | ${'Cenofw=n'}
    ${'khorēgéō'}  | ${'xorhge/w'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Applying upsilon_y

  test.each`
    str            | expected
    ${'hybrís'}    | ${'u(bri/s'}
    ${'autómatos'} | ${'au)to/matos'}
    ${'áÿlos'}     | ${'a)/u+los'}
    ${'hyḯdion'}   | ${'u(i+/dion'}
    ${'hýdōr'}     | ${'u(/dwr'}
    ${'Hýbla'}     | ${'U(/bla'}
    ${'ý hỹ'}      | ${'u)/ u(='}
  `('Applying upsilon_y', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { upsilon_y: true } })).toBe(expected) })

  // Using additional letters

  test('Using additional letters', () => {
    expect(toBetaCode('wWjJcCc̄C̄qQḳḲs̄S̄', KeyType.TRANSLITERATION, { additionalChars: AdditionalChar.ALL })).toBe('vVjJs3S3#2*#2#1*#1#3*#3#5*#5')
    expect(toBetaCode('wWcC', KeyType.TRANSLITERATION, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('vVs3S3')
    expect(toBetaCode('qQḳḲs̄S̄', KeyType.TRANSLITERATION, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('qQk?K?s%26S%26')
  })

  // Testing uppercase writing

  test.each`
    str             | expected
    ${'BÁRBAROS'}   | ${'BA/RBAROS'}
    ${'RHÓDOS'}     | ${'R(O/DOS'}
    ${'POLÚRRIZOS'} | ${'POLU/RRIZOS'}
    ${'SUSSEISMÓS'} | ${'SUSSEISMO/S'}
    ${'APSEGḖS'}    | ${'A)YEGH/S'}
    ${'HUIÓS'}      | ${'UI(O/S'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing whitespace behavior

  test('Testing whitespace behavior', () => {
    expect(toBetaCode('aíx   kriós', KeyType.TRANSLITERATION)).toBe('ai)/c   krio/s')
    expect(toBetaCode('aíx   kriós', KeyType.TRANSLITERATION, { removeExtraWhitespace: true })).toBe('ai)/c krio/s')
  })

  // Testing diacritics order

  test.each`
    str        | expected
    ${'aǘlōs'} | ${'a)u+/lws'}
    ${'ȩ̄̃'}     | ${'h)=|'}
    ${'hō̧̃'}    | ${'w(=|'}
  `('Testing diacritics order', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

})

describe('Self-conversion', () => {

  // Testing gamma nasals

  test.each`
    str            | expected
    ${'a)/ngelos'} | ${'a)/ggelos'}
    ${'spo/ngos'}  | ${'spo/ggos'} 
    ${'a)/nkura'}  | ${'a)/gkura'}
    ${'sfi/nc'}    | ${'sfi/gc'} 
    ${'tunxa/nw'}  | ${'tugxa/nw'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toBetaCode(str, KeyType.BETA_CODE)).toBe(expected) })

  // Testing useTLGStyle / TLG preset

  test.each`
    str               | expected
    ${'a)/nqrwpos'}   | ${'A)/NQRWPOS'}
    ${'O(pli/ths'}    | ${'*(OPLI/THS'}
    ${'A)/i+da'}      | ${'*)/AI+DA'}
    ${'POIH=|'}       | ${'*P*O*I*=H|'}
    ${'R(O/DOS'}      | ${'*(R*/O*D*O*S'}
  `('Testing useTLGStyle / TLG preset', ({ str, expected }) => {
    expect(toBetaCode(str, KeyType.BETA_CODE, { betaCodeStyle: { useTLGStyle: true } })).toBe(expected)
    expect(toBetaCode(str, KeyType.BETA_CODE, Preset.TLG)).toBe(expected)
  })

  // Testing TLG beta code input

  test('Testing TLG beta code input', () => {
    expect(toBetaCode('*(OPLI/THS', KeyType.TLG_BETA_CODE)).toBe('O(pli/ths')
    expect(toBetaCode('*(OPLI/THS', KeyType.TLG_BETA_CODE, Preset.TLG)).toBe('*(OPLI/THS')
  })

  // Testing diacritics order

  test.each`
    str           | expected
    ${'a)u/+lws'} | ${'a)u+/lws'}
    ${'h|)='}     | ${'h)=|'}
    ${'w|(='}     | ${'w(=|'}
  `('Testing diacritics order', ({ str, expected }) => { expect(toBetaCode(str, KeyType.BETA_CODE)).toBe(expected) })
  
  // Testing beta code string normalization

  test.each`
    str                   | expected
    ${'ánqrwpos'}         | ${'anqrwpos'}
    ${'h̔méra'}            | ${'hmera'}
    ${'a(/gios, o)/ros.'} | ${'a(/gios, o)/ros.'}
    ${'a))nh//r'}         | ${'a)nh/r'}
  `('Testing beta code string normalization', ({ str, expected }) => expect(toBetaCode(str, KeyType.BETA_CODE)).toBe(expected))

})
