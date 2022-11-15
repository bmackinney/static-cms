import { getPluginTypes } from '@udecode/plate-core';

import { ELEMENT_TD, ELEMENT_TH } from '../createTablePlugin';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

/**
 * Get td and th types
 */
export const getCellTypes = (editor: PlateEditor<MdValue>) =>
  getPluginTypes(editor, [ELEMENT_TD, ELEMENT_TH]);
