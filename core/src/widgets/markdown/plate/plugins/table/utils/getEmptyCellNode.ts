import { getPluginType } from '@udecode/plate-core';

import { ELEMENT_TD, ELEMENT_TH } from '../createTablePlugin';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';
import type { TablePlugin } from '../types';

export interface GetEmptyCellNodeOptions extends TablePlugin {
  /**
   * Header cell
   */
  header?: boolean;
}

export const getEmptyCellNode = (
  editor: PlateEditor<MdValue>,
  { header, newCellChildren = [editor.blockFactory()] }: GetEmptyCellNodeOptions,
) => {
  return {
    type: header ? getPluginType(editor, ELEMENT_TH) : getPluginType(editor, ELEMENT_TD),
    children: newCellChildren,
  };
};
