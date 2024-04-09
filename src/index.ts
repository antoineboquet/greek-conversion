/**
 * greek-conversion
 * Copyright (C) 2021, 2022, 2023, 2024 Antoine Boquet
 * @license AGPL-3.0
 */

export { AdditionalChar, Coronis, KeyType, Preset } from './enums';
export { GreekString } from './GreekString';
export { toBetaCode } from './toBetaCode';
export { toGreek } from './toGreek';
export { toTransliteration } from './toTransliteration';
export {
  applyGreekVariants,
  isMappedChar,
  removeDiacritics,
  removeGreekVariants
} from './utils';
