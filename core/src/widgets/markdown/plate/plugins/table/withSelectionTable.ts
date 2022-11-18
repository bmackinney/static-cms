import { ELEMENT_TABLE } from '@udecode/plate';
import {
  getBlockAbove, getEndPoint, getPluginType, getPointBefore, getStartPoint, isRangeAcrossBlocks
} from '@udecode/plate-core';
import { Range } from 'slate';

import { overrideSelectionFromCell } from './transforms/overrideSelectionFromCell';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../plateTypes';

// TODO: tests

/**
 * Selection table:
 * - If anchor is in table, focus in a block before: set focus to start of table
 * - If anchor is in table, focus in a block after: set focus to end of table
 * - If focus is in table, anchor in a block before: set focus to end of table
 * - If focus is in table, anchor in a block after: set focus to the point before start of table
 */
export const withSelectionTable = (editor: PlateEditor<MdValue>) => {
  const { apply } = editor;

  editor.apply = op => {
    if (op.type === 'set_selection' && op.newProperties) {
      const newSelection = {
        ...editor.selection,
        ...op.newProperties,
      } as Range | null;

      if (
        Range.isRange(newSelection) &&
        isRangeAcrossBlocks(editor, {
          at: newSelection,
          match: n => 'type' in n && n.type === getPluginType(editor, ELEMENT_TABLE),
        })
      ) {
        const anchorEntry = getBlockAbove(editor, {
          at: newSelection.anchor,
          match: n => 'type' in n && n.type === getPluginType(editor, ELEMENT_TABLE),
        });

        if (!anchorEntry) {
          const focusEntry = getBlockAbove(editor, {
            at: newSelection.focus,
            match: n => 'type' in n && n.type === getPluginType(editor, ELEMENT_TABLE),
          });

          if (focusEntry) {
            const [, focusPath] = focusEntry;

            const isBackward = Range.isBackward(newSelection);

            if (isBackward) {
              const startPoint = getStartPoint(editor, focusPath);
              const pointBefore = getPointBefore(editor, startPoint);
              op.newProperties.focus = pointBefore ?? startPoint;
            } else {
              op.newProperties.focus = getEndPoint(editor, focusPath);
            }
          }
        } else {
          const [, anchorPath] = anchorEntry;

          const isBackward = Range.isBackward(newSelection);

          if (isBackward) {
            op.newProperties.focus = getStartPoint(editor, anchorPath);
          } else {
            const pointBefore = getPointBefore(editor, anchorPath);
            // if the table is the first block
            if (pointBefore) {
              op.newProperties.focus = getEndPoint(editor, anchorPath);
            }
          }
        }
      }

      overrideSelectionFromCell(editor, newSelection);
    }

    apply(op);
  };

  return editor;
};
