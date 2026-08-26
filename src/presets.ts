import {
  type ConversionOptions,
  DEFAULT_CONVERSION_OPTIONS,
  type DiacriticOptions,
  type Preset,
  type ResolvedConversionOptions,
} from "./options.ts";

/** Partial option fields contributed by one registered preset. */
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

/** Stable list of bundled preset identifiers. */
export const PRESETS: readonly Preset[] = Object.freeze(
  Object.keys(PRESET_OPTIONS) as Preset[],
);

/**
 * Returns a detached copy of one bundled preset configuration.
 *
 * @throws {RangeError} If the identifier is not registered at runtime.
 */
export function getPresetOptions(preset: Preset): PresetOptions {
  return mergeConversionOptions({}, registeredPreset(preset));
}

/**
 * Merges one preset with custom options and removes the preset marker.
 *
 * Custom fields override corresponding preset fields while unrelated preset
 * fields remain active. The returned object is detached from the registry.
 *
 * @throws {RangeError} If `options.preset` is not registered at runtime.
 */
export function resolveConversionOptions(
  options: ConversionOptions = {},
): ResolvedConversionOptions {
  const { preset, ...custom } = options;
  const base = preset === undefined ? {} : registeredPreset(preset);
  const merged = mergeConversionOptions(base, custom);

  return {
    orthography: {
      ...DEFAULT_CONVERSION_OPTIONS.orthography,
      ...merged.orthography,
    },
    unicode: {
      ...DEFAULT_CONVERSION_OPTIONS.unicode,
      ...merged.unicode,
    },
    diacritics: {
      ...DEFAULT_CONVERSION_OPTIONS.diacritics,
      ...merged.diacritics,
    },
    removeDiacritics: merged.removeDiacritics ??
      DEFAULT_CONVERSION_OPTIONS.removeDiacritics,
  };
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

  const definedOverrides = overrides === undefined ? {} : Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  );
  return { ...base, ...definedOverrides } as T;
}
