import { KeyType, removeDiacritics, removeGreekVariants } from '../src/index';
import {
  ANO_TELEIA,
  GREEK_QUESTION_MARK,
  RIGHT_SINGLE_QUOTATION_MARK
} from '../src/Mapping';

describe('Remove greek variants', () => {

  // Basic removing

  test.each`
    str                                | expected
    ${'βάρ\u03D0αρος'}                 | ${'βάρβαροσ'}
    ${'Ϲειϲμόϲ'}                       | ${'Σεισμόσ'}
    ${'τὴς'}                           | ${'τήσ'}
    ${'ὰὲὴὶὸὺὼ'}                       | ${'άέήίόύώ'}
  `('Basic removing', ({ str, expected }) => {
    expect(removeGreekVariants(str)).toBe(expected)
  })

  // Preserving accents ⚠️ This uses `normalize('NFD')...normalize()`, so the
  // resulting accents are not the same as in the non-preserving tests.

  test.each`
    str                                | expected
    ${'βάρ\u03D0αρος'}                 | ${'βάρβαροσ'}
    ${'Ϲειϲμόϲ'}                       | ${'Σεισμόσ'}
    ${'τὴν'}                           | ${'τὴν'}
    ${'ὰὲὴὶὸὺὼ'}                       | ${'ὰὲὴὶὸὺὼ'}
  `('Preserving accents', ({ str, expected }) => {
    expect(removeGreekVariants(str, { preserveAccents: true })).toBe(expected)
  })

  // Preserving lunate sigmas

  test.each`
    str                                | expected
    ${'βάρ\u03D0αρος'}                 | ${'βάρβαροσ'}
    ${'Ϲειϲμόϲ'}                       | ${'Ϲειϲμόϲ'}
  `('Preserving lunate sigmas', ({ str, expected }) => {
    expect(removeGreekVariants(str, { preserveLunateSigma: true })).toBe(expected)
  })

})

describe('Remove diacritics', () => {

  // Preserving punctuation marks

  // Note: the internal `normalize()` call currently loses the 'ano teleia' and the 'greek question mark'.

  test.each`
    str                                                                                   | type                       | expected
    ${`τί${GREEK_QUESTION_MARK} καὶ τό${ANO_TELEIA} ἀλλ${RIGHT_SINGLE_QUOTATION_MARK} —`} | ${KeyType.GREEK}           | ${`τι; και το· αλλ${RIGHT_SINGLE_QUOTATION_MARK} —`}
    ${'τί; καὶ τό· ἀλλ’ —'}                                                               | ${KeyType.GREEK}           | ${`τι; και το· αλλ${RIGHT_SINGLE_QUOTATION_MARK} —`}
    ${'ti/; kai\\ to/: a)ll\' _'}                                                         | ${KeyType.BETA_CODE}       | ${'ti; kai to: all\' _'}
    ${`tí? kaì tó; all${RIGHT_SINGLE_QUOTATION_MARK} —`}                                  | ${KeyType.TRANSLITERATION} | ${`ti? kai to; all${RIGHT_SINGLE_QUOTATION_MARK} —`}
  `('Preserving punctuation marks', ({ str, type, expected }) => {
    expect(removeDiacritics(str, type)).toBe(expected)
  })

})