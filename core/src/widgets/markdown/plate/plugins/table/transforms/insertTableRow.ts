import { ELEMENT_TABLE, ELEMENT_TR } from '@udecode/plate';
import {
  findNode,
  getBlockAbove,
  getPluginOptions,
  getPluginType,
  insertElements,
  select,
  withoutNormalizing,
} from '@udecode/plate-core';
import { Path } from 'slate';

import { getCellTypes, getEmptyRowNode } from '../utils/index';

import type { PlateEditor, TElement } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';
import type { TablePlugin } from '../types';

export const insertTableRow = (
  editor: PlateEditor<MdValue>,
  {
    header,
    fromRow,
    disableSelect,
  }: { header?: boolean; fromRow?: Path; disableSelect?: boolean } = {},
) => {
  const trEntry = fromRow
    ? findNode(editor, {
        at: fromRow,
        match: { type: getPluginType(editor, ELEMENT_TR) },
      })
    : getBlockAbove(editor, {
        match: { type: getPluginType(editor, ELEMENT_TR) },
      });
  if (!trEntry) return;

  const [trNode, trPath] = trEntry;

  const tableEntry = getBlockAbove(editor, {
    match: { type: getPluginType(editor, ELEMENT_TABLE) },
    at: trPath,
  });
  if (!tableEntry) return;

  const { newCellChildren } = getPluginOptions<TablePlugin, MdValue>(editor, ELEMENT_TABLE);

  withoutNormalizing(editor, () => {
    insertElements(
      editor,
      getEmptyRowNode(editor, {
        header,
        colCount: (('children' in trNode ? trNode.children : []) as TElement[]).length,
        newCellChildren,
      }),
      {
        at: Path.next(trPath),
      },
    );
  });

  if (!disableSelect) {
    const cellEntry = getBlockAbove(editor, {
      match: { type: getCellTypes(editor) },
    });
    if (!cellEntry) return;

    const [, nextCellPath] = cellEntry;

    nextCellPath[nextCellPath.length - 2] += 1;

    select(editor, nextCellPath);
  }
};
