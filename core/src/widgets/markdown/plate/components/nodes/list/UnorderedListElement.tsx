import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

const UnorderedListElement = ({ children }: PlateRenderElementProps) => {
  return <ul>{children}</ul>;
};

export default UnorderedListElement;
