import type {
  ConversionOptions,
  DiacriticOptions,
  Preset,
} from "./options.ts";

export type PresetOptions = Omit<ConversionOptions, "preset">;

const OMIT_NON_ROUGH_DIACRITICS = {
  accents: "remove",
  smoothBreathing: "remove",
  roughBreathing: "preserve",
  coronis: "remove",
  diaeresis: "remove",
  iotaSubscript: "remove",
  quantity: "remove",
} as const satisfies DiacriticOptions;

const PRESET_OPTIONS = {
  "iso-843-type-1": {
    orthography: {
      beta: "v",
      coronis: "apostrophe",
      eta: "ī",
      nasalGamma: "literal",
      phi: "f",
      upsilon: "y",
    },
  },
  "ala-lc-ancient": {
    diacritics: OMIT_NON_ROUGH_DIACRITICS,
    orthography: {
      numerals: "decimal",
      upsilon: "y-with-diphthong-u",
    },
  },
  "ala-lc-modern": {
    diacritics: OMIT_NON_ROUGH_DIACRITICS,
    orthography: {
      beta: "v",
      modernDigraphs: "ala-lc",
      numerals: "decimal",
      upsilon: "y-with-diphthong-u",
    },
  },
  "sbl-academic": {
    orthography: {
      upsilon: "y-with-diphthong-u",
    },
  },
  "sbl-general": {
    diacritics: {
      accents: "remove",
      smoothBreathing: "remove",
      roughBreathing: "preserve",
      coronis: "remove",
      diaeresis: "preserve",
      iotaSubscript: "remove",
      quantity: "remove",
    },
    orthography: {
      upsilon: "y-with-diphthong-u",
    },
  },
  "tlg-core": {},
  "bnf-core": {},
} as const satisfies Record<Preset, PresetOptions>;

export const PRESETS = Object.freeze(
  Object.keys(PRESET_OPTIONS) as Preset[],
);

/** Returns a detached copy so callers cannot mutate the preset registry. */
export function getPresetOptions(preset: Preset): PresetOptions {
  return mergeConversionOptions({}, registeredPreset(preset));
}

/** Resolves defaults < preset < custom options and removes the preset marker. */
export function resolveConversionOptions(
  options: ConversionOptions = {},
): PresetOptions {
  const { preset, ...custom } = options;
  const base = preset === undefined ? {} : registeredPreset(preset);
  return mergeConversionOptions(base, custom);
}

function registeredPreset(preset: Preset): PresetOptions {
  if (!Object.hasOwn(PRESET_OPTIONS, preset)) {
    throw new RangeError(`Unknown conversion preset: ${preset}`);
  }
  return PRESET_OPTIONS[preset];
}

function mergeConversionOptions(
  base: PresetOptions,
  overrides: PresetOptions,
): PresetOptions {
  const merged: PresetOptions = {};

  assignDefined(merged, base);
  assignDefined(merged, overrides);
  merged.orthography = mergeGroup(base.orthography, overrides.orthography);
  merged.unicode = mergeGroup(base.unicode, overrides.unicode);
  merged.diacritics = mergeGroup(base.diacritics, overrides.diacritics);

  if (merged.orthography === undefined) delete merged.orthography;
  if (merged.unicode === undefined) delete merged.unicode;
  if (merged.diacritics === undefined) delete merged.diacritics;

  return merged;
}

function assignDefined(
  target: PresetOptions,
  source: PresetOptions,
): void {
  if (source.removeDiacritics !== undefined) {
    target.removeDiacritics = source.removeDiacritics;
  }
}

function mergeGroup<T extends object>(
  base: T | undefined,
  overrides: T | undefined,
): T | undefined {
  if (base === undefined && overrides === undefined) return undefined;

  const definedOverrides = overrides === undefined
    ? {}
    : Object.fromEntries(
      Object.entries(overrides).filter(([, value]) => value !== undefined),
    );
  return { ...base, ...definedOverrides } as T;
}
