import { removeGreekVariants } from '../src/index';

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