import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

const ListToDoItemElement = ({ children }: PlateRenderElementProps) => {
  return <li><input type="checkbox" />{children}</li>;
};

export default ListToDoItemElement;
