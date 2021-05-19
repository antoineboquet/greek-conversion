import { keyType, toGreek } from '../src/index'

describe('toGreek', () => {
  const aristotle = { // challenge: `(meta\\ kinh/sews ga/r)`
    betacode: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.',
    greekAccented: 'Ἐκεῖναι μὲν δὴ φυσικῆς μετὰ κινήσεως γάρ, αὕτη δὲ ἑτέρας, εἰ μηδεμία αὐτοῖς ἀρχὴ κοινή.',
    greekUnaccented: 'Εκειναι μεν δη φυσικης μετα κινησεως γαρ, αυτη δε ετερας, ει μηδεμια αυτοις αρχη κοινη.'
  }

  test.each`
    str                   | expected
    ${'anqrwpos'}         | ${'ανθρωπος'}
    ${'a a'}              | ${'α α'}
    ${'i(/ppos'}          | ${'ιππος'}
    ${'poih|='}           | ${'ποιη'}
    ${aristotle.betacode} | ${aristotle.greekUnaccented}
  `('Testing `toGreek` function w/ beta code input, omitting diactrics', ({ str, expected }) => {
    expect(toGreek(str, keyType.BETA_CODE, { removeDiacritics: true })).toBe(expected)
  })

  test.each`
    str                   | expected
    ${'a)/nqrwpos'}       | ${'ἄνθρωπος'}
    ${'i(/ppos'}          | ${'ἵππος'}
    ${'poih|='}           | ${'ποιῇ'}
    ${'A)/i+da'}          | ${'Ἄϊδα'}
    ${aristotle.betacode} | ${aristotle.greekAccented}
  `('Testing `toGreek` function w/ beta code input, preserving diactrics', ({ str, expected }) => {
    expect(toGreek(str, keyType.BETA_CODE)).toBe(expected)
  })

  const thucydides = {
    trans: 'Hellêsin egeneto kai merei tini tôn barbarôn, hôs de eipein kai epi pleiston anthrôpôn.',
    greek: 'Ελλησιν εγενετο και μερει τινι των βαρϐαρων, ως δε ειπειν και επι πλειστον ανθρωπων.'
  }

  test.each`
    str                 | expected
    ${'anthrôpos'}      | ${'ανθρωπος'}
    ${'horaô'}          | ${'οραω'}
    ${'Hoiai'}          | ${'Οιαι'}
    ${'ha ha'}          | ${'α α'}
    ${thucydides.trans} | ${thucydides.greek}
  `('Testing `toGreek` function w/ transliterated input, omitting diactrics', ({ str, expected }) => {
    expect(toGreek(str, keyType.TRANSLITERATION, { removeDiacritics: true })).toBe(expected);
  })

  const plato = { // Notice that in the greek output, `κὰν` currently doesn't have the coronis (κἂν).
    trans: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alêthễ légeis?',
    greek: 'Χαλεπόν γέ σε ἐλέγξαι, ὦ Σώκρατες· ἀλλ\' οὐχὶ κὰν παῖς σε ἐλέγξειεν ὅτι οὐκ ἀληθῆ λέγεις;'
  }

  test.each`
    str             | expected
    ${'ánthrôpos'}  | ${'ἄνθρωπος'}
    ${'rhuthmós'}   | ${'ῥυθμός'}
    ${'prosễlthon'} | ${'προσῆλθον'}
    ${'aḯdalos'}    | ${'ἀΐδαλος'}
    ${'Áïda'}       | ${'Ἄϊδα'}
    ${'hoplítês'}   | ${'ὁπλίτης'}
    ${'Húsiris'}    | ${'Ὕσιρις'}
    ${plato.trans}  | ${plato.greek}

  `('Testing `toGreek` function w/ transliterated input, preserving diactrics', ({ str, expected }) => {
    expect(toGreek(str, keyType.TRANSLITERATION)).toBe(expected);
  })

  test.each`
    str              | expected
    ${'aíx   kriós'} | ${'αἴξ   κριός'}
  `('Testing `toGreek` function w/ transliterated input, preserving whitespace', ({ str, expected }) => {
    expect(toGreek(str, keyType.TRANSLITERATION, { preserveWhitespace: true })).toBe(expected);
  })
})
