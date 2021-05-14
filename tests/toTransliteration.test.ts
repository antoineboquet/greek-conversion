import { keyType, toTransliteration } from '../src/index'

describe('toTransliteration', () => {
  test.each`
    str              | expected
    ${'anqrwpos'}    | ${'anthrôpos'}
    ${'H(ra/kleios'} | ${'Hêrakleios'}
    ${'w)stiw='}     | ${'ôstiô'}
    ${'oi(=os'}      | ${'hoios'}
    ${'a)i/+dalos'}  | ${'aidalos'}
    ${'poih=|'}      | ${'poiê'}
  `('Testing `toTransliteration` function w/ beta code input, omitting diactrics', ({ str, expected }) => {
    expect(toTransliteration(str, keyType.BETA_CODE, { removeDiacritics: true })).toBe(expected);
  })

  test.each`
    str              | expected
    ${'a)/nqrwpos'}  | ${'ánthrôpos'}
    ${'H(ra/kleios'} | ${'Hêrákleios'}
    ${'w)stiw='}     | ${'ôstiỗ'}
    ${'oi(=os'}      | ${'hoĩos'}
    ${'a)i+/dalos'}  | ${'aḯdalos'}
    ${'poih=|'}      | ${'poiễͅ'}
  `('Testing `toTransliteration` function w/ beta code input, preserving diactrics', ({ str, expected }) => {
    expect(toTransliteration(str, keyType.BETA_CODE)).toBe(expected);
  })

  const thucydides = {
    greek: 'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',
    transAccented: 'Héllêsin egéneto kaì mérei tinì tỗn barbárôn, hôs dè eipeĩn kaì epì pleĩston anthrốpôn.',
    transUnaccented: 'Hellêsin egeneto kai merei tini tôn barbarôn, hôs de eipein kai epi pleiston anthrôpôn.'
  }

  test.each`
    str                 | expected
    ${'ανθρωπος'}       | ${'anthrôpos'}
    ${'οραω'}           | ${'oraô'}
    ${'α α'}            | ${'a a'}
    ${'ἄνθρωπος'}       | ${'anthrôpos'}
    ${'ἵππος'}          | ${'hippos'}
    ${'ὁράω'}           | ${'horaô'}
    ${'Οἷαι'}           | ${'Hoiai'}
    ${'ῥυθμός'}         | ${'rhuthmos'}
    ${'οἷος'}           | ${'hoios'}
    ${'ποιῇ'}           | ${'poiê'}
    ${'ὄ, ὄ, ὄ'}        | ${'o, o, o'}
    ${thucydides.greek} | ${thucydides.transUnaccented}
  `('Testing `toTransliteration` function w/ greek input, omitting diactrics', ({ str, expected }) => {
    expect(toTransliteration(str, keyType.GREEK, { removeDiacritics: true })).toBe(expected);
  })

  const plato = {
    greek: 'Χαλεπόν γέ σε ἐλέγξαι, ὦ Σώκρατες· ἀλλ\' οὐχὶ κἂν παῖς σε ἐλέγξειεν ὅτι οὐκ ἀληθῆ λέγεις;',
    trans: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alêthễ légeis?'
  }

  test.each`
    str                 | expected
    ${'ἄνθρωπος'}       | ${'ánthrôpos'}
    ${'Ἡράκλειος'}      | ${'Hêrákleios'}
    ${'ὠστιῶ'}          | ${'ôstiỗ'}
    ${'οἷος'}           | ${'hoĩos'}
    ${'ἀΐδαλος'}        | ${'aḯdalos'}
    ${'ποιῇ'}           | ${'poiễͅ'}
    ${'ὄ, ὄ, ὄ'}        | ${'ó, ó, ó'}
    ${thucydides.greek} | ${thucydides.transAccented}
    ${plato.greek}  | ${plato.trans}
  `('Testing `toTransliteration` function w/ greek input, preserving diacritics', ({ str, expected }) => {
    expect(toTransliteration(str, keyType.GREEK)).toBe(expected)
  })
})
