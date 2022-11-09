import { ELEMENT_HR, ELEMENT_IMAGE } from '@udecode/plate';

import type { SelectOnBackspacePlugin } from '@udecode/plate';
import type { MdPlatePlugin } from '../../plateTypes';

export const selectOnBackspacePlugin: Partial<MdPlatePlugin<SelectOnBackspacePlugin>> = {
  options: {
    query: {
      allow: [ELEMENT_IMAGE, ELEMENT_HR],
    },
  },
};
