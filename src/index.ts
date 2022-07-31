import { keyType } from './enums'
import { GreekString } from './GreekString'
import { toBetaCode } from './toBetaCode'
import { toGreek } from './toGreek'
import { toTransliteration } from './toTransliteration'
import {
  applyGammaDiphthongs,
  applyGreekVariants,
  isMappedKey,
  removeDiacritics,
  removeGreekVariants
} from './utils'

export { keyType } from './enums'
export { GreekString } from './GreekString'
export { toBetaCode } from './toBetaCode'
export { toGreek } from './toGreek'
export { toTransliteration } from './toTransliteration'
export {
  applyGammaDiphthongs,
  applyGreekVariants,
  isMappedKey,
  removeDiacritics,
  removeGreekVariants
} from './utils'

export default {
  keyType,
  GreekString,
  toBetaCode,
  toGreek,
  toTransliteration,
  applyGammaDiphthongs,
  applyGreekVariants,
  isMappedKey,
  removeDiacritics,
  removeGreekVariants
}
