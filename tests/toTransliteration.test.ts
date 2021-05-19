import { keyType, toTransliteration } from '../src/index'

describe('toTransliteration', () => {
  const aristotle = { // challenge: `(meta\\ kinh/sews ga/r)`
    betacode: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.',
    transAccented: 'Ekeĩnai mèn dề phusikễs metà kinếseôs gár, haútê dè hetéras, ei mêdemía autoĩs archề koinế.',
    transUnaccented: 'Ekeinai men dê phusikês meta kinêseôs gar, hautê de heteras, ei mêdemia autois archê koinê.'
  }

  test.each`
    str                   | expected
    ${'anqrwpos'}         | ${'anthrôpos'}
    ${'H(ra/kleios'}      | ${'Hêrakleios'}
    ${'w)stiw='}          | ${'ôstiô'}
    ${'oi(=os'}           | ${'hoios'}
    ${'a)i/+dalos'}       | ${'aidalos'}
    ${'poih=|'}           | ${'poiê'}
    ${aristotle.betacode} | ${aristotle.transUnaccented}
  `('Testing `toTransliteration` function w/ beta code input, omitting diactrics', ({ str, expected }) => {
    expect(toTransliteration(str, keyType.BETA_CODE, { removeDiacritics: true })).toBe(expected);
  })

  test.each`
    str                   | expected
    ${'a)/nqrwpos'}       | ${'ánthrôpos'}
    ${'H(ra/kleios'}      | ${'Hêrákleios'}
    ${'w)stiw='}          | ${'ôstiỗ'}
    ${'oi(=os'}           | ${'hoĩos'}
    ${'a)i+/dalos'}       | ${'aḯdalos'}
    ${'poih=|'}           | ${'poiễͅ'}
    ${aristotle.betacode} | ${aristotle.transAccented}
  `('Testing `toTransliteration` function w/ beta code input, preserving diactrics', ({ str, expected }) => {
    expect(toTransliteration(str, keyType.BETA_CODE)).toBe(expected);
  })

  const thucydides = {
    greek: 'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',
    transAccented: 'Héllêsin egéneto kaì mérei tinì tỗn barbárôn, hôs dè eipeĩn kaì epì pleĩston anthrốpôn.',
    transUnaccented: 'Ellêsin egeneto kai merei tini tôn barbarôn, ôs de eipein kai epi pleiston anthrôpôn.'
  }

  test.each`
    str                 | expected
    ${'ανθρωπος'}       | ${'anthrôpos'}
    ${'οραω'}           | ${'oraô'}
    ${'ἄνθρωπος'}       | ${'anthrôpos'}
    ${'ἵππος'}          | ${'ippos'}
    ${'ὁράω'}           | ${'oraô'}
    ${'Οἷαι'}           | ${'Oiai'}
    ${'ῥυθμός'}         | ${'ruthmos'}
    ${'οἷος'}           | ${'oios'}
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
    ${plato.greek}      | ${plato.trans}
  `('Testing `toTransliteration` function w/ greek input, preserving diacritics', ({ str, expected }) => {
    expect(toTransliteration(str, keyType.GREEK)).toBe(expected)
  })

  test.each`
    str              | expected
    ${'αἴξ   κριός'} | ${'aíx   kriós'}
  `('Testing `toTransliteration` function w/ greek input, preserving whitespace', ({ str, expected }) => {
    expect(toTransliteration(str, keyType.GREEK, { preserveWhitespace: true })).toBe(expected);
  })
})
