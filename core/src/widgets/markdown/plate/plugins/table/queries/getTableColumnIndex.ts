import { findNodePath, getParentNode } from '@udecode/plate-core';

import type { TElement, TReactEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

/**
 * Get table column index of a cell node.
 */
export const getTableColumnIndex = (
  editor: TReactEditor<MdValue>,
  { node }: { node: TElement },
) => {
  const path = findNodePath(editor, node);
  if (!path) return 0;

  const [trNode] = getParentNode(editor, path) ?? [];
  if (!trNode) return 0;

  let colIndex = 0;

  trNode.children.some((item, index) => {
    if (item === node) {
      colIndex = index;
      return true;
    }
    return false;
  });

  return colIndex;
};
