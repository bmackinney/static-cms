import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

const OrderedListElement = ({ children }: PlateRenderElementProps) => {
  return <ol>{children}</ol>;
};

export default OrderedListElement;
