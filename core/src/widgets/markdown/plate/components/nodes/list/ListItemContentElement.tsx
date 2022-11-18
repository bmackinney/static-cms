import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

const ListItemContentElement = ({ children }: PlateRenderElementProps) => {
  return <span>{children}</span>;
};

export default ListItemContentElement;
