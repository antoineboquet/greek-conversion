import { keyType } from './enums';
import { IConversionOptions } from './interfaces';
import { CIRCUMFLEX, MACRON, Mapping } from './Mapping';
import {
  applyUppercaseChars,
  removeDiacritics,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils';

export function toBetaCode(
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
      break;

    case keyType.GREEK:
      if (options.removeDiacritics) str = removeDiacritics(str, keyType.GREEK);
      str = removeGreekVariants(str);
      str = fromGreekToBetaCode(str, mapping);
      str = reorderDiacritics(str);
      break;

    case keyType.TRANSLITERATION:
      str = applyUppercaseChars(str);

      // Flag transliterated rough breathings.
      str = str.replace(/(?<=\p{P}|\s|^|r{1,2})h/gimu, '$');

      str = fromTransliterationToBetaCode(str, mapping, options);

      if (options.removeDiacritics) {
        str = removeDiacritics(str, keyType.BETA_CODE);
        str = str.replace(/\$/gi, '');
      } else {
        str = convertTransliteratedBreathings(str, mapping, '\\$');
      }

      str = reorderDiacritics(str);
      break;
  }

  if (!options.preserveWhitespace) str = removeExtraWhitespace(str);

  return str;
}

// @FIXME: take care of diaeresis, diphthongs and so on.
function convertTransliteratedBreathings(
  str: string,
  mapping: Mapping,
  escapedRoughBreathingMark: string
): string {
  const roughBreathing = mapping.DIACRITICS.ROUGH_BREATHING;
  const smoothBreathing = mapping.DIACRITICS.SMOOTH_BREATHING;
  const bcVowels = 'aehiowu';
  const bcDiacritics = '()\\/+=|';

  str = str.normalize('NFD');

  const re = new RegExp(
    `(?<=(?![${bcDiacritics}])\\p{P}|\\s|^)(?<trRoughBreathing>${escapedRoughBreathingMark})?(?<vowelsGroup>[${bcVowels}]{1,2})`,
    'gimu'
  );

  str = str.replace(re, (match, trRoughBreathing, vowelsGroup) => {
    const breathing = trRoughBreathing ? roughBreathing.bc : smoothBreathing.bc;
    return vowelsGroup + breathing;
  });

  // Apply rough breathings on rhos (excluding double rhos).
  str = str.replace(
    new RegExp(`(?<!r)(r)${escapedRoughBreathingMark}`, 'gi'),
    `$1${roughBreathing.bc}`
  );

  // Remove remaining flagged rough breathings (e.g. on double rhos).
  str = str.replace(new RegExp(`${escapedRoughBreathingMark}`, 'gi'), '');

  return str.normalize('NFC');
}

// @FIXME: reorder all diacritics combinations.
function reorderDiacritics(str: string): string {
  return str.replace(/(=)(\|)/g, '$2$1');
}

function fromGreekToBetaCode(greekStr: string, mapping: Mapping): string {
  const mappingProps = mapping.getPropertiesAsMap(
    keyType.GREEK,
    keyType.BETA_CODE
  );

  // Make sure the source string is correctly formed.
  greekStr = greekStr.normalize('NFD');

  let betaCodeStr = '';

  for (let i = 0; i < greekStr.length; i++) {
    let tmp: string;

    for (const [gr, bc] of new Map([
      ...mappingProps.chars,
      ...mappingProps.diacritics
    ])) {
      if (gr === greekStr[i]) {
        tmp = bc;
        break;
      }
    }

    betaCodeStr += tmp ?? greekStr[i];
  }

  return betaCodeStr.normalize('NFC');
}

function fromTransliterationToBetaCode(
  transliteratedStr: string,
  mapping: Mapping,
  options?: IConversionOptions
): string {
  const mappingProps = mapping.getPropertiesAsMap(
    keyType.TRANSLITERATION,
    keyType.BETA_CODE
  );
  const { removeDiacritics, setTransliterationStyle: style } = options;
  const longVowelMark = style?.useCxOverMacron ? CIRCUMFLEX : MACRON;
  const trUnaccentedLettersWithCxOrMacron = mapping
    .lettersWithCxOrMacron(options)
    .map((letter) => letter.tr.normalize('NFD').charAt(0))
    .join('');

  // Make sure the source string is correctly formed.
  transliteratedStr = transliteratedStr.normalize('NFC');

  let betaCodeStr = '';

  for (let i = 0; i < transliteratedStr.length; i++) {
    const tmp = {
      tr: undefined as string,
      bc: undefined as string
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

    // Apply beta code chars.
    for (const [tr, bc] of mappingProps.chars) {
      if ([recomposedChar, couple].includes(tr)) {
        // Add potential diacritics to the beta code char.
        [tmp.tr, tmp.bc] = [tr, bc + decomposedChar.slice(1)];

        // Couple found: increase the index twice & stop searching.
        if (tr === couple) {
          i++;
          break;
        }
      }
    }

    betaCodeStr += tmp.bc ?? transliteratedStr[i];
  }

  // Apply beta code diacritics.
  if (!removeDiacritics) {
    for (const [tr, bc] of mappingProps.diacritics) {
      if (!tr) continue;
      betaCodeStr = betaCodeStr.replace(new RegExp(tr, 'g'), bc);
    }
  }

  return betaCodeStr.normalize('NFC');
}
