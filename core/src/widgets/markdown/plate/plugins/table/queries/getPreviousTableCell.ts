import { getNodeEntry } from '@udecode/plate-core';
import { Path } from 'slate';

import { getCellInPreviousTableRow } from './getCellInPreviousTableRow';

import type { TEditor, TNodeEntry } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

export const getPreviousTableCell = (
  editor: TEditor<MdValue>,
  _currentCell: TNodeEntry,
  currentPath: Path,
  currentRow: TNodeEntry,
): TNodeEntry | undefined => {
  try {
    return getNodeEntry(editor, Path.previous(currentPath));
  } catch (err) {
    const [, currentRowPath] = currentRow;
    return getCellInPreviousTableRow(editor, currentRowPath);
  }
};
