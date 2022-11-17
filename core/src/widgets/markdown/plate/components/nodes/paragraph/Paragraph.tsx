import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

const Paragraph = ({ children }: PlateRenderElementProps) => {
  return <p>{children}</p>;
};

export default Paragraph;
