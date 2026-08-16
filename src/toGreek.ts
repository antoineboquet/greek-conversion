import { KeyType, Preset } from './enums.ts';
import { IConversionOptions, MixedPreset } from './interfaces.ts';
import { Mapping } from './Mapping.ts';
import {
  applyGreekVariants,
  fromTLG,
  handleOptions,
  normalizeGreek
} from './utils.ts';

export function toGreek(
  str: string = '',
  fromType: KeyType,
  settings: Preset | MixedPreset | IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const options = handleOptions(fromType, settings);
  const {
    //removeDiacritics,
    //removeExtraWhitespace,
    //betaCodeStyle,
    greekStyle,
    //transliterationStyle
  } = options;

  if (fromType === KeyType.BETA_CODE /* TLG */) str = fromTLG(str);
  if (fromType === KeyType.SIMPLE_BETA_CODE) fromType = KeyType.BETA_CODE;

  const mapping =
    declaredMapping ?? new Mapping(fromType, KeyType.GREEK, options);

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = mapping.apply(str);
      break;

    case KeyType.GREEK:
      break;

    case KeyType.TRANSLITERATION:
      str = mapping.apply(str);
      break;
  }

  return normalizeGreek(applyGreekVariants(str, greekStyle), greekStyle);
}
