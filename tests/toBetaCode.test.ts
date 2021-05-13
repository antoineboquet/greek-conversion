import { keyType, toBetaCode } from '../src/index'

describe('toBetaCode', () => {
  test.each`
    str           | expected
    ${'ανθρωπος'} | ${'anqrwpos'}
    ${'α α'}      | ${'a a'}
    ${'ἄνθρωπος'} | ${'anqrwpos'}
    ${'ἵππος'}    | ${'ippos'}
  `('Testing `toBetaCode` function w/ greek input, omitting diactrics', ({ str, expected }) => {
    expect(toBetaCode(str, keyType.GREEK, { removeDiacritics: true })).toBe(expected)
  })

  test.each`
    str            | expected
    ${'anthrôpos'} | ${'anqrwpos'}
    ${'hippos'}    | ${'ippos'}
    ${'aḯdalos'}   | ${'aidalos'}
  `('Testing `toBetaCode` function w/ transliterated input, omitting diactrics', ({ str, expected }) => {
    expect(toBetaCode(str, keyType.TRANSLITERATION, { removeDiacritics: true })).toBe(expected)
  })
})
