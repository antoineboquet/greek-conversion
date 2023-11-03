import { keyType } from './enums';
import { IConversionOptions } from './interfaces';
import {
  CIRCUMFLEX,
  MACRON,
  Mapping,
  ROUGH_BREATHING,
  SMOOTH_BREATHING
} from './Mapping';
import {
  applyGammaDiphthongs,
  applyGreekVariants,
  applyUppercaseChars,
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace
} from './utils';

export function toGreek(
  str: string,
  from: keyType,
  options: IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const mapping = declaredMapping ?? new Mapping(options);

  switch (from) {
    case keyType.BETA_CODE:
      if (options.removeDiacritics)
        str = removeDiacritics(str, keyType.BETA_CODE);
      str = fromBetaCodeToGreek(str, mapping);
      break;

    case keyType.GREEK:
      // @FIXME: apply conversion options to the greek string.
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.GREEK);
      break;

    case keyType.TRANSLITERATION:
      str = fromTransliterationToGreek(str, mapping, options);
      str = applyUppercaseChars(str);

      if (options.removeDiacritics) {
        str = removeDiacritics(str, keyType.TRANSLITERATION);
        str = str.replace(/h/gi, '');
      } else {
        str = convertTransliteratedBreathings(str);
      }

      str = normalizeGreek(str);
      break;
  }

  str = applyGreekVariants(str, options.setGreekStyle?.disableBetaVariant);
  str = applyGammaDiphthongs(str, keyType.GREEK);

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str);

  return str;
}

// @FIXME: take care of diaeresis, diphthongs and so on.
function convertTransliteratedBreathings(str: string): string {
  const grVowels = 'αεηιοωυ';

  str = str.normalize('NFD');

  const re = new RegExp(
    `(?<=\\p{P}|\\s|^)(?<trRoughBreathing>h)?(?<vowelsGroup>[${grVowels}]{1,2})`,
    'gimu'
  );

  str = str.replace(re, (match, trRoughBreathing, vowelsGroup) => {
    const breathing = trRoughBreathing ? ROUGH_BREATHING : SMOOTH_BREATHING;
    return vowelsGroup + breathing;
  });

  // Apply rough breathings on rhos (excluding double rhos).
  str = str.replace(new RegExp(`(?<!ρ)(ρ)h`, 'gi'), `$1${ROUGH_BREATHING}`);

  // Remove remaining flagged rough breathings (e.g. on double rhos).
  str = str.replace(new RegExp('h', 'gi'), '');

  return str.normalize('NFC');
}

function fromBetaCodeToGreek(betaCodeStr: string, mapping: Mapping): string {
  const mappingProps = mapping.getPropertiesAsMap(
    keyType.BETA_CODE,
    keyType.GREEK
  );

  // Make sure the source string is correctly formed.
  betaCodeStr = betaCodeStr.normalize('NFC');

  let greekStr = '';

  for (let i = 0; i < betaCodeStr.length; i++) {
    const tmp = {
      bc: undefined as string,
      gr: undefined as string
    };

    // e.g. small lunate sigma = `s3`.
    let couple = betaCodeStr.slice(i, i + 2);
    if (couple.length !== 2) couple = undefined as string;

    // Diacritics only. e.g. macron = `%26`.
    let triple = betaCodeStr.slice(i, i + 3);
    if (triple.length !== 3) triple = undefined as string;

    // Apply greek chars.
    for (const [bc, gr] of mappingProps.chars) {
      if ([betaCodeStr[i], couple].includes(bc)) {
        [tmp.bc, tmp.gr] = [bc, gr];

        // Couple found: increase the index twice & stop searching.
        if (bc === couple) {
          i++;
          break;
        }
      }
    }

    // Apply greek diacritics.
    for (const [bc, gr] of mappingProps.diacritics) {
      if ([betaCodeStr[i], triple].includes(bc)) {
        [tmp.bc, tmp.gr] = [bc, gr];

        // Triple found: increase the index three times & stop searching.
        if (bc === triple) {
          i += 2;
          break;
        }
      }
    }

    greekStr += tmp.gr ?? betaCodeStr[i];
  }

  return greekStr.normalize('NFC');
}

function fromTransliterationToGreek(
  transliteratedStr: string,
  mapping: Mapping,
  options?: IConversionOptions
): string {
  const mappingProps = mapping.getPropertiesAsMap(
    keyType.TRANSLITERATION,
    keyType.GREEK
  );
  const { removeDiacritics, setTransliterationStyle: style } = options;
  const longVowelMark = style?.useCxOverMacron ? CIRCUMFLEX : MACRON;
  const trUnaccentedLettersWithCxOrMacron = mapping
    .lettersWithCxOrMacron(options)
    .map((letter) => letter.tr.normalize('NFD').charAt(0))
    .join('');

  // Make sure the source string is correctly formed.
  transliteratedStr = transliteratedStr.normalize('NFC');

  let greekStr = '';

  for (let i = 0; i < transliteratedStr.length; i++) {
    const tmp = {
      tr: undefined as string,
      gr: undefined as string
    };

    let couple = transliteratedStr.slice(i, i + 2);
    if (couple.length !== 2) couple = undefined as string;

    // As some transliterated chars carry a macron or a circumflex we need
    // to isolate these diacritics with the current char for proper conversion.
    let decomposedChar = transliteratedStr[i].normalize('NFD');
    let recomposedChar = decomposedChar.charAt(0);

    if (trUnaccentedLettersWithCxOrMacron.includes(decomposedChar.charAt(0))) {
      if (decomposedChar.includes(longVowelMark)) {
        recomposedChar += longVowelMark;
        decomposedChar = decomposedChar.replace(longVowelMark, '');
      }

      recomposedChar = recomposedChar.normalize('NFC');
    }

    // Apply greek chars.
    for (const [tr, gr] of mappingProps.chars) {
      if ([recomposedChar, couple].includes(tr)) {
        [tmp.tr, tmp.gr] = [tr, gr];

        // Pair found: increase the index twice & stop searching.
        if (tr === couple) {
          i++;
          break;
        }
      }
    }

    greekStr += tmp.gr ?? transliteratedStr[i];

    const charDiacritics = decomposedChar.slice(1);

    // Apply greek diacritics.
    if (!removeDiacritics && charDiacritics) {
      for (const diacritic of charDiacritics) {
        for (const [tr, gr] of mappingProps.diacritics) {
          if (tr === diacritic) {
            greekStr += gr;
            break;
          }
        }
      }
    }
  }

  return greekStr.normalize('NFC');
}
