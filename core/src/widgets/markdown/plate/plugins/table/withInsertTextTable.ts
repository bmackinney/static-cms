import { collapseSelection, isExpanded } from '@udecode/plate-core';

import { getTableAbove, getTableGridAbove } from './queries/index';

import type { PlateEditor } from '@udecode/plate-core';
import type { MdValue } from '../../plateTypes';

export const withInsertTextTable = (editor: PlateEditor<MdValue>) => {
  const { insertText } = editor;

  editor.insertText = text => {
    if (isExpanded(editor.selection)) {
      const entry = getTableAbove(editor, {
        at: editor.selection?.anchor,
      });

      if (entry) {
        const cellEntries = getTableGridAbove(editor, {
          format: 'cell',
        });

        if (cellEntries.length > 1) {
          collapseSelection(editor, {
            edge: 'focus',
          });
        }
      }
    }

    insertText(text);
  };

  return editor;
};
