import { keyType, toBetaCode, toGreek, toTransliteration } from '../src/index'

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

  // Transliteration: preserve misplaced `h`
  expect(toGreek('anthrôpohs', keyType.TRANSLITERATION, removeDiacritics)).toBe('ανθρωποhς')
})

test('Testing `toGreek` function preserving diactrics', () => {
  expect(toGreek('ánthrôpos', keyType.TRANSLITERATION)).toBe('άνθρωπος')
  //expect(toGreek('prosêlthon', keyType.TRANSLITERATION)).toBe('προσῆλθον')
  expect(toGreek('aḯdalos', keyType.TRANSLITERATION)).toBe('αΐδαλος')
  expect(toGreek('Áïda', keyType.TRANSLITERATION)).toBe('Άϊδα')
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
  expect(toTransliteration('ὄ, ὄ, ὄ', keyType.GREEK)).toBe('ó, ó, ó')

  const sentence = {
    greek: 'Ἕλλησιν ἐγένετο καὶ μέρει τινὶ τῶν βαρβάρων, ὡς δὲ εἰπεῖν καὶ ἐπὶ πλεῖστον ἀνθρώπων.',
    trans: 'Héllêsin egéneto kaì mérei tinì tỗn barbárôn, hôs dè eipeĩn kaì epì pleĩston anthrốpôn.'
  }

  expect(toTransliteration(sentence.greek, keyType.GREEK)).toBe(sentence.trans)
})
