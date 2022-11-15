import { withDeleteTable } from './withDeleteTable';
import { withGetFragmentTable } from './withGetFragmentTable';
import { withInsertFragmentTable } from './withInsertFragmentTable';
import { withInsertTextTable } from './withInsertTextTable';
import { withSelectionTable } from './withSelectionTable';

import type { PlateEditor, WithPlatePlugin } from '@udecode/plate-core';
import type { TablePlugin } from './types';
import type { MdValue } from '../../plateTypes';

export const withTable = (
  editor: PlateEditor<MdValue>,
  plugin: WithPlatePlugin<TablePlugin, MdValue, PlateEditor<MdValue>>,
) => {
  editor = withDeleteTable(editor);
  editor = withGetFragmentTable(editor);
  editor = withInsertFragmentTable(editor, plugin);
  editor = withInsertTextTable(editor);
  editor = withSelectionTable(editor);

  return editor;
};
