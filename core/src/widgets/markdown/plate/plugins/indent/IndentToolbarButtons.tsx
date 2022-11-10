import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import { indent, outdent, ToolbarButton } from '@udecode/plate';
import React from 'react';

import { useMdPlateEditorRef } from '../../plateTypes';

export const IndentToolbarButtons = () => {
  const editor = useMdPlateEditorRef();

  return (
    <>
      <ToolbarButton
        onMouseDown={e => {
          if (!editor) return;

          outdent(editor);
          e.preventDefault();
        }}
        icon={<FormatIndentDecreaseIcon />}
      />
      <ToolbarButton
        onMouseDown={e => {
          if (!editor) return;

          indent(editor);
          e.preventDefault();
        }}
        icon={<FormatIndentIncreaseIcon />}
      />
    </>
  );
};
