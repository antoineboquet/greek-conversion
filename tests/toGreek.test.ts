import { keyType, toGreek } from '../src/index'

describe('toGreek', () => {
  test.each`
    str           | expected
    ${'anqrwpos'} | ${'ανθρωπος'}
    ${'a a'}      | ${'α α'}
  `('Testing `toGreek` function w/ beta code input, omitting diactrics', ({ str, expected }) => {
    expect(toGreek(str, keyType.BETA_CODE, { removeDiacritics: true })).toBe(expected)
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

  const plato = {
    trans: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alêthễ légeis?',
    greek: 'Χαλεπόν γέ σε ελέγξαι, ῶ Σώκρατες· αλλ\' ουχὶ κὰν παῖς σε ελέγξειεν ότι ουκ αληθῆ λέγεις;'
  }

  test.each`
    str             | expected
    ${'ánthrôpos'}  | ${'άνθρωπος'}
    ${'prosễlthon'} | ${'προσῆλθον'}
    ${'aḯdalos'}    | ${'αΐδαλος'}
    ${'Áïda'}       | ${'Άϊδα'}
    ${plato.trans}  | ${plato.greek}
  `('Testing `toGreek` function w/ transliterated input, preserving diactrics', ({ str, expected }) => {
    expect(toGreek(str, keyType.TRANSLITERATION)).toBe(expected);
  })
})
