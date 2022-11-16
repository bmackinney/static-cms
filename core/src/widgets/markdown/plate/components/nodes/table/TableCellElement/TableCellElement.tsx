import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';
import type { MdValue } from '../../../../plateTypes';

export const TableCellElement = (props: PlateRenderElementProps<MdValue>) => {
  const { attributes, children, nodeProps } = props;

  return (
    <td {...attributes} {...nodeProps}>
      <div>{children}</div>
    </td>
  );
};
