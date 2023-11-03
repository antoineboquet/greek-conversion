import { keyType } from './enums';
import {
  ANO_TELEIA,
  GREEK_QUESTION_MARK,
  GREEK_TILDE,
  LATIN_TILDE,
  MIDDLE_DOT,
  Mapping
} from './Mapping';

// @FIXME: take care of xi/chi variants.
export function applyGammaDiphthongs(str: string, type: keyType): string {
  switch (type) {
    case keyType.GREEK:
      str = str
        .replace(/ΝΓ/g, 'ΓΓ') // Upper
        .replace(/ΝΞ/g, 'ΓΞ')
        .replace(/ΝΚ/g, 'ΓΚ')
        .replace(/ΝΧ/g, 'ΓΧ')
        .replace(/Νγ/g, 'Γγ') // Upper + lower
        .replace(/Νξ/g, 'Γξ')
        .replace(/Νκ/g, 'Γκ')
        .replace(/Νχ/g, 'Γχ')
        .replace(/νγ/g, 'γγ') // Lower
        .replace(/νξ/g, 'γξ')
        .replace(/νκ/g, 'γκ')
        .replace(/νχ/g, 'γχ');
      break;

    case keyType.TRANSLITERATION:
      str = str
        .replace(/GG/g, 'NG') // Upper
        .replace(/GX/g, 'NX')
        .replace(/GK/g, 'NK')
        .replace(/GCH/g, 'NCH')
        .replace(/Gg/g, 'Ng') // Upper + lower
        .replace(/Gx/g, 'Nx')
        .replace(/Gk/g, 'Nk')
        .replace(/Gch/g, 'Nch')
        .replace(/gg/g, 'ng') // Lower
        .replace(/gx/g, 'nx')
        .replace(/gk/g, 'nk')
        .replace(/gch/g, 'nch');
      break;
  }

  return str;
}

// @FIXME: take care of diaeresis, diphthongs and so on.
export function applyBreathings(
  str: string,
  mapping: Mapping,
  toType: keyType,
  escapedRoughBreathingMark: string
): string {
  const roughBreathing = mapping.DIACRITICS.ROUGH_BREATHING;
  const smoothBreathing = mapping.DIACRITICS.SMOOTH_BREATHING;

  str = str.normalize('NFD');

  switch (toType) {
    case keyType.BETA_CODE:
      const bcVowels = 'aehiowu';
      const bcDiacritics = '()\\/+=|';
      const bcRe = new RegExp(
        `(?<=(?![${bcDiacritics}])\\p{P}|\\s|^)(?<trRoughBreathing>${escapedRoughBreathingMark})?(?<vowelsGroup>[${bcVowels}]{1,2})`,
        'gimu'
      );

      str = str.replace(bcRe, (match, trRoughBreathing, vowelsGroup) => {
        const breathing = trRoughBreathing
          ? roughBreathing.bc
          : smoothBreathing.bc;
        return vowelsGroup + breathing;
      });

      // Apply rough breathings on rhos (excluding double rhos).
      str = str.replace(
        new RegExp(`(?<!r)(r)${escapedRoughBreathingMark}`, 'gi'),
        `$1${roughBreathing.bc}`
      );
      break;

    case keyType.GREEK:
      const grVowels = 'αεηιοωυ';
      const grRe = new RegExp(
        `(?<=\\p{P}|\\s|^)(?<trRoughBreathing>${escapedRoughBreathingMark})?(?<vowelsGroup>[${grVowels}]{1,2})`,
        'gimu'
      );

      str = str.replace(grRe, (match, trRoughBreathing, vowelsGroup) => {
        const breathing = trRoughBreathing
          ? roughBreathing.gr
          : smoothBreathing.gr;
        return vowelsGroup + breathing;
      });

      // Apply rough breathings on rhos (excluding double rhos).
      str = str.replace(
        new RegExp(`(?<!ρ)(ρ)${escapedRoughBreathingMark}`, 'gi'),
        `$1${roughBreathing.gr}`
      );
      break;

    case keyType.TRANSLITERATION:
      throw new Error('not implemented');
  }

  // Remove remaining flagged rough breathings (e.g. on double rhos).
  str = str.replace(new RegExp(`${escapedRoughBreathingMark}`, 'gi'), '');

  return str.normalize('NFC');
}

export function applyGreekVariants(
  str: string,
  disableBetaVariant?: boolean
): string {
  // Apply beta variant.
  if (!disableBetaVariant) {
    str = str.replace(/\u03D0/g, 'β');
    str = str.replace(/(?<!\p{P}|\s|^)β/gmu, '\u03D0');
  }
  // Apply final sigma.
  str = str.replace(/ς/g, 'σ').replace(/(σ)(?=\p{P}|\s|$)/gmu, 'ς');

  // Replace pi + sigma with psi.
  str = str.replace(/Π[Σσ]/g, 'Ψ').replace(/πσ/g, 'ψ');

  return str;
}

export function applyUppercaseChars(str: string): string {
  return str.replace(/(?<=\p{P}|\s|^)(\S*)/gmu, (word) => {
    if (word.charAt(0) === 'H') {
      word = word.charAt(0) + word.charAt(1).toUpperCase() + word.slice(2);
    }

    return word;
  });
}

// @FIXME: not implemented yet.
/*export function isMappedKey(
  key: string,
  type: keyType,
  mapping?: Mapping
): boolean {
  // ...
}*/

/*
 * Please note that any other normalization will revert some
 * changes due to the weird Unicode canonical equivalences.
 */
export function normalizeGreek(str: string): string {
  str = str.normalize('NFD');

  // Latin only `combining tilde` -> `combining greek perispomeni`.
  str = str.replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE);

  str = str.normalize('NFC');

  // `Middle dot` -> `greek ano teleia`.
  str = str.replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA);
  // `Semicolon` -> `greek question mark`.
  str = str.replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK);

  return str;
}

export function removeDiacritics(str: string, type: keyType): string {
  switch (type) {
    case keyType.BETA_CODE:
      // Remove the following characters: `( ) \ / + = |`.
      str = str.replace(/[\(\)\\\/\+=\|]/g, '');
      break;

    case keyType.GREEK:
    case keyType.TRANSLITERATION:
      str = str.normalize('NFD');
      str = str.replace(/[\u0300-\u036f]/g, '');
      str = str.normalize('NFC');
      break;
  }

  return str;
}

export function removeGreekVariants(str: string): string {
  return str.replace(/ϐ/g, 'β').replace(/ς/g, 'σ');
}

export function removeExtraWhitespace(str: string): string {
  return str.replace(/(\s)+/g, '$1').trim();
}
