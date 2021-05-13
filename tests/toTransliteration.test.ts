import { keyType, toTransliteration } from '../src/index'

const removeDiacritics = {
  removeDiacritics: true
}

test('Testing `toTransliteration` function omitting diacritics', () => {
  // Beta code
  expect(toTransliteration('anqrwpos', keyType.BETA_CODE, removeDiacritics)).toBe('anthrôpos')

  // Greek (without diacritics)
  expect(toTransliteration('ανθρωπος', keyType.GREEK, removeDiacritics)).toBe('anthrôpos')
  expect(toTransliteration('οραω', keyType.GREEK, removeDiacritics)).toBe('oraô')
  expect(toTransliteration('α α', keyType.GREEK, removeDiacritics)).toBe('a a')

  // Greek (with diacritics)
  expect(toTransliteration('ἄνθρωπος', keyType.GREEK, removeDiacritics)).toBe('anthrôpos')
  expect(toTransliteration('ἵππος', keyType.GREEK, removeDiacritics)).toBe('hippos')
  expect(toTransliteration('ὁράω', keyType.GREEK, removeDiacritics)).toBe('horaô')
  expect(toTransliteration('Οἷαι', keyType.GREEK, removeDiacritics)).toBe('Hoiai')
  expect(toTransliteration('ῥυθμός', keyType.GREEK, removeDiacritics)).toBe('rhuthmos')
  expect(toTransliteration('οἷος', keyType.GREEK, removeDiacritics)).toBe('hoios')
  expect(toTransliteration('ποιῇ', keyType.GREEK, removeDiacritics)).toBe('poiê')
  expect(toTransliteration('ὄ, ὄ, ὄ', keyType.GREEK, removeDiacritics)).toBe('o, o, o')

  const sentence = {
    greek: 'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',
    trans: 'Hellêsin egeneto kai merei tini tôn barbarôn, hôs de eipein kai epi pleiston anthrôpôn.'
  }

  expect(toTransliteration(sentence.greek, keyType.GREEK, removeDiacritics)).toBe(sentence.trans)
})

test('Testing `toTransliteration` function preserving diacritics', () => {
  // Greek (with diacritics)
  expect(toTransliteration('ἄνθρωπος', keyType.GREEK)).toBe('ánthrôpos')
  expect(toTransliteration('Ἡράκλειος', keyType.GREEK)).toBe('Hêrákleios')
  expect(toTransliteration('ὠστιῶ', keyType.GREEK)).toBe('ôstiỗ')
  expect(toTransliteration('οἷος', keyType.GREEK)).toBe('hoĩos')
  expect(toTransliteration('ἀΐδαλος', keyType.GREEK)).toBe('aḯdalos')
  expect(toTransliteration('ποιῇ', keyType.GREEK)).toBe('poiễͅ')
  expect(toTransliteration('ὄ, ὄ, ὄ', keyType.GREEK)).toBe('ó, ó, ó')

  const sentence = {
    greek: 'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',
    trans: 'Héllêsin egéneto kaì mérei tinì tỗn barbárôn, hôs dè eipeĩn kaì epì pleĩston anthrốpôn.'
  }

  expect(toTransliteration(sentence.greek, keyType.GREEK)).toBe(sentence.trans)

  const sentence2 = {
    greek: 'Χαλεπόν γέ σε ἐλέγξαι, ὦ Σώκρατες· ἀλλ\' οὐχὶ κἂν παῖς σε ἐλέγξειεν ὅτι οὐκ ἀληθῆ λέγεις;',
    trans: 'Chalepón gé se elénxai, ỗ Sốkrates; all\' ouchì kàn paĩs se elénxeien hóti ouk alêthễ légeis?'
  }

  expect(toTransliteration(sentence2.greek, keyType.GREEK)).toBe(sentence2.trans)
})
