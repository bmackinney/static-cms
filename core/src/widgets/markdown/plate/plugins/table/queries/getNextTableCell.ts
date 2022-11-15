import { getNodeEntry } from '@udecode/plate-core';
import { Path } from 'slate';

import { getCellInNextTableRow } from './getCellInNextTableRow';

import type { TEditor, TNodeEntry } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

export const getNextTableCell = (
  editor: TEditor<MdValue>,
  _currentCell: TNodeEntry,
  currentPath: Path,
  currentRow: TNodeEntry,
): TNodeEntry | undefined => {
  try {
    return getNodeEntry(editor, Path.next(currentPath));
  } catch (err) {
    const [, currentRowPath] = currentRow;
    return getCellInNextTableRow(editor, currentRowPath);
  }
};
