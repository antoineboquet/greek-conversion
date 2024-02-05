import { additionalLetters, keyType } from './enums';
import { GreekString } from './GreekString';
import { toBetaCode } from './toBetaCode';
import { toGreek } from './toGreek';
import { toTransliteration } from './toTransliteration';
import {
  applyGreekVariants,
  removeDiacritics,
  removeGreekVariants
} from './utils';

export { additionalLetters, keyType } from './enums';
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
  keyType,
  GreekString,
  toBetaCode,
  toGreek,
  toTransliteration,
  applyGreekVariants,
  removeDiacritics,
  removeGreekVariants
};
