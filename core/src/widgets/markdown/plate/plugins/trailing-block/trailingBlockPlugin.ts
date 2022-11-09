import { ELEMENT_PARAGRAPH } from '@udecode/plate';

import type { TrailingBlockPlugin } from '@udecode/plate';
import type { MdPlatePlugin } from '../../plateTypes';

export const trailingBlockPlugin: Partial<MdPlatePlugin<TrailingBlockPlugin>> = {
  options: { type: ELEMENT_PARAGRAPH },
};
