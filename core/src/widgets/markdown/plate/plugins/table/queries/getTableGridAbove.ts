import { getEdgeBlocksAbove } from '@udecode/plate-core';
import { Path } from 'slate';

import { getCellTypes } from '../utils/getCellType';
import { getEmptyTableNode } from '../utils/getEmptyTableNode';
import { getTableGridByRange } from './getTableGridByRange';

import type {
  GetAboveNodeOptions,
  PlateEditor,
  TElement,
  TElementEntry,
} from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';
import type { GetTableGridByRangeOptions } from './getTableGridByRange';

export type GetTableGridAboveOptions = GetAboveNodeOptions<MdValue> &
  Pick<GetTableGridByRangeOptions, 'format'>;

/**
 * Get sub table above anchor and focus.
 * Format: tables or cells.
 */
export const getTableGridAbove = (
  editor: PlateEditor<MdValue>,
  { format = 'table', ...options }: GetTableGridAboveOptions = {},
): TElementEntry[] => {
  const edges = getEdgeBlocksAbove<TElement>(editor, {
    match: {
      type: getCellTypes(editor),
    },
    ...options,
  });

  if (edges) {
    const [start, end] = edges;

    if (!Path.equals(start[1], end[1])) {
      return getTableGridByRange(editor, {
        at: {
          anchor: {
            path: start[1],
            offset: 0,
          },
          focus: {
            path: end[1],
            offset: 0,
          },
        },
        format,
      });
    }

    if (format === 'table') {
      const table = getEmptyTableNode(editor, { rowCount: 1 });
      table.children[0].children = [start[0]];
      return [[table, start[1].slice(0, -2)]];
    }

    return [start];
  }

  return [];
};
