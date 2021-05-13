import { keyType, toGreek } from '../src/index'

const removeDiacritics = {
  removeDiacritics: true
}

test('Testing `toGreek` function omitting diactrics', () => {
  // Beta code
  expect(toGreek('anqrwpos', keyType.BETA_CODE, removeDiacritics)).toBe('ανθρωπος')
  expect(toGreek('a a', keyType.BETA_CODE, removeDiacritics)).toBe('α α')

  // Transliteration
  expect(toGreek('anthrôpos', keyType.TRANSLITERATION, removeDiacritics)).toBe('ανθρωπος')
  expect(toGreek('horaô', keyType.TRANSLITERATION, removeDiacritics)).toBe('οραω')
  expect(toGreek('Hoiai', keyType.TRANSLITERATION, removeDiacritics)).toBe('Οιαι')
  expect(toGreek('ha ha', keyType.TRANSLITERATION, removeDiacritics)).toBe('α α')

  const sentence = {
    trans: 'Hellêsin egeneto kai merei tini tôn barbarôn, hôs de eipein kai epi pleiston anthrôpôn.',
    greek: 'Ελλησιν εγενετο και μερει τινι των βαρϐαρων, ως δε ειπειν και επι πλειστον ανθρωπων.'
  }

  expect(toGreek(sentence.trans, keyType.TRANSLITERATION, removeDiacritics)).toBe(sentence.greek)
})

test('Testing `toGreek` function preserving diactrics', () => {
  expect(toGreek('ánthrôpos', keyType.TRANSLITERATION)).toBe('άνθρωπος')
  expect(toGreek('prosễlthon', keyType.TRANSLITERATION)).toBe('προσῆλθον')
  expect(toGreek('aḯdalos', keyType.TRANSLITERATION)).toBe('αΐδαλος')
  expect(toGreek('Áïda', keyType.TRANSLITERATION)).toBe('Άϊδα')

  const sentence2 = {
    trans: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alêthễ légeis?',
    greek: 'Χαλεπόν γέ σε ελέγξαι, ῶ Σώκρατες· αλλ\' ουχὶ κὰν παῖς σε ελέγξειεν ότι ουκ αληθῆ λέγεις;'
  }

  expect(toGreek(sentence2.trans, keyType.TRANSLITERATION)).toBe(sentence2.greek)
})
