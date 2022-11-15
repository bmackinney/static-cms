import { getNodeEntry } from '@udecode/plate-core';
import { Path } from 'slate';

import type { TEditor, TElement, TNodeEntry } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

export const getCellInNextTableRow = (
  editor: TEditor<MdValue>,
  currentRowPath: Path,
): TNodeEntry | undefined => {
  try {
    const nextRow = getNodeEntry<TElement>(editor, Path.next(currentRowPath));
    // TODO: Many tables in rich text editors (Google Docs, Word),
    // add a new row if we're in the last cell. Should we do the same?
    const [nextRowNode, nextRowPath] = nextRow;
    const nextCell = nextRowNode?.children?.[0];
    const nextCellPath = nextRowPath.concat(0);
    if (nextCell && nextCellPath) {
      return getNodeEntry(editor, nextCellPath);
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}
};
