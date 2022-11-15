import { getNodeEntry } from '@udecode/plate-core';
import { Path } from 'slate';

import type { TEditor, TElement, TNodeEntry } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

export const getCellInPreviousTableRow = (
  editor: TEditor<MdValue>,
  currentRowPath: Path,
): TNodeEntry | undefined => {
  try {
    const previousRow = getNodeEntry<TElement>(editor, Path.previous(currentRowPath));
    const [previousRowNode, previousRowPath] = previousRow;
    const previousCell = previousRowNode?.children?.[previousRowNode.children.length - 1];
    const previousCellPath = previousRowPath.concat(previousRowNode.children.length - 1);
    if (previousCell && previousCellPath) {
      return getNodeEntry(editor, previousCellPath);
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}
};
