import { AdditionalChar, Coronis, KeyType, Preset, toBetaCode } from '../src/index'
import { IConversionOptions } from '../src/interfaces'

/*
 * Special characters:
 *   - \u03D0 = Greek Beta Symbol
 *   - \u03F2 = Greek Lunate Sigma Symbol
 */

const aristotle = {
  gr: 'Ἐκεῖναι μὲν δὴ φυσικῆς μετὰ κινήσεως γάρ, αὕτη δὲ ἑτέρας, εἰ μηδεμία αὐτοῖς ἀρχὴ κοινή.',
  tr: 'Ekeĩnai mèn dḕ phusikē̃s metà kinḗseōs gár, haútē dè hetéras, ei mēdemía autoĩs archḕ koinḗ.',
  bc: '*)EKEI=NAI ME\\N DH\\ FUSIKH=S META\\ KINH/SEWS GA/R, AU(/TH DE\\ E(TE/RAS, EI) MHDEMI/A AU)TOI=S A)RXH\\ KOINH/.',
  bcNoAcc: '*EKEINAI MEN DH FUSIKHS META KINHSEWS GAR, AUTH DE ETERAS, EI MHDEMIA AUTOIS ARXH KOINH.'
}

describe('From greek to beta code', () => {

  // Basic conversion
  
  test.each`
    str                | expected
    ${'ἄνθρωπος'}      | ${'A)/NQRWPOS'}
    ${'καλὸς κἀγαθός'} | ${'KALO\\S KA)GAQO/S'}
    ${'αὐτόνομος'}     | ${'AU)TO/NOMOS'}
    ${'ποιῇ'}          | ${'POIH=|'}
    ${'Ἄϊδα'}          | ${'*)/AI+DA'}
    ${'βάρ\u03D0αρος'} | ${'BA/RBAROS'}
    ${'Ὕσιρις'}        | ${'*(/USIRIS'}
    ${'wοῖ'}           | ${'WOI='}
    ${'ἅγιοc'}         | ${'A(/GIOC'}
    ${'Ξενοφῶν'}       | ${'*CENOFW=N'}
    ${'χορηγέω'}       | ${'XORHGE/W'}
    ${'ποῦ;'}          | ${'POU=;'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}    | ${'A)%27A%26EHI%27I%26OWU%27U%26'}
    ${aristotle.gr}    | ${aristotle.bc}
  `('Basic conversion', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  // Removing diacritics

  test.each`
    str                | expected
    ${'ανθρωπος'}      | ${'ANQRWPOS'}
    ${'καλὸς κἀγαθός'} | ${'KALOS KAGAQOS'}
    ${'αὐτόνομος'}     | ${'AUTONOMOS'}
    ${'ποιῇ'}          | ${'POIH'}
    ${'Ἄϊδα'}          | ${'*AIDA'}
    ${'βάρ\u03D0αρος'} | ${'BARBAROS'}
    ${'Ὕσιρις'}        | ${'*USIRIS'}
    ${'wοῖ'}           | ${'WOI'}
    ${'ἅγιοc'}         | ${'AGIOC'}
    ${'Ξενοφῶν'}       | ${'*CENOFWN'}
    ${'χορηγέω'}       | ${'XORHGEW'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}    | ${'AAEHIIOWUU'}
    ${aristotle.gr}    | ${aristotle.bcNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { removeDiacritics: true })).toBe(expected) })

  // Testing rho rules

  test.each`
    str             | expected
    ${'Ρόδος'}      | ${'*RO/DOS'}
    ${'Ῥόδος'}      | ${'*(RO/DOS'}
    ${'πολύρριζος'} | ${'POLU/RRIZOS'}
    ${'πολύῤῥιζος'} | ${'POLU/R)R(IZOS'}
    ${'μάρμαρος'}   | ${'MA/RMAROS'}
  `('Testing rho rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  // Applying xi_ks / chi_kh

  test.each`
    str          | expected
    ${'Ξενοφῶν'} | ${'*CENOFW=N'}
    ${'χορηγέω'} | ${'XORHGE/W'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK, { transliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Using additional letters

  test('Using additional letters', () => {
    expect(toBetaCode('ϝϜ\u03F3\u037F\u03F2\u03F9\u03DB\u03DAϟϞϙϘϡϠ', KeyType.GREEK, { additionalChars: AdditionalChar.ALL })).toBe('V*VJ*JS3*S3#2*#2#1*#1#3*#3#5*#5')
    expect(toBetaCode('ϝϜ\u03F2\u03F9', KeyType.GREEK, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('V*VS3*S3')
    expect(toBetaCode('\u03F3\u037F\u03DB\u03DAϟϞϡϠ', KeyType.GREEK, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('')
  })

  // Testing uppercase writing

  test.each`
    str             | expected
    ${'ΒΆΡΒΑΡΟΣ'}   | ${'*B*/A*R*B*A*R*O*S'}
    ${'ῬΌΔΟΣ'}      | ${'*(R*/O*D*O*S'}
    ${'ΠΟΛΎΡΡΙΖΟΣ'} | ${'*P*O*L*/U*R*R*I*Z*O*S'}
    ${'ΣΥΣΣΕΙΣΜΌΣ'} | ${'*S*U*S*S*E*I*S*M*/O*S'}
    ${'ἈΨΕΓΉΣ'}     | ${'*)A*Y*E*G*/H*S'}
    ${'ΥἹΌΣ'}       | ${'*U*(I*/O*S'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

  // Testing whitespace behavior

  test('Testing whitespace behavior', () => {
    expect(toBetaCode('αἴξ   κριός', KeyType.GREEK)).toBe('AI)/C   KRIO/S')
    expect(toBetaCode('αἴξ   κριός', KeyType.GREEK, { removeExtraWhitespace: true })).toBe('AI)/C KRIO/S')
  })

  // Testing correctness with various word separators

  test('Testing correctness with various word separators', () => {
    expect(toBetaCode('Ρόδος\nΡόδος\tΡόδος Ρόδος', KeyType.GREEK)).toBe('*RO/DOS\n*RO/DOS\t*RO/DOS *RO/DOS')
    expect(toBetaCode('Ῥόδος\nῬόδος\tῬόδος Ῥόδος', KeyType.GREEK)).toBe('*(RO/DOS\n*(RO/DOS\t*(RO/DOS *(RO/DOS')
  })

  // Testing diacritics order

  test.each`
    str        | expected
    ${'ἀΰλως'} | ${'A)U+/LWS'}
    ${'ᾖ'}     | ${'H)=|'}
    ${'ᾧ'}     | ${'W(=|'}
  `('Testing diacritics order', ({ str, expected }) => { expect(toBetaCode(str, KeyType.GREEK)).toBe(expected) })

})

describe('From transliteration to beta code', () => {

  // Basic conversion

  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'A)/NQRWPOS'}
    ${'kalòs kagathós'} | ${'KALO\\S KAGAQO/S'}
    ${'autónomos'}      | ${'AU)TO/NOMOS'}
    ${'huiós'}          | ${'UI(O/S'}
    ${'Huiós'}          | ${'*UI(O/S'}
    ${'poiȩ̄̃'}           | ${'POIH=|'}
    ${'Áïda'}           | ${'*)/AI+DA'}
    ${'bárbaros'}       | ${'BA/RBAROS'}
    ${'Hoplítēs'}       | ${'*(OPLI/THS'}
    ${'Húsiris'}        | ${'*(/USIRIS'}
    ${'ō̧ṓdēs'}          | ${'W)|W/DHS'}
    ${'voĩ'}            | ${'VOI='}
    ${'hágioc'}         | ${'A(/GIOC'}
    ${'Xenophō̃n'}       | ${'*CENOFW=N'}
    ${'chorēgéō'}       | ${'XORHGE/W'}
    ${'poũ?'}           | ${'POU=;'}
    ${'āăē'}            | ${'A)%26A%27H'}
    ${aristotle.tr}     | ${aristotle.bc}
  `('Basic conversion', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Removing diacritics

  test.each`
    str                 | expected
    ${'ánthrōpos'}      | ${'ANQRWPOS'}
    ${'kalòs kagathós'} | ${'KALOS KAGAQOS'}
    ${'autónomos'}      | ${'AUTONOMOS'}
    ${'huiós'}          | ${'UIOS'}
    ${'Huiós'}          | ${'*UIOS'}
    ${'poiȩ̄̃'}           | ${'POIH'}
    ${'Áïda'}           | ${'*AIDA'}
    ${'bárbaros'}       | ${'BARBAROS'}
    ${'Hoplítēs'}       | ${'*OPLITHS'}
    ${'Húsiris'}        | ${'*USIRIS'}
    ${'ō̧ṓdēs'}          | ${'WWDHS'}
    ${'voĩ'}            | ${'VOI'}
    ${'hágioc'}         | ${'AGIOC'}
    ${'Xenophō̃n'}       | ${'*CENOFWN'}
    ${'chorēgéō'}       | ${'XORHGEW'}
    ${'āăē'}            | ${'AAH'}
    ${aristotle.tr}     | ${aristotle.bcNoAcc}
  `('Removing diacritics', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { removeDiacritics: true })).toBe(expected) })

  // Testing the combining dot below

  test('Testing the combining dot below', () => {
    expect(toBetaCode('Pátroḳlos', KeyType.TRANSLITERATION, { additionalChars: AdditionalChar.ALL })).toBe('*PA/TRO#3LOS')
    expect(toBetaCode('Pátroḳlos', KeyType.TRANSLITERATION, { removeDiacritics: true, additionalChars: AdditionalChar.ALL })).toBe('*PATRO#3LOS')
  })

  // Testing breathings placement rules

  test.each`
    str             | expected
    ${'Ēṓs'}        | ${'*)HW/S'}
    ${'aísthēsis'}  | ${'AI)/SQHSIS'}
    ${'Aĩa'}        | ${'*AI)=A'}
    ${'áülos'}      | ${'A)/U+LOS'}
    ${'huḯdion'}    | ${'U(I+/DION'}
  `('Testing breathings placement rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing coronides

  test.each`
    str        | expected
    ${'ka̓gṓ'}  | ${'KA)GW/'}
    ${'ka̓́n'}   | ${'KA)/N'}
    ${'ka’gṓ'} | ${'KAGW/'}
    ${'ká’n'}  | ${'KA/N'}
  `('Testing coronides', ({ str, expected }) => expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected))

  // Testing coronides, using coronis style
  
  test.each`
    str       | expected
    ${'ka̓gṓ'} | ${'KA)GW/'}
    ${'ka̓́n'}  | ${'KA)/N'}
    ${'ká’n'} | ${'KA/N'}
  `('Testing coronides, using coronis style (PSILI)', ({ str, expected }) => expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.PSILI } })).toBe(expected))

  test.each`
    str        | expected
    ${'ka’gṓ'} | ${'KA)GW/'}
    ${'ká’n'}  | ${'KA)/N'}
    ${'ka̓́n'}   | ${'KA)/N'}
  `('Testing coronides, using coronis style (APOSTROPHE)', ({ str, expected }) => expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.APOSTROPHE } })).toBe(expected))

  test.each`
    str        | expected
    ${'ka̓gṓ'}  | ${'KA)GW/'}
    ${'ka’gṓ'} | ${'KAGW/'}
    ${'ka̓́n'}   | ${'KA)/N'}
    ${'ká’n'}  | ${'KA/N'}
  `('Testing coronides, using coronis style (NO)', ({ str, expected }) => expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { setCoronisStyle: Coronis.NO } })).toBe(expected))

  // Testing gamma nasals

  test.each`
    str           | expected
    ${'ángelos'}  | ${'A)/GGELOS'}
    ${'spóngos'}  | ${'SPO/GGOS'} 
    ${'ánkura'}   | ${'A)/GKURA'}
    ${'sphínx'}   | ${'SFI/GC'} 
    ${'tunchánō'} | ${'TUGXA/NW'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing gamma nasals with xi_ks / chi_kh enabled

  test.each`
    str           | expected
    ${'sphínks'}  | ${'SFI/GC'}
    ${'tunkhánō'} | ${'TUGXA/NW'}
  `('Testing gamma nasals with xi_ks / chi_kh enabled', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Testing rho rules

  test.each`
    str              | expected
    ${'Ródos'}       | ${'*RO/DOS'}
    ${'Rhódos'}      | ${'*(RO/DOS'}
    ${'polúrrizos'}  | ${'POLU/RRIZOS'}
    ${'polúrrhizos'} | ${'POLU/RRIZOS'}
    ${'mármaros'}    | ${'MA/RMAROS'}
  `('Testing rho rules', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Using circumflex on long vowels

  test.each`
    str            | expected
    ${'ánthrôpos'} | ${'A)/NQRWPOS'}
    ${'Hoplítês'}  | ${'*(OPLI/THS'}
    ${'Xenophỗn'}  | ${'*CENOFW=N'}
  `('Using circumflex on long vowels', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { useCxOverMacron: true } })).toBe(expected) })

  // Applying beta_v

  test('Applying beta_v', () => {
    expect(toBetaCode('várvaros', KeyType.TRANSLITERATION, { transliterationStyle: { beta_v: true } }))
      .toBe('BA/RBAROS')
  })

  // Applying eta_i

  test('Applying eta_i', () => {
    expect(toBetaCode('hīdonī́', KeyType.TRANSLITERATION, { transliterationStyle: { eta_i: true } }))
      .toBe('H(DONH/')
  })

  // Applying eta_i, using circumflex

  test('Applying eta_i, using circumflex', () => {
    expect(toBetaCode('hîdonî́', KeyType.TRANSLITERATION, { transliterationStyle: { useCxOverMacron: true, eta_i: true } }))
      .toBe('H(DONH/')
  })

  // Applying muPi_b

  test('Applying muPi_b', () => {
    expect(toBetaCode('Brant Pit', KeyType.TRANSLITERATION, { transliterationStyle: { muPi_b: true } }))
      .toBe('*BRANT *PIT')
  })

  // Applying muPi_b, with beta_v

  test('Applying muPi_b, with beta_v', () => {
    expect(toBetaCode('Brant Pit', KeyType.TRANSLITERATION, { transliterationStyle: { muPi_b: true, beta_v: true } }))
      .toBe('*MPRANT *PIT')
  })

  // Applying nuTau_d
  
  test('Applying nuTau_d', () => {
    expect(toBetaCode('D̲aíēvint Mítsel', KeyType.TRANSLITERATION, { transliterationStyle: { nuTau_d: true } }))
      .toBe('*NTAI/HVINT *MI/TSEL')
  })

  // Applying phi_f
  
  test.each`
    str            | expected
    ${'fantasía'}  | ${'FANTASI/A'}
    ${'Fainṓ'}     | ${'*FAINW/'}
    ${'FILOSOFIA'} | ${'*F*I*L*O*S*O*F*I*A'}
  `('Applying phi_f', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { phi_f: true } })).toBe(expected) })

  // Applying xi_ks / chi_kh

  test.each`
    str            | expected
    ${'Ksenophȭn'} | ${'*CENOFW=N'}
    ${'khorēgéō'}  | ${'XORHGE/W'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Applying upsilon_y

  test.each`
    str            | expected
    ${'hybrís'}    | ${'U(BRI/S'}
    ${'autómatos'} | ${'AU)TO/MATOS'}
    ${'áÿlos'}     | ${'A)/U+LOS'}
    ${'hyḯdion'}   | ${'U(I+/DION'}
    ${'hýdōr'}     | ${'U(/DWR'}
    ${'Hýbla'}     | ${'*(/UBLA'}
    ${'ý hỹ'}      | ${'U)/ U(='}
  `('Applying upsilon_y', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION, { transliterationStyle: { upsilon_y: true } })).toBe(expected) })

  // Using additional letters

  test('Using additional letters', () => {
    expect(toBetaCode('wWjJcCc̄C̄qQḳḲs̄S̄', KeyType.TRANSLITERATION, { additionalChars: AdditionalChar.ALL })).toBe('V*VJ*JS3*S3#2*#2#1*#1#3*#3#5*#5')
    expect(toBetaCode('wWcC', KeyType.TRANSLITERATION, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('V*VS3*S3')
    expect(toBetaCode('qQḳḲs̄S̄', KeyType.TRANSLITERATION, { additionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA] })).toBe('Q*QK?*?KS%26*S%26')
  })

  // Using additional letters stigma and sampi, using circumflex

  test('Using additional letters stigma and sampi, using circumflex', () => {
    expect(toBetaCode('ĉĈŝŜ', KeyType.TRANSLITERATION, {
        transliterationStyle: { useCxOverMacron: true },
        additionalChars: [AdditionalChar.STIGMA, AdditionalChar.SAMPI]
    }))
    .toBe('#2*#2#5*#5')})

  // Testing uppercase writing

  test.each`
    str             | expected
    ${'BÁRBAROS'}   | ${'*B*/A*R*B*A*R*O*S'}
    ${'RHÓDOS'}     | ${'*(R*/O*D*O*S'}
    ${'POLÚRRIZOS'} | ${'*P*O*L*/U*R*R*I*Z*O*S'}
    ${'SUSSEISMÓS'} | ${'*S*U*S*S*E*I*S*M*/O*S'}
    ${'APSEGḖS'}    | ${'*)A*Y*E*G*/H*S'}
    ${'HUIÓS'}      | ${'*U*(I*/O*S'}
  `('Testing uppercase writing', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

  // Testing whitespace behavior

  test('Testing whitespace behavior', () => {
    expect(toBetaCode('aíx   kriós', KeyType.TRANSLITERATION)).toBe('AI)/C   KRIO/S')
    expect(toBetaCode('aíx   kriós', KeyType.TRANSLITERATION, { removeExtraWhitespace: true })).toBe('AI)/C KRIO/S')
  })

  // Testing diacritics order

  test.each`
    str        | expected
    ${'aǘlōs'} | ${'A)U+/LWS'}
    ${'ȩ̄̃'}     | ${'H)=|'}
    ${'hō̧̃'}    | ${'W(=|'}
  `('Testing diacritics order', ({ str, expected }) => { expect(toBetaCode(str, KeyType.TRANSLITERATION)).toBe(expected) })

})

describe('Self-conversion', () => {

  // Testing gamma nasals

  test.each`
    str            | expected
    ${'a)/ngelos'} | ${'A)/GGELOS'}
    ${'spo/ngos'}  | ${'SPO/GGOS'} 
    ${'a)/nkura'}  | ${'A)/GKURA'}
    ${'sfi/nc'}    | ${'SFI/GC'} 
    ${'tunxa/nw'}  | ${'TUGXA/NW'}
  `('Testing gamma nasals', ({ str, expected }) => { expect(toBetaCode(str, KeyType.BETA_CODE)).toBe(expected) })

  // Testing diacritics order

  test.each`
    str           | expected
    ${'a)u/+lws'} | ${'A)U+/LWS'}
    ${'h|)='}     | ${'H)=|'}
    ${'w|(='}     | ${'W(=|'}
  `('Testing diacritics order', ({ str, expected }) => { expect(toBetaCode(str, KeyType.BETA_CODE)).toBe(expected) })
  
  // Testing beta code string normalization

  test.each`
    str                   | expected
    ${'ánqrwpos'}         | ${'ANQRWPOS'}
    ${'h̔méra'}            | ${'HMERA'}
    ${'a(/gios, o)/ros.'} | ${'A(/GIOS, O)/ROS.'}
    ${'a))nh//r'}         | ${'A)NH/R'}
  `('Testing beta code string normalization', ({ str, expected }) => expect(toBetaCode(str, KeyType.BETA_CODE)).toBe(expected))

  // Testing KeyType.SIMPLE_BETA_CODE to TLG conversion

  test.each`
    str               | expected
    ${'a)/nqrwpos'}   | ${'A)/NQRWPOS'}
    ${'O(pli/ths'}    | ${'*(OPLI/THS'}
    ${'A)/i+da'}      | ${'*)/AI+DA'}
    ${'POIH=|'}       | ${'*P*O*I*=H|'}
    ${'R(O/DOS'}      | ${'*(R*/O*D*O*S'}
  `('Testing KeyType.SIMPLE_BETA_CODE to TLG conversion', ({ str, expected }) => {
    expect(toBetaCode(str, KeyType.SIMPLE_BETA_CODE)).toBe(expected)
  })

  // Using lowercase

  test('Using lowercase', () => {
    const options: IConversionOptions = {
      betaCodeStyle: {
        useLowerCase: true
      }
    }
    expect(toBetaCode('A)/NQRWPOS', KeyType.BETA_CODE, options)).toBe('a)/nqrwpos')
    expect(toBetaCode('a)/nqrwpos', KeyType.SIMPLE_BETA_CODE, options)).toBe('a)/nqrwpos')
  })

})
