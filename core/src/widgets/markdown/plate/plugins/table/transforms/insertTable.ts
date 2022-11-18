import { ELEMENT_TABLE } from '@udecode/plate';
import {
  getBlockAbove,
  getPluginType,
  getStartPoint,
  insertNodes,
  selectEditor,
  someNode,
  withoutNormalizing,
} from '@udecode/plate-core';

import { getEmptyTableNode } from '../utils/getEmptyTableNode';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';
import type { TTableElement } from '../types';
import type { GetEmptyTableNodeOptions } from '../utils/getEmptyTableNode';

/**
 * Insert table if selection not in table.
 * Select start of table.
 */
export const insertTable = (
  editor: PlateEditor<MdValue>,
  { rowCount = 2, colCount = 2, header }: GetEmptyTableNodeOptions,
) => {
  withoutNormalizing(editor, () => {
    if (
      !someNode(editor, {
        match: { type: getPluginType(editor, ELEMENT_TABLE) },
      })
    ) {
      insertNodes<TTableElement>(editor, getEmptyTableNode(editor, { header, rowCount, colCount }));

      if (editor.selection) {
        const tableEntry = getBlockAbove(editor, {
          match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });
        if (!tableEntry) return;

        selectEditor(editor, { at: getStartPoint(editor, tableEntry[1]) });
      }
    }
  });
};
