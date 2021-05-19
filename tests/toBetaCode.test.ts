import { keyType, toBetaCode } from '../src/index'

describe('toBetaCode', () => {
  const aristotle = { // challenge: `(meta\\ kinh/sews ga/r)`
    greek: 'Ἐκεῖναι μὲν δὴ φυσικῆς μετὰ κινήσεως γάρ, αὕτη δὲ ἑτέρας, εἰ μηδεμία αὐτοῖς ἀρχὴ κοινή.',
    trans: 'Ekeĩnai mèn dề phusikễs metà kinếseôs gár, haútê dè hetéras, ei mêdemía autoĩs archề koinế.',
    bcodeAccented: 'E)kei=nai me\\n dh\\ fusikh=s meta\\ kinh/sews ga/r, au(/th de\\ e(te/ras, ei) mhdemi/a au)toi=s a)rxh\\ koinh/.',
    bcodeUnaccented: 'Ekeinai men dh fusikhs meta kinhsews gar, auth de eteras, ei mhdemia autois arxh koinh.'
  }

  test.each`
    str                | expected
    ${'ανθρωπος'}      | ${'anqrwpos'}
    ${'α α'}           | ${'a a'}
    ${'ἄνθρωπος'}      | ${'anqrwpos'}
    ${'ἵππος'}         | ${'ippos'}
    ${aristotle.greek} | ${aristotle.bcodeUnaccented}
  `('Testing `toBetaCode` function w/ greek input, omitting diactrics', ({ str, expected }) => {
    expect(toBetaCode(str, keyType.GREEK, { removeDiacritics: true })).toBe(expected)
  })

  test.each`
    str                | expected
    ${'ἄνθρωπος'}      | ${'a)/nqrwpos'}
    ${'ἵππος'}         | ${'i(/ppos'}
    ${'ποιῇ'}          | ${'poih=|'}
    ${'Ἄϊδα'}          | ${'A)/i+da'}
    ${aristotle.greek} | ${aristotle.bcodeAccented}
  `('Testing `toBetaCode` function w/ greek input, omitting diactrics', ({ str, expected }) => {
    expect(toBetaCode(str, keyType.GREEK)).toBe(expected)
  })

  test.each`
    str                | expected
    ${'anthrôpos'}     | ${'anqrwpos'}
    ${'hippos'}        | ${'ippos'}
    ${'aḯdalos'}       | ${'aidalos'}
    ${'Húsiris'}       | ${'Usiris'}
    ${aristotle.trans} | ${aristotle.bcodeUnaccented}
  `('Testing `toBetaCode` function w/ transliterated input, omitting diactrics', ({ str, expected }) => {
    expect(toBetaCode(str, keyType.TRANSLITERATION, { removeDiacritics: true })).toBe(expected)
  })

  test.each`
    str                | expected
    ${'ánthrôpos'}     | ${'a)/nqrwpos'}
    ${'rhuthmós'}      | ${'r(uqmo/s'}
    ${'prosễlthon'}    | ${'prosh=lqon'}
    ${'aḯdalos'}       | ${'ai)/+dalos'}
    ${'Áïda'}          | ${'A)/i+da'}
    ${'hoplítês'}      | ${'o(pli/ths'}
    ${'Húsiris'}       | ${'U(/siris'}
    ${aristotle.trans} | ${aristotle.bcodeAccented}
  `('Testing `toBetaCode` function w/ transliterated input, preserving diactrics', ({ str, expected }) => {
    expect(toBetaCode(str, keyType.TRANSLITERATION)).toBe(expected)
  })

  test.each`
    str              | expected
    ${'aíx   kriós'} | ${'ai)/c   krio/s'}
  `('Testing `toBetaCode` function w/ transliterated input, preserving whitespace', ({ str, expected }) => {
    expect(toBetaCode(str, keyType.TRANSLITERATION, { preserveWhitespace: true })).toBe(expected);
  })
})
