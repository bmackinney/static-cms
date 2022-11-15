import { isRangeAcrossBlocks, isRangeInSameBlock } from '@udecode/plate-core';
import isHotkey from 'is-hotkey';

import { keyShiftEdges } from '../constants';
import { getCellTypes } from '../utils/index';
import { moveSelectionFromCell } from './index';

import type { PlateEditor, TRange } from '@udecode/plate-core';
import type { MdValue } from '../../../plateTypes';

/**
 * Override the new selection if the previous selection and the new one are in different cells.
 */
export const overrideSelectionFromCell = (
  editor: PlateEditor<MdValue>,
  newSelection?: TRange | null,
) => {
  let hotkey: keyof typeof keyShiftEdges | undefined;

  if (
    !editor.currentKeyboardEvent ||
    !['up', 'down', 'shift+up', 'shift+right', 'shift+down', 'shift+left'].some(key => {
      const valid = isHotkey(key, editor.currentKeyboardEvent!);
      if (valid) {
        hotkey = key as keyof typeof keyShiftEdges;
      }

      return valid;
    }) ||
    !editor.selection?.focus ||
    !newSelection?.focus ||
    !isRangeAcrossBlocks(editor, {
      at: {
        anchor: editor.selection.focus,
        focus: newSelection.focus,
      },
      match: { type: getCellTypes(editor) },
    })
  ) {
    return;
  }

  if (!hotkey) {
    return;
  }

  const edge = keyShiftEdges[hotkey];

  // if the previous selection was in many cells, return
  if (
    edge &&
    !isRangeInSameBlock(editor, {
      at: editor.selection,
      match: { type: getCellTypes(editor) },
    })
  ) {
    return;
  }

  const prevSelection = editor.selection;
  const reverse = ['up', 'shift+up'].includes(hotkey);

  setTimeout(() => {
    moveSelectionFromCell(editor, {
      at: prevSelection,
      reverse,
      edge,
      fromOneCell: true,
    });
  }, 0);
};
