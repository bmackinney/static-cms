import { getPluginType } from '@udecode/plate-core';

import { ELEMENT_TABLE } from '../createTablePlugin';
import { getEmptyRowNode } from './getEmptyRowNode';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';
import type { TTableElement } from '../types';
import type { GetEmptyRowNodeOptions } from './getEmptyRowNode';

export interface GetEmptyTableNodeOptions extends GetEmptyRowNodeOptions {
  rowCount?: number;
}

export const getEmptyTableNode = (
  editor: PlateEditor<MdValue>,
  { header, rowCount = 0, colCount, newCellChildren }: GetEmptyTableNodeOptions = {},
): TTableElement => {
  const rows = Array(rowCount)
    .fill(rowCount)
    .map(() => getEmptyRowNode(editor, { header, colCount, newCellChildren }));

  return {
    type: getPluginType(editor, ELEMENT_TABLE),
    children: rows,
  };
};
