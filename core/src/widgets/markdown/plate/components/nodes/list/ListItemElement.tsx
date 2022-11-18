import { findNodePath, setNodes } from '@udecode/plate';
import React, { useCallback } from 'react';

import { isNotNullish } from '../../../../../../lib/util/null.util';

import type { PlateRenderElementProps } from '@udecode/plate';
import type { ChangeEvent } from 'react';
import type { MdListItemElement, MdValue } from '../../../plateTypes';

const ListItemElement = ({
  children,
  editor,
  element,
}: PlateRenderElementProps<MdValue, MdListItemElement>) => {
  const checked = element.checked;
  console.log('LIST_TO_DO element', element);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;
      const path = findNodePath(editor, element);
      console.log('LIST_TO_DO path', path, element);
      path && setNodes<MdListItemElement>(editor, { checked: value }, { at: path });
    },
    [editor, element],
  );

  return (
    <li>
      {isNotNullish(checked) ? (
        <input type="checkbox" checked={checked} onChange={handleChange} />
      ) : null}
      {children}
    </li>
  );
};

export default ListItemElement;
