import { KeyType, Preset } from './enums';
import { IConversionOptions, MixedPreset } from './interfaces';
import { Mapping } from './Mapping';
import { fromTLG, handleOptions, removeGreekVariants } from './utils';

export function toTransliteration(
  str: string = '',
  fromType: KeyType,
  settings: Preset | MixedPreset | IConversionOptions = {},
  declaredMapping?: Mapping
): string {
  const options = handleOptions(fromType, settings);
  const {
    removeDiacritics,
    removeExtraWhitespace,
    betaCodeStyle,
    transliterationStyle
  } = options;
  const {
    setCoronisStyle,
    useCxOverMacron,
    muPi_b,
    nuTau_d,
    rho_rh,
    upsilon_y
  } = transliterationStyle ?? {};
  if (fromType === KeyType.BETA_CODE /* TLG */) str = fromTLG(str);
  if (fromType === KeyType.SIMPLE_BETA_CODE) fromType = KeyType.BETA_CODE;

  const mapping =
    declaredMapping ?? new Mapping(fromType, KeyType.TRANSLITERATION, options);

  switch (fromType) {
    case KeyType.BETA_CODE:
      str = mapping.apply(str);
      break;

    case KeyType.GREEK:
      str = removeGreekVariants(str);
      str = mapping.apply(str);
      break;

    case KeyType.TRANSLITERATION:
      str = mapping.apply(str);
      break;
  }

  return str;
}
