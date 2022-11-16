import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

export const TableRowElement = (props: PlateRenderElementProps) => {
  const { attributes, children, nodeProps } = props;

  return (
    <tr {...attributes} {...nodeProps}>
      {children}
    </tr>
  );
};
