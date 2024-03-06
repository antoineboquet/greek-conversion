import { AdditionalChar, KeyType, Preset, toTransliteration } from '../src/index'

/*
 * Special characters:
 *   - \u03D0 = Greek Beta Symbol
 *   - \u03F2 = Greek Lunate Sigma Symbol
 */

const aristotle = {
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

describe('From beta code to transliteration', () => {

  // Basic conversion

  test.each`
    str                    | expected
    ${'a)/nqrwpos'}        | ${'ánthrōpos'}
    ${'kalo\\s ka)gaqo/s'} | ${'kalòs ka̓gathós'}
    ${'au)to/nomos'}       | ${'autónomos'}
    ${'poih|='}            | ${'poiȩ̄̃'}
    ${'A)/i+da'}           | ${'Áïda'}
    ${'ba/rbaros'}         | ${'bárbaros'}
    ${'O(pli/ths'}         | ${'Hoplítēs'}
    ${'voi='}              | ${'voĩ'}
    ${'a(/gios3'}          | ${'hágios3'}
    ${'a%26a%27h'}         | ${'āăē'}
    ${aristotle.bc}        | ${aristotle.tr}
  `('Basic conversion', ({ str, expected }) => expect(toTransliteration(str, KeyType.BETA_CODE)).toBe(expected))

  // Removing diacritics

  test.each`
    str                    | expected
    ${'a)/nqrwpos'}        | ${'anthrōpos'}
    ${'kalo\\s ka)gaqo/s'} | ${'kalos kagathos'}
    ${'au)to/nomos'}       | ${'autonomos'}
    ${'poih|='}            | ${'poiē'}
    ${'A)/i+da'}           | ${'Aida'}
    ${'ba/rbaros'}         | ${'barbaros'}
    ${'O(pli/ths'}         | ${'Hoplitēs'}
    ${'voi='}              | ${'voi'}
    ${'a(/gios3'}          | ${'hagios3'}
    ${'a%26a%27h'}         | ${'aaē'}
    ${aristotle.bc}        | ${aristotle.trNoAcc}
  `('Removing diacritics', ({ str, expected }) => expect(toTransliteration(str, KeyType.BETA_CODE, { removeDiacritics: true })).toBe(expected))

  // Testing rho rules

  test.each`
    str                | expected
    ${'Ro/dos'}        | ${'Ródos'}
    ${'R(o/dos'}       | ${'Rhódos'}
    ${'R(O/DOS'}       | ${'RHÓDOS'}
    ${'polu/rrizos'}   | ${'polúrrizos'}
    ${'polu/r)r(izos'} | ${'polúrrhizos'}
    ${'POLU/R)R(IZOS'} | ${'POLÚRRHIZOS'}
    ${'ma/rmaros'}     | ${'mármaros'}
  `('Testing rho rules', ({ str, expected }) => expect(toTransliteration(str, KeyType.BETA_CODE)).toBe(expected))

  // Testing rho rules, applying rho_rh

  test.each`
    str                | expected
    ${'Ro/dos'}        | ${'Rhódos'}
    ${'RO/DOS'}        | ${'RHÓDOS'}
    ${'R(o/dos'}       | ${'Rhódos'}
    ${'polu/rrizos'}   | ${'polúrrhizos'}
    ${'POLU/RRIZOS'}   | ${'POLÚRRHIZOS'}
    ${'polu/r)r(izos'} | ${'polúrrhizos'}
    ${'ma/rmaros'}     | ${'mármaros'}
  `('Testing rho rules, applying rho_rh', ({ str, expected }) => expect(toTransliteration(str, KeyType.BETA_CODE, { setTransliterationStyle: { rho_rh: true } })).toBe(expected))

  // Applying beta_v

  test('Applying beta_v', () => {
    expect(toTransliteration('ba/rbaros', KeyType.BETA_CODE, { setTransliterationStyle: { beta_v: true } }))
      .toBe('várvaros')
  })

  // Applying eta_i

  test('Applying eta_i', () => {
    expect(toTransliteration('h(donh/', KeyType.BETA_CODE, { setTransliterationStyle: { eta_i: true } }))
      .toBe('hīdonī́')
  })

  // Applying eta_i, using circumflex

  test('Applying eta_i', () => {
    expect(toTransliteration('h(donh/', KeyType.BETA_CODE, { setTransliterationStyle: { useCxOverMacron: true, eta_i: true } }))
      .toBe('hîdonî́')
  })
  
  // Applying phi_f

  test.each`
    str            | expected
    ${'fantasi/a'} | ${'fantasía'}
    ${'Fainw/'}    | ${'Fainṓ'}
    ${'FILOSOFIA'} | ${'FILOSOFIA'}
  `('Applying phi_f', ({ str, expected }) => { expect(toTransliteration(str, KeyType.BETA_CODE, { setTransliterationStyle: { phi_f: true } })).toBe(expected) })

  // Applying upsilon_y

  test.each`
    str              | expected
    ${'u(bri/s'}     | ${'hybrís'}
    ${'au)to/matos'} | ${'autómatos'}
    ${'a)/u+los'}    | ${'áÿlos'}
    ${'u(i+/dion'}   | ${'hyḯdion'}
    ${'u(/dwr'}      | ${'hýdōr'}
    ${'U(/bla'}      | ${'Hýbla'}
    ${'u)/ u(='}     | ${'ý hỹ'}
  `('Applying upsilon_y', ({ str, expected }) => expect(toTransliteration(str, KeyType.BETA_CODE, { setTransliterationStyle: { upsilon_y: true } })).toBe(expected))

  test('Using additional letters', () => {
    const enableAll = { useAdditionalChars: AdditionalChar.ALL }
    expect(toTransliteration('vVjJs3S3#2*#2#1*#1#3*#3#5*#5', KeyType.BETA_CODE, enableAll)).toBe('wWjJcCc̄C̄qQḳḲs̄S̄')
    
    const enableDigammaAndLunateSigma = { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA]}
    expect(toTransliteration('vVs3S3', KeyType.BETA_CODE, enableDigammaAndLunateSigma)).toBe('wWcC')
    expect(toTransliteration('#1*#1#3*#3#5*#5', KeyType.GREEK, enableDigammaAndLunateSigma)).toBe('#1*#1#3*#3#5*#5')
  })

  // Testing uppercase writing

  test.each`
    str               | expected
    ${'BA/RBAROS'}    | ${'BÁRBAROS'}
    ${'R(O/DOS'}      | ${'RHÓDOS'}
    ${'POLU/RRIZOS'}  | ${'POLÚRRIZOS'}
    ${'SUSSEISMO/S'}  | ${'SUSSEISMÓS'}
    ${'A)YEGH/S'}     | ${'APSEGḖS'}
    ${'UI(O/S'}       | ${'HUIÓS'}
  `('Testing uppercase writing', ({ str, expected }) => expect(toTransliteration(str, KeyType.BETA_CODE)).toBe(expected))

  // Testing whitespace behavior

  test('Testing whitespace behavior', () => {
    expect(toTransliteration('ai)/c   krio/s', KeyType.BETA_CODE)).toBe('aíx   kriós')
    expect(toTransliteration('ai)/c   krio/s', KeyType.BETA_CODE, { removeExtraWhitespace: true })).toBe('aíx kriós')
  })

  // Applying various diacritics order
  
  // v0.14 - broken orders: `w|=(`, `w=(|`, `w=|(`.
  /*test.each`
    str       | expected
    ${'w(|='} | ${'ᾧ'}
    ${'w(=|'} | ${'ᾧ'}
    ${'w|(='} | ${'ᾧ'}
    ${'w|=('} | ${'ᾧ'}
    ${'w=(|'} | ${'ᾧ'}
    ${'w=|('} | ${'ᾧ'} 
  `('Applying various diacritics order', ({ str, expected }) => expect(toTransliteration(str, KeyType.BETA_CODE)).toBe(expected))*/

})

describe('From greek to transliteration', () => {

  // Basic conversion

  test.each`
    str                | expected
    ${'ἄνθρωπος'}      | ${'ánthrōpos'}
    ${'καλὸς κἀγαθός'} | ${'kalòs ka̓gathós'}
    ${'αὐτόνομος'}     | ${'autónomos'}
    ${'υἱός'}          | ${'huiós'}
    ${'Υἱός'}          | ${'Huiós'}
    ${'ποιῇ'}          | ${'poiȩ̄̃'}
    ${'Ἄϊδα'}          | ${'Áïda'}
    ${'βάρ\u03D0αρος'} | ${'bárbaros'}
    ${'Ὕσιρις'}        | ${'Húsiris'}
    ${'ᾠώδης'}         | ${'ō̧ṓdēs'}
    ${'wοῖ'}           | ${'woĩ'}
    ${'ἅγιοc'}         | ${'hágioc'}
    ${'Ξενοφῶν'}       | ${'Xenophō̃n'}
    ${'χορηγέω'}       | ${'chorēgéō'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}    | ${'ăāeēĭīoōŭū'}
    ${plato.gr}        | ${plato.tr} 
  `('Basic conversion', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK)).toBe(expected))

  // Removing diacritics

  test.each`
    str                | expected
    ${'ανθρωπος'}      | ${'anthrōpos'}
    ${'καλὸς κἀγαθός'} | ${'kalos kagathos'}
    ${'αὐτόνομος'}     | ${'autonomos'}
    ${'υἱός'}          | ${'huios'}
    ${'Υἱός'}          | ${'Huios'}
    ${'ποιῇ'}          | ${'poiē'}
    ${'Ἄϊδα'}          | ${'Aida'}
    ${'βάρ\u03D0αρος'} | ${'barbaros'}
    ${'Ὕσιρις'}        | ${'Husiris'}
    ${'ᾠώδης'}         | ${'ōōdēs'}
    ${'wοῖ'}           | ${'woi'}
    ${'ἅγιοc'}         | ${'hagioc'}
    ${'Ξενοφῶν'}       | ${'Xenophōn'}
    ${'χορηγέω'}       | ${'chorēgeō'}
    ${'ἀ̆ᾱεηῐῑοωῠῡ'}    | ${'aaeēiioōuu'}
    ${thucydides.gr}   | ${thucydides.trNoAcc}
  `('Removing diacritics', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK, { removeDiacritics: true })).toBe(expected))

  // Testing breathings placement rules

  test.each`
    str           | expected
    ${'Ἠώς'}      | ${'Ēṓs'}
    ${'αἴσθησις'} | ${'aísthēsis'}
    ${'Αἶα'}      | ${'Aĩa'}
    ${'ἄϋλος'}    | ${'áülos'}
    ${'ὑΐδιον'}   | ${'huḯdion'}
  `('Testing breathings placement rules', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK)).toBe(expected))

  // Testing coronides

  test.each`
    str           | expected
    ${'κἄν'}      | ${'ka̓́n'}
    ${'ταὐτό'}    | ${'tau̓tó'}
  `('Testing coronides', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK)).toBe(expected))

  // Testing gamma nasals

  test.each`
    str          | expected
    ${'ἄγγελος'} | ${'ángelos'}
    ${'σπόγγος'} | ${'spóngos'} 
    ${'ἄγκυρα'}  | ${'ánkura'}
    ${'σφίγξ'}   | ${'sphínx'} 
    ${'τυγχάνω'} | ${'tunchánō'}
  `('Testing gamma nasals', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK)).toBe(expected))

  // Testing gamma nasals with xi_ks / chi_kh enabled

  test.each`
    str          | expected
    ${'σφίγξ'}   | ${'sphínks'}
    ${'τυγχάνω'} | ${'tunkhánō'}
  `('Testing gamma nasals with xi_ks / chi_kh enabled', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected))

  // Disabling beta variant

  test('Disabling beta variant', () => {
    expect(toTransliteration('βάρβαρος', KeyType.GREEK, { setGreekStyle: { disableBetaVariant: true } })).toBe('bárbaros')
  })

  // Testing rho rules

  test.each`
    str             | expected
    ${'Ρόδος'}      | ${'Ródos'}
    ${'Ῥόδος'}      | ${'Rhódos'}
    ${'ῬΌΔΟΣ'}      | ${'RHÓDOS'}
    ${'πολύρριζος'} | ${'polúrrhizos'}
    ${'πολύῤῥιζος'} | ${'polúrrhizos'}
    ${'ΠΟΛΎΡΡΙΖΟΣ'} | ${'POLÚRRHIZOS'}
    ${'μάρμαρος'}   | ${'mármaros'}
  `('Testing rho rules', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK)).toBe(expected))

  // Testing rho rules, applying rho_rh

  test.each`
    str             | expected
    ${'Ρόδος'}      | ${'Rhódos'}
    ${'ΡΌΔΟΣ'}      | ${'RHÓDOS'}
    ${'Ῥόδος'}      | ${'Rhódos'}
    ${'πολύρριζος'} | ${'polúrrhizos'}
    ${'ΠΟΛΎΡΡΙΖΟΣ'} | ${'POLÚRRHIZOS'}
    ${'πολύῤῥιζος'} | ${'polúrrhizos'}
    ${'μάρμαρος'}   | ${'mármaros'}
  `('Testing rho rules, applying rho_rh', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK, { setTransliterationStyle: { rho_rh: true } })).toBe(expected))

  // Using circumflex on long vowels

  test.each`
    str           | expected
    ${'ἄνθρωπος'} | ${'ánthrôpos'}
    ${'Ὁπλίτης'}  | ${'Hoplítês'}
    ${'Ξενοφῶν'}  | ${'Xenophỗn'}
    ${plato.gr}   | ${plato.trCrx}
  `('Using circumflex on long vowels', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK, { setTransliterationStyle: { useCxOverMacron: true } })).toBe(expected))

  // Applying beta_v

  test('Applying beta_v', () => {
    expect(toTransliteration('βάρ\u03D0αρος', KeyType.GREEK, { setTransliterationStyle: { beta_v: true } }))
      .toBe('várvaros')
  })

  // Applying eta_i

  test('Applying eta_i', () => {
    expect(toTransliteration('ἡδονή', KeyType.GREEK, { setTransliterationStyle: { eta_i: true } }))
      .toBe('hīdonī́')
  })

  // Applying eta_i, using circumflex

  test('Applying eta_i', () => {
    expect(toTransliteration('ἡδονή', KeyType.GREEK, { setTransliterationStyle: { useCxOverMacron: true, eta_i: true } }))
      .toBe('hîdonî́')
  })

  // Applying phi_f

  test.each`
    str             | expected
    ${'φαντασία'}   | ${'fantasía'}
    ${'Φαινώ'}      | ${'Fainṓ'}
    ${'ΦΙΛΟΣΟΦΙΑ'}  | ${'FILOSOFIA'}
  `('Applying phi_f', ({ str, expected }) => { expect(toTransliteration(str, KeyType.GREEK, { setTransliterationStyle: { phi_f: true } })).toBe(expected) })

  // Applying xi_ks / chi_kh

  test.each`
    str             | expected
    ${'Ξενοφῶν'}    | ${'Ksenophō̃n'}
    ${'χορηγέω'}    | ${'khorēgéō'}
    ${'σφίγξ'}      | ${'sphínks'}
    ${'μελαγχολία'} | ${'melankholía'}
    ${'σφίνξ'}      | ${'sphínks'}
    ${'μελανχολία'} | ${'melankholía'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toTransliteration(str, KeyType.GREEK, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Applying upsilon_y

  test.each`
    str            | expected
    ${'ὑϐρίς'}     | ${'hybrís'}
    ${'αὐτόματος'} | ${'autómatos'}
    ${'ΑYΤΌΜΑΤΟΣ'} | ${'AUTÓMATOS'}
    ${'ἄϋλος'}     | ${'áÿlos'}
    ${'ὑΐδιον'}    | ${'hyḯdion'}
    ${'ὕδωρ'}      | ${'hýdōr'}
    ${'Ὕϐλα'}      | ${'Hýbla'}
    ${'ὔ ὗ'}       | ${'ý hỹ'}
  `('Applying upsilon_y', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK, { setTransliterationStyle: { upsilon_y: true } })).toBe(expected))

  // Using additional letters

  test('Using additional letters', () => {
    const enableAll = { useAdditionalChars: AdditionalChar.ALL }
    expect(toTransliteration('ϝϜ\u03F3\u037F\u03F2\u03F9\u03DB\u03DAϟϞϙϘϡϠ', KeyType.GREEK, enableAll)).toBe('wWjJcCc̄C̄qQḳḲs̄S̄')
    
    const enableDigammaAndLunateSigma = { useAdditionalChars: [AdditionalChar.DIGAMMA, AdditionalChar.LUNATE_SIGMA]}
    expect(toTransliteration('ϝϜ\u03F2\u03F9', KeyType.GREEK, enableDigammaAndLunateSigma)).toBe('wWcC')
    expect(toTransliteration('\u03F3\u037F\u03DB\u03DAϟϞϡϠ', KeyType.GREEK, enableDigammaAndLunateSigma)).toBe('\u03F3\u037F\u03DB\u03DAϟϞϡϠ')
  })

  // Testing uppercase writing

  test.each`
    str             | expected
    ${'ΒΆΡΒΑΡΟΣ'}   | ${'BÁRBAROS'}
    ${'ῬΌΔΟΣ'}      | ${'RHÓDOS'}
    ${'ΠΟΛΎΡΡΙΖΟΣ'} | ${'POLÚRRHIZOS'}
    ${'ΣΥΣΣΕΙΣΜΌΣ'} | ${'SUSSEISMÓS'}
    ${'ἈΨΕΓΉΣ'}     | ${'APSEGḖS'}
    ${'ὙΙΌΣ'}       | ${'HUIÓS'}
  `('Testing uppercase writing', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK)).toBe(expected))

  // Testing whitespace behavior

  test('Testing whitespace behavior', () => {
    expect(toTransliteration('αἴξ   κριός', KeyType.GREEK)).toBe('aíx   kriós')
    expect(toTransliteration('αἴξ   κριός', KeyType.GREEK, { removeExtraWhitespace: true })).toBe('aíx kriós')
  })

  // Testing correctness with various word separators

  test('Testing correctness with various word separators', () => {
    expect(toTransliteration('Ρόδος\nΡόδος\tΡόδος Ρόδος', KeyType.GREEK)).toBe('Ródos\nRódos\tRódos Ródos')
    expect(toTransliteration('Ῥόδος\nῬόδος\tῬόδος Ῥόδος', KeyType.GREEK)).toBe('Rhódos\nRhódos\tRhódos Rhódos')
  })

  // Applying preset ALA_LC (the following sentences are given by the ALA-LC romanization table)
  
  test.each`
    str                                             | expected
    ${'Ἡσιόδου τοῦ Ἀσκραίου Ἔργα καὶ ἡμέραι'}       | ${'Hēsiodou tou Askraiou Erga kai hēmerai'}
    ${'Ἡ τοῦ Ὁμήρου Ἰλιάς'}                         | ${'Hē tou Homērou Ilias'}
    ${'Φίληβος ἢ Περὶ ἡδονῆς'}                      | ${'Philēbos ē Peri hēdonēs'}
    ${'Ἀγνώστῳ θεῷ'}                                | ${'Agnōstō theō'}
    ${'κεῖται παρ’ Ἅιδῃ'}                           | ${'keitai par’ Hadē'}
    ${'Αἴτια Ῥωμαϊκά'}                              | ${'Aitia Rhōmaika'}
    ${'Ὅτι οὐδ’ ἡδέως ζῆν ἔστι κατ’ Ἐπίκουρον'}     | ${'Hoti oud’ hēdeōs zēn esti kat’ Epikouron'}
    ${'Περὶ τοῦ μὴ ῥᾳδίως πιστεύειν διαβολῇ'}       | ${'Peri tou mē rhadiōs pisteuein diabolē'}
    ${'ἀΰπνους νύκτας ἴαυον'}                       | ${'aypnous nyktas iauon'}
    ${'Λητοῦς καὶ Διὸς υἱός'}                       | ${'Lētous kai Dios huios'}
    ${'ὑϊκὸν πάσχειν'}                              | ${'hyikon paschein'}
    ${'εἶπε πρὸς τὸν ἄνδρα τὸν ἑωυτῆς'}             | ${'eipe pros ton andra ton heōutēs'}
    ${'τί τοῦδ’ ἂν εὕρημ’ ηὗρον εὐτυχέστερον;'}     | ${'ti toud’ an heurēm’ hēuron eutychesteron?'}
    ${'Τοῦ Κατὰ πασῶν αἱρέσεων ἐλέγχου βιβλίον αʹ'}  | ${'Tou Kata pasōn haireseōn elenchou biblion 1'}
    ${'καλὸν κἀγαθόν'}                              | ${'kalon kagathon'}
    ${'ᾤχοντο θοἰμάτιον λαβόντες μου'}              | ${'ōchonto thoimation labontes mou'}
    ${'Περὶ ἰλίγγων'}                               | ${'Peri ilingōn'}
    ${'ὅτε τ’ ἴαχε σάλπιγξ'}                        | ${'hote t’ iache salpinx'}
    ${'Ἐγχειρίδιον ἁρμονικῆς'}                      | ${'Encheiridion harmonikēs'}
    ${'ἄλαϲτα δὲ ϝέργα πάθον κακὰ μηϲαμένοι'}       | ${'alasta de werga pathon kaka mēsamenoi'}
    ${'Δαμαρέτα τ’ ἐρατά τε Ϝιανθεμίϲ'}             | ${'Damareta t’ erata te Wianthemis'}
    ${'ξένϝος'}                                     | ${'xenwos'}
    ${'Πάτροϙλος'}                                  | ${'Patroḳlos'}
  `('Applying preset ALA_LC', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK, Preset.ALA_LC)).toBe(expected))


  // Applying preset ISO (-> ISO 843 [1997])
  
  test.each`
    str                                             | expected
    ${'Ἡσιόδου τοῦ Ἀσκραίου Ἔργα καὶ ἡμέραι'}       | ${'Hīsiódou toũ Askraíou Érga kaì hīmérai'}
    ${'Ἡ τοῦ Ὁμήρου Ἰλιάς'}                         | ${'Hī toũ Homī́rou Iliás'}
    ${'Φίληβος ἢ Περὶ ἡδονῆς'}                      | ${'Fílīvos ī̀ Perì hīdonī̃s'}
    ${'Ἀγνώστῳ θεῷ'}                                | ${'Agnṓstō̧ theō̧̃'}
    ${'κεῖται παρ’ Ἅιδῃ'}                           | ${'keĩtai par’ Háidī̧'}
  `('Applying preset ISO (-> ISO 843 [1997])', ({ str, expected }) => expect(toTransliteration(str, KeyType.GREEK, Preset.ISO)).toBe(expected))

})

describe('Self conversion', () => {

  // Testing rho rules, applying rho_rh

  test.each`
    str             | expected
    ${'Ródos'}      | ${'Rhódos'}
    ${'RÓDOS'}      | ${'RHÓDOS'}
    ${'polúrrizos'} | ${'polúrrhizos'}
    ${'POLÚRRIZOS'} | ${'POLÚRRHIZOS'}
  `('Testing rho rules, applying rho_rh', ({ str, expected }) => expect(toTransliteration(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { rho_rh: true } })).toBe(expected))

  // Using circumflex on long vowels

  test.each`
    str            | expected
    ${'ánthrōpos'} | ${'ánthrôpos'}
    ${'chorēgéō'}  | ${'chorêgéô'}
    ${'Xenophō̃n'}  | ${'Xenophỗn'}
  `('Using circumflex on long vowels', ({ str, expected }) => expect(toTransliteration(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { useCxOverMacron: true } })).toBe(expected))

  // Applying xi_ks / chi_kh

  test.each`
    str              | expected
    ${'Xenophō̃n'}    | ${'Ksenophō̃n'}
    ${'Chorēgéō'}    | ${'khorēgéō'}
    ${'sphínx'}      | ${'sphínks'}
    ${'melancholía'} | ${'melankholía'}
  `('Applying xi_ks / chi_kh', ({ str, expected }) => { expect(toTransliteration(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { xi_ks: true, chi_kh: true } })).toBe(expected) })

  // Applying upsilon_y

  test.each`
    str            | expected
    ${'hubrís'}    | ${'hybrís'}
    ${'hybrís'}    | ${'hybrís'}
    ${'autómatos'} | ${'autómatos'}
    ${'aytómatos'} | ${'autómatos'}
    ${'AUTÓMATOS'} | ${'AUTÓMATOS'}
    ${'AYTÓMATOS'} | ${'AUTÓMATOS'}
    ${'áülos'}     | ${'áÿlos'}
    ${'áÿlos'}     | ${'áÿlos'}
    ${'huḯdion'}   | ${'hyḯdion'}
    ${'hyḯdion'}   | ${'hyḯdion'}
    ${'húdōr'}     | ${'hýdōr'}
    ${'hýdōr'}     | ${'hýdōr'}
    ${'Húbla'}     | ${'Hýbla'}
    ${'Hýbla'}     | ${'Hýbla'}
    ${'ú hũ'}      | ${'ý hỹ'}
    ${'ý hỹ'}      | ${'ý hỹ'}
  `('Applying upsilon_y', ({ str, expected }) => expect(toTransliteration(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { upsilon_y: true } })).toBe(expected))

  // Applying lunatesigma_s

  test.each`
    str           | expected
    ${'hagioc'}   | ${'hagios'}
    ${'Cōkrátēc'} | ${'Sōkrátēs'}
    ${'ICHTUC'}   | ${'ICHTUS'}
  `('Applying lunatesigma_s', ({ str, expected }) => { expect(toTransliteration(str, KeyType.TRANSLITERATION, { setTransliterationStyle: { lunatesigma_s: true } })).toBe(expected) })

})
