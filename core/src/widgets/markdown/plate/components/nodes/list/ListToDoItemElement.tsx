import { findNodePath, setNodes } from '@udecode/plate';
import React, { useCallback } from 'react';

import type { PlateRenderElementProps, TCodeBlockElement } from '@udecode/plate';
import type { ChangeEvent } from 'react';

const ListToDoItemElement = ({ children, editor, element }: PlateRenderElementProps) => {
  const checked = ('checked' in element ? element.checked ?? false : false) as boolean;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;
      const path = findNodePath(editor, element);
      path && setNodes<TCodeBlockElement>(editor, { checked: value }, { at: path });
    },
    [editor, element],
  );

  return (
    <li>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      {children}
    </li>
  );
};

export default ListToDoItemElement;
