import {
  getPluginType,
  getPreventDefaultHandler,
  someNode,
  useEventPlateId,
  usePlateEditorState,
} from '@udecode/plate-core';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { ToolbarButton } from '@udecode/plate-ui-toolbar';
import React from 'react';

import type { PlateEditor } from '@udecode/plate-core';
import type { ToolbarButtonProps } from '@udecode/plate-ui-toolbar';
import type { MdValue } from '../../../plateTypes';

export interface TableToolbarButtonProps extends ToolbarButtonProps {
  header?: boolean;
  transform: (editor: PlateEditor<MdValue>, options: { header?: boolean }) => void;
}

export const TableToolbarButton = ({
  id,
  transform,
  header,
  ...props
}: TableToolbarButtonProps) => {
  const editor = usePlateEditorState<MdValue>(useEventPlateId(id));
  const type = getPluginType(editor, ELEMENT_TABLE);

  return (
    <ToolbarButton
      active={
        !!editor?.selection &&
        someNode(editor, {
          match: { type },
        })
      }
      onMouseDown={
        !!type && editor ? getPreventDefaultHandler(transform, editor, { header }) : undefined
      }
      {...props}
    />
  );
};
