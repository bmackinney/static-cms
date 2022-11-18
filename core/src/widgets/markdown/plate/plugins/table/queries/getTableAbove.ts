import { ELEMENT_TABLE } from '@udecode/plate';
import { getBlockAbove, getPluginType } from '@udecode/plate-core';

import type { GetAboveNodeOptions } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

export const getTableAbove = (
  editor: PlateEditor<MdValue>,
  options?: GetAboveNodeOptions<MdValue>,
) =>
  getBlockAbove(editor, {
    match: {
      type: getPluginType(editor, ELEMENT_TABLE),
    },
    ...options,
  });
