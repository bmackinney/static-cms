import React from 'react';
import { ELEMENT_CODE_BLOCK, insertEmptyCodeBlock } from '@udecode/plate-code-block';
import {
  getPluginType,
  getPreventDefaultHandler,
  useEventPlateId,
  usePlateEditorState,
} from '@udecode/plate-core';
import { BlockToolbarButton } from '@udecode/plate-ui-toolbar';

import type { CodeBlockInsertOptions } from '@udecode/plate-code-block';
import type { Value } from '@udecode/plate-core';
import type { ToolbarButtonProps } from '@udecode/plate-ui-toolbar';

export const CodeBlockToolbarButton = <V extends Value>({
  id,
  options,
  ...props
}: ToolbarButtonProps & {
  options?: CodeBlockInsertOptions<V>;
}) => {
  const editor = usePlateEditorState(useEventPlateId(id));

  return (
    <BlockToolbarButton
      type={getPluginType(editor, ELEMENT_CODE_BLOCK)}
      onMouseDown={getPreventDefaultHandler(insertEmptyCodeBlock, editor, {
        insertNodesOptions: { select: true },
        ...options,
      })}
      {...props}
    />
  );
};
