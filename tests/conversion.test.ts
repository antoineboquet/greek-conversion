import { keyType, toBetaCode, toGreek, toTransliteration } from '../src/index'

test('Testing `toGreek` function', () => {
  // Beta code
  expect(toGreek('anqrwpos', keyType.BETA_CODE)).toBe('ανθρωπος')
  expect(toGreek('a a', keyType.BETA_CODE)).toBe('α α')

  // Transliteration
  expect(toGreek('anthrôpos', keyType.TRANSLITERATION)).toBe('ανθρωπος')
  expect(toGreek('horaô', keyType.TRANSLITERATION)).toBe('οραω')
  expect(toGreek('Hoiai', keyType.TRANSLITERATION)).toBe('Οιαι')
  expect(toGreek('ha ha', keyType.TRANSLITERATION)).toBe('α α')

  const sentence = {
    trans: 'Hellêsin egeneto kai merei tini tôn barbarôn, hôs de eipein kai epi pleiston anthrôpôn.',
    greek: 'Ελλησιν εγενετο και μερει τινι των βαρϐαρων, ως δε ειπειν και επι πλειστον ανθρωπων.'
  }

  expect(toGreek(sentence.trans, keyType.TRANSLITERATION)).toBe(sentence.greek)

  // Transliteration: preserve misplaced `h`
  expect(toGreek('anthrôpohs', keyType.TRANSLITERATION)).toBe('ανθρωποhς')
})

test('Testing `toBetaCode` function', () => {
  // Greek (without diacritics)
  expect(toBetaCode('ανθρωπος', keyType.GREEK)).toBe('anqrwpos')
  expect(toBetaCode('α α', keyType.GREEK)).toBe('a a')

  // Greek (with diacritics)
  expect(toBetaCode('ἄνθρωπος', keyType.GREEK)).toBe('anqrwpos')
  expect(toBetaCode('ἵππος', keyType.GREEK)).toBe('ippos')

  // Transliteration
  expect(toBetaCode('anthrôpos', keyType.TRANSLITERATION)).toBe('anqrwpos')
  expect(toBetaCode('hippos', keyType.TRANSLITERATION)).toBe('ippos')
})

test('Testing `toTransliteration` function', () => {
  // Beta code
  expect(toTransliteration('anqrwpos', keyType.BETA_CODE)).toBe('anthrôpos')

  // Greek (without diacritics)
  expect(toTransliteration('ανθρωπος', keyType.GREEK)).toBe('anthrôpos')
  expect(toTransliteration('οραω', keyType.GREEK)).toBe('oraô')
  expect(toTransliteration('α α', keyType.GREEK)).toBe('a a')

  // Greek (with diacritics)
  expect(toTransliteration('ἄνθρωπος', keyType.GREEK)).toBe('anthrôpos')
  expect(toTransliteration('ἵππος', keyType.GREEK)).toBe('hippos')
  expect(toTransliteration('ὁράω', keyType.GREEK)).toBe('horaô')
  expect(toTransliteration('Οἷαι', keyType.GREEK)).toBe('Hoiai')
  expect(toTransliteration('ῥυθμός', keyType.GREEK)).toBe('rhuthmos')
  expect(toTransliteration('οἷος', keyType.GREEK)).toBe('hoios')
  expect(toTransliteration('ὄ, ὄ, ὄ', keyType.GREEK)).toBe('o, o, o')

  const sentence = {
    greek: 'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',
    trans: 'Hellêsin egeneto kai merei tini tôn barbarôn, hôs de eipein kai epi pleiston anthrôpôn.'
  }

  expect(toTransliteration(sentence.greek, keyType.GREEK)).toBe(sentence.trans)
})
