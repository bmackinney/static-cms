import { ELEMENT_TR } from '@udecode/plate';
import { getPluginType } from '@udecode/plate-core';

import { getEmptyCellNode } from './getEmptyCellNode';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';
import type { GetEmptyCellNodeOptions } from './getEmptyCellNode';

export interface GetEmptyRowNodeOptions extends GetEmptyCellNodeOptions {
  colCount?: number;
}

export const getEmptyRowNode = (
  editor: PlateEditor<MdValue>,
  { colCount, ...options }: GetEmptyRowNodeOptions = {},
) => {
  return {
    type: getPluginType(editor, ELEMENT_TR),
    children: Array(colCount)
      .fill(colCount)
      .map(() => getEmptyCellNode(editor, options)),
  };
};
