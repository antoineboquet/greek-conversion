/**
 * greek-conversion
 * Copyright (C) 2021, 2022, 2023, 2024 Antoine Boquet
 * @license AGPL-3.0
 */

import { AdditionalChar, Coronis, KeyType, Preset } from './enums';
import { GreekString } from './GreekString';
import { toBetaCode } from './toBetaCode';
import { toGreek } from './toGreek';
import { toTransliteration } from './toTransliteration';
import {
  applyGreekVariants,
  removeDiacritics,
  removeGreekVariants
} from './utils';

export { AdditionalChar, Coronis, KeyType, Preset } from './enums';
export { GreekString } from './GreekString';
export { toBetaCode } from './toBetaCode';
export { toGreek } from './toGreek';
export { toTransliteration } from './toTransliteration';
export {
  applyGreekVariants,
  removeDiacritics,
  removeGreekVariants
} from './utils';

export default {
  AdditionalChar,
  Coronis,
  KeyType,
  Preset,
  GreekString,
  toBetaCode,
  toGreek,
  toTransliteration,
  applyGreekVariants,
  removeDiacritics,
  removeGreekVariants
};
