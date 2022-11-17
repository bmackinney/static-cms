import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

const BlockquoteElement = ({ children }: PlateRenderElementProps) => {
  return <blockquote>{children}</blockquote>;
};

export default BlockquoteElement;
