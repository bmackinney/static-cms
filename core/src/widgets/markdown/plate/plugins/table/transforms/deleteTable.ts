import { getAboveNode, getPluginType, removeNodes, someNode } from '@udecode/plate-core';

import { ELEMENT_TABLE } from '../createTablePlugin';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

export const deleteTable = (editor: PlateEditor<MdValue>) => {
  if (
    someNode(editor, {
      match: { type: getPluginType(editor, ELEMENT_TABLE) },
    })
  ) {
    const tableItem = getAboveNode(editor, {
      match: { type: getPluginType(editor, ELEMENT_TABLE) },
    });
    if (tableItem) {
      removeNodes(editor, {
        at: tableItem[1],
      });
    }
  }
};
