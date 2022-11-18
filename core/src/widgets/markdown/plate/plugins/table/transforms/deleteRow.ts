import { ELEMENT_TABLE, ELEMENT_TR } from '@udecode/plate';
import { getAboveNode, getPluginType, removeNodes, someNode } from '@udecode/plate-core';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';
import type { TTableElement } from '../types';

export const deleteRow = (editor: PlateEditor<MdValue>) => {
  if (
    someNode(editor, {
      match: { type: getPluginType(editor, ELEMENT_TABLE) },
    })
  ) {
    const currentTableItem = getAboveNode<TTableElement>(editor, {
      match: { type: getPluginType(editor, ELEMENT_TABLE) },
    });
    const currentRowItem = getAboveNode(editor, {
      match: { type: getPluginType(editor, ELEMENT_TR) },
    });
    if (
      currentRowItem &&
      currentTableItem &&
      // Cannot delete the last row
      currentTableItem[0].children.length > 1
    ) {
      removeNodes(editor, {
        at: currentRowItem[1],
      });
    }
  }
};
