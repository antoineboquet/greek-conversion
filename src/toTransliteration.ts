import { keyType } from './enums';
import { IConversionOptions } from './interfaces';
import {
  ANO_TELEIA,
  GREEK_TILDE,
  GREEK_QUESTION_MARK,
  LATIN_TILDE,
  Mapping,
  MIDDLE_DOT,
  ROUGH_BREATHING,
  SMOOTH_BREATHING
} from './Mapping';
import {
  applyGammaDiphthongs,
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils';

export function toTransliteration(
  str: string,
  from: keyType,
  options: IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const mapping = declaredMapping ?? new Mapping(options);

  switch (from) {
    case keyType.BETA_CODE:
      str = flagRoughBreathings(str);
      if (options.removeDiacritics)
        str = removeDiacritics(str, keyType.BETA_CODE);
      str = fromBetaCodeToTransliteration(str, mapping);
      break;

    case keyType.GREEK:
      str = convertGreekBreathings(str);
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.GREEK);
      str = removeGreekVariants(str);
      str = normalizeGreek(str);
      str = fromGreekToTransliteration(str, mapping, options);
      break;

    case keyType.TRANSLITERATION:
      // @FIXME: apply conversion options to the transliterated string.
      if (options.removeDiacritics)
        str = removeDiacritics(str, keyType.TRANSLITERATION);
      break;
  }

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str);

  return applyGammaDiphthongs(str, keyType.TRANSLITERATION);
}

// @FIXME: take care of diaeresis, diphthongs and so on.
function convertGreekBreathings(str: string): string {
  const grVowels = 'αεηιοωυ';

  str = str.normalize('NFD');

  str = str.replace(new RegExp(SMOOTH_BREATHING, 'g'), '');

  const re = new RegExp(
    `(?<vowelsGroup>[${grVowels}]{1,2})(?<grRoughBreathing>${ROUGH_BREATHING})`,
    'gi'
  );

  str = str.replace(re, (match, vowelsGroup) => {
    if (vowelsGroup === vowelsGroup.toLowerCase()) return 'h' + vowelsGroup;
    else return 'H' + vowelsGroup.toLowerCase();
  });

  // Apply rough breathings on double rhos.
  const reDoubleRho = new RegExp(
    `(ρ${SMOOTH_BREATHING}?ρ)${ROUGH_BREATHING}?`,
    'gi'
  );
  str = str.replace(reDoubleRho, '$1h');

  // Apply rough breathings on single rhos.
  const reRho = new RegExp(`(ρ)${ROUGH_BREATHING}`, 'gi');
  str = str.replace(reRho, '$1h');

  return str.normalize('NFC');
}

/*
 * Rough breathings are ambiguous as `h` is transliterated to `η`.
 * This function transforms rough breathings to unambiguous flags
 * (`$` = `h`, `$$` = `H`) that need to be transliterated in
 * fromBetaCodeToTransliteration().
 */
function flagRoughBreathings(str: string): string {
  return str.replace(/([aehiowur]+)\(/gi, (match, group) => {
    if (match.toLowerCase() === 'r(') return group + '$';
    else if (group === group.toLowerCase()) return '$' + group;
    else return '$$' + group.toLowerCase();
  });
}

function fromBetaCodeToTransliteration(
  betaCodeStr: string,
  mapping: Mapping
): string {
  const mappingProps = mapping.getPropertiesAsMap(
    keyType.BETA_CODE,
    keyType.TRANSLITERATION
  );

  // Make sure the source string is correctly formed.
  betaCodeStr = betaCodeStr.normalize('NFC');

  let transliteratedStr = '';

  for (let i = 0; i < betaCodeStr.length; i++) {
    const tmp = {
      bc: undefined as string,
      tr: undefined as string
    };

    // e.g. small lunate sigma = `s3`.
    let couple = betaCodeStr.slice(i, i + 2);
    if (couple.length !== 2) couple = undefined as string;

    // Diacritics only. e.g. macron = `%26`.
    let triple = betaCodeStr.slice(i, i + 3);
    if (triple.length !== 3) triple = undefined as string;

    // Apply transliterated chars.
    for (const [bc, tr] of mappingProps.chars) {
      if ([betaCodeStr[i], couple].includes(bc)) {
        [tmp.bc, tmp.tr] = [bc, tr];

        // Couple found: increase the index twice & stop searching.
        if (bc === couple) {
          i++;
          break;
        }
      }
    }

    // Apply transliterated diacritics.
    for (const [bc, tr] of mappingProps.diacritics) {
      if ([betaCodeStr[i], triple].includes(bc)) {
        [tmp.bc, tmp.tr] = [bc, tr];

        // Triple found: increase the index three times & stop searching.
        if (bc === triple) {
          i += 2;
          break;
        }
      }
    }

    transliteratedStr += tmp.tr ?? betaCodeStr[i];
  }

  // Apply flagged rough breathings.
  transliteratedStr = transliteratedStr
    .replace(/\$\$/g, 'H')
    .replace(/\$/g, 'h');

  return transliteratedStr.normalize('NFC');
}

function fromGreekToTransliteration(
  greekStr: string,
  mapping: Mapping,
  options?: IConversionOptions
): string {
  const mappingProps = mapping.getPropertiesAsMap(
    keyType.GREEK,
    keyType.TRANSLITERATION
  );
  const { removeDiacritics } = options;

  // Make sure the source string is correctly formed.
  greekStr = greekStr.normalize('NFC');

  let transliteratedStr = '';

  for (let i = 0; i < greekStr.length; i++) {
    let tmp: string;

    // Normalized chars are deleted by the Unicode normalization due to the
    // poor canonical equivalences. Special chars need to be replaced twice.
    let decomposedChar = greekStr[i]
      .normalize('NFD')
      .replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE)
      .replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA)
      .replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK);

    // Apply transliterated chars.
    for (const [gr, tr] of mappingProps.chars) {
      if (gr === decomposedChar.charAt(0)) {
        tmp = tr;
        break;
      }
    }

    transliteratedStr += tmp ?? greekStr[i];

    const charDiacritics = decomposedChar.slice(1);

    // Apply transliterated diacritics.
    if (!removeDiacritics && charDiacritics) {
      for (const diacritic of charDiacritics) {
        for (const [gr, tr] of mappingProps.diacritics) {
          if (gr === diacritic) {
            transliteratedStr += tr;
            break;
          }
        }
      }
    }
  }

  return transliteratedStr.normalize('NFC');
}
