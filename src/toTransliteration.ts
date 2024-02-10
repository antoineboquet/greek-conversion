import { KeyType } from './enums';
import { IConversionOptions } from './interfaces';
import { Mapping, ROUGH_BREATHING, SMOOTH_BREATHING } from './Mapping';
import {
  normalizeGreek,
  removeDiacritics,
  removeExtraWhitespace,
  removeGreekVariants
} from './utils';

export function toTransliteration(
  str: string,
  fromType: KeyType,
  options: IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const mapping = declaredMapping ?? new Mapping(options);
  const transliterationStyle = mapping.getTransliterationStyle();

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = bcFlagRoughBreathings(str);

      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.BETA_CODE);
      }

      str = mapping.apply(str, KeyType.BETA_CODE, KeyType.TRANSLITERATION);

      // Apply flagged rough breathings.
      str = str.replace(/\$\$/g, 'H').replace(/\$/g, 'h');
      break;

    case KeyType.GREEK:
      str = grConvertBreathings(str);
      if (options.removeDiacritics) str = removeDiacritics(str, KeyType.GREEK);
      str = removeGreekVariants(str);
      str = normalizeGreek(str);
      str = mapping.apply(str, KeyType.GREEK, KeyType.TRANSLITERATION);
      break;

    case KeyType.TRANSLITERATION:
      if (options.removeDiacritics) {
        str = removeDiacritics(str, KeyType.TRANSLITERATION, {
          letters: mapping.trLettersWithCxOrMacron(),
          useCxOverMacron: transliterationStyle?.useCxOverMacron
        });
      }

      str = mapping.apply(
        str,
        KeyType.TRANSLITERATION,
        KeyType.TRANSLITERATION
      );
      break;
  }

  if (transliterationStyle?.upsilon_y) str = applyUpsilon_Y(str);
  if (!options.preserveWhitespace) str = removeExtraWhitespace(str);

  return str;
}

/**
 * Returns a transliterated string with correct upsilon forms.
 *
 * @remarks
 * This applies to the `transliterationStyle.upsilon_y` option.
 *
 * @privateRemarks
 * It should print 'y' when a diaeresis occurs; but the SBL style guide
 * doesn't mention this.
 */
function applyUpsilon_Y(transliteratedStr: string): string {
  // Upsilon diphthongs are: 'au', 'eu', 'ēu', 'ou', 'ui'.
  const reUpsilonDiphthongs = new RegExp('(?<![aeo]\\p{M}*)(?<upsilon>u)(?!\\p{M}*i)', 'gimu'); // prettier-ignore

  return transliteratedStr
    .normalize('NFD')
    .replace(reUpsilonDiphthongs, (match, upsilon) => {
      if (upsilon === upsilon.toLowerCase()) return 'y';
      else return 'Y';
    })
    .normalize('NFC');
}

/**
 * Returns a greek string with tranliterated breathings.
 *
 * @remarks
 * This function does:
 *   1. remove smooth breathings;
 *   2. add an `h` before a word starting by 1-2 vowels carrying a rough breathing;
 *   3. add an `h` after double rhos carrying a rough breathing;
 *   4. add an `h` after a single rho carrying a rough breathing.
 */
function grConvertBreathings(greekStr: string): string {
  const reInitialBreathing = new RegExp(`(?<vowelsGroup>[αεηιοωυ]{1,2})(${ROUGH_BREATHING})`, 'gi'); // prettier-ignore
  const reDoubleRho = new RegExp(`(ρ${SMOOTH_BREATHING}?ρ)${ROUGH_BREATHING}?`, 'gi'); //prettier-ignore
  const reSingleRho = new RegExp(`(ρ)${ROUGH_BREATHING}`, 'gi');

  return greekStr
    .normalize('NFD')
    .replace(new RegExp(SMOOTH_BREATHING, 'g'), '')
    .replace(reInitialBreathing, (match, vowelsGroup) => {
      if (vowelsGroup === vowelsGroup.toLowerCase()) return 'h' + vowelsGroup;
      else return 'H' + vowelsGroup.toLowerCase();
    })
    .replace(reDoubleRho, '$1h') // Apply rough breathings on double rhos.
    .replace(reSingleRho, '$1h') // Apply rough breathings on single rhos.
    .normalize('NFC');
}

/**
 * Returns a beta code string with an unambiguous representation
 * of rough breathings (`h` -> `$`, `H` -> `$$`).
 *
 * @remarks
 * Rough breathings are ambiguous as letter `h` is transliterated
 * as `ē` or `ê`.
 */
function bcFlagRoughBreathings(betaCodeStr: string): string {
  return betaCodeStr.replace(/([aehiowur]+)\(/gi, (match, group) => {
    if (match.toLowerCase() === 'r(') return group + '$';
    else if (group === group.toLowerCase()) return '$' + group;
    else return '$$' + group.toLowerCase();
  });
}
