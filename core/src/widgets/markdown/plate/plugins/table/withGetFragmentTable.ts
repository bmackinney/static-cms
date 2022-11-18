import { ELEMENT_TABLE } from '@udecode/plate';
import { getPluginType } from '@udecode/plate-core';

import { getTableGridAbove } from './queries/getTableGridAbove';

import type { PlateEditor, TDescendant, TElement } from '@udecode/plate-core';
import type { MdValue } from '../../plateTypes';

/**
 * If selection is in a table, get subtable above.
 */
export const withGetFragmentTable = (editor: PlateEditor<MdValue>) => {
  const { getFragment } = editor;

  editor.getFragment = (): any[] => {
    const fragment = getFragment();

    const newFragment: TDescendant[] = [];

    fragment.forEach(node => {
      if (node.type === getPluginType(editor, ELEMENT_TABLE)) {
        const rows = node.children as TElement[];

        const rowCount = rows.length;
        if (!rowCount) return;

        const colCount = rows[0].children.length;
        const hasOneCell = rowCount <= 1 && colCount <= 1;

        if (!hasOneCell) {
          const subTable = getTableGridAbove(editor);
          if (subTable.length) {
            newFragment.push(subTable[0][0]);
            return;
          }
        } else {
          newFragment.push(...(rows[0].children[0].children as TElement[]));
          return;
        }
      }

      newFragment.push(node);
    });

    return newFragment;
  };

  return editor;
};
