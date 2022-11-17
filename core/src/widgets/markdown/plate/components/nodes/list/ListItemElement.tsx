import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

const ListItemElement = ({ children }: PlateRenderElementProps) => {
  return <li>{children}</li>;
};

export default ListItemElement;
