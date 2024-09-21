import { AdditionalChar, KeyType, Preset } from './enums';
import {
  IConversionOptions,
  IGreekStyle,
  IInternalConversionOptions,
  MixedPreset
} from './interfaces';
import {
  ANO_TELEIA,
  CAPITAL_LUNATE_SIGMA,
  GRAVE_ACCENT,
  GREEK_BETA_SYMBOL,
  GREEK_QUESTION_MARK,
  GREEK_TILDE,
  IOTA_SUBSCRIPT,
  LATIN_TILDE,
  MIDDLE_DOT,
  PRECOMPOSED_CHARS_WITH_TONOS_OXIA,
  ROUGH_BREATHING,
  SMALL_LUNATE_SIGMA,
  SMOOTH_BREATHING
} from './Mapping';
import { applyPreset } from './presets';

export const notImplemented = (subject: string, value: string): never => {
  throw new RangeError(`${subject} '${value}' is not implemented.`);
};

export const applyGreekVariants = (
  greekStr: string,
  options?: IGreekStyle
): string => {
  // Apply beta variant (lowercase only).
  greekStr = greekStr.replace(new RegExp(GREEK_BETA_SYMBOL, 'g'), 'β');
  if (options?.useBetaVariant) {
    greekStr = greekStr.replace(/(?<!\p{P}|\s|^)β/gmu, GREEK_BETA_SYMBOL);
  }

  // Replace sigma variants
  greekStr = options?.useLunateSigma
    ? greekStr.replace(/[Σσς]/g, (m) =>
        m === 'Σ' ? CAPITAL_LUNATE_SIGMA : SMALL_LUNATE_SIGMA
      )
    : greekStr.replace(/ς/g, 'σ').replace(/(σ)(?=\p{P}|\s|$)/gmu, 'ς');

  // Replace pi + sigma with psi.
  greekStr = greekStr.replace(/Π[Σσ]/g, 'Ψ').replace(/πσ/g, 'ψ');

  return greekStr;
};

/**
 * Takes a TLG beta code string and returns a beta code string following
 * the `greek-conversion` convention.
 */
export const fromTLG = (betaCodeStr: string): string => {
  return betaCodeStr
    .toLowerCase()
    .replace(
      /(\*)([()\\/+=|?]*)([a-z])/g,
      (m, $1, $2, $3) => $3.toUpperCase() + $2
    );
};

/**
 * Takes a beta code string following the `greek-conversion` convention
 * and returns a TLG beta code string.
 *
 * @remarks
 * The iota subscript must remain after its base letter.
 */
export const toTLG = (betaCodeStr: string): string => {
  return betaCodeStr
    .replace(/([a-z])([()\\/+=?]*)/gi, (m, $1, $2) =>
      $1.toUpperCase() === $1 ? '*' + $2 + $1 : m
    )
    .toUpperCase();
};

/**
 * Returns an `IInternalConversionOptions` from a (mixed) preset or
 * a plain `IConversionOptions` object submitted by an end user.
 */
export const handleOptions = (
  fromType: KeyType,
  settings: Preset | MixedPreset | IConversionOptions = {}
): IInternalConversionOptions => {
  if (!Object.values(KeyType).includes(fromType)) {
    notImplemented('KeyType', fromType);
  }

  if (typeof settings === 'string') {
    settings = !isNaN(+settings) ? +settings : -1;
  }

  // Convert named presets (= numeric enum) to `IConversionOptions` objects.
  if (typeof settings === 'number' || Array.isArray(settings)) {
    settings = applyPreset(settings);
  }

  let { greekStyle, transliterationStyle, additionalChars } = settings ?? {};

  // Silently enable `AdditionalChar.LUNATE_SIGMA` if related options are enabled.
  if (greekStyle?.useLunateSigma || transliterationStyle?.lunatesigma_s) {
    if (!additionalChars) {
      settings.additionalChars = AdditionalChar.LUNATE_SIGMA;
    } else if (Array.isArray(additionalChars)) {
      if (!additionalChars.includes(AdditionalChar.LUNATE_SIGMA)) {
        settings.additionalChars = additionalChars.push(
          AdditionalChar.LUNATE_SIGMA
        );
      }
    } else if (additionalChars !== AdditionalChar.LUNATE_SIGMA) {
      settings.additionalChars = [
        additionalChars as AdditionalChar,
        AdditionalChar.LUNATE_SIGMA
      ];
    }
  }

  return settings;
};

/**
 * Returns a normalized greek string.
 *
 * @remarks
 * (1) Some characters must be applied in the canonically-decomposed form.
 * (2) Due to the poor Unicode canonical equivalences, any subsequent
 * normalization may break the replacements made by this function.
 */
export const normalizeGreek = (
  greekStr: string,
  options?: IGreekStyle
): string => {
  const { useGreekQuestionMark, useMonotonicOrthography } = options ?? {};

  greekStr = greekStr
    .normalize('NFD')
    .replace(new RegExp(LATIN_TILDE, 'g'), GREEK_TILDE);

  if (useMonotonicOrthography) {
    const diacritics = [
      SMOOTH_BREATHING,
      ROUGH_BREATHING,
      GRAVE_ACCENT,
      GREEK_TILDE,
      IOTA_SUBSCRIPT
    ];
    const reMonotonicOrthography = new RegExp(`[${diacritics.join('')}]`, 'g');
    greekStr = greekStr.replace(reMonotonicOrthography, '');
  }

  greekStr = greekStr
    .normalize()
    .replace(new RegExp(MIDDLE_DOT, 'g'), ANO_TELEIA);

  if (!useMonotonicOrthography) {
    for (const ch of PRECOMPOSED_CHARS_WITH_TONOS_OXIA) {
      greekStr = greekStr.replace(new RegExp(`${ch[0]}`, 'g'), ch[1]);
    }
  }

  return useGreekQuestionMark
    ? (greekStr = greekStr.replace(new RegExp(';', 'g'), GREEK_QUESTION_MARK))
    : greekStr;
};
