import { AdditionalChars, KeyType, Style } from './enums';
import { GreekString } from './GreekString';
import { toBetaCode } from './toBetaCode';
import { toGreek } from './toGreek';
import { toTransliteration } from './toTransliteration';
import {
  applyGreekVariants,
  removeDiacritics,
  removeGreekVariants
} from './utils';

export { AdditionalChars, KeyType, Style } from './enums';
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
  KeyType,
  GreekString,
  toBetaCode,
  toGreek,
  toTransliteration,
  applyGreekVariants,
  removeDiacritics,
  removeGreekVariants
};
