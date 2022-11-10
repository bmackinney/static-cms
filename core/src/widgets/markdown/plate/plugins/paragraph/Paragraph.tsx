import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

const Paragraph = ({ children }: PlateRenderElementProps) => {
  return <p style={{ marginBlockStart: '0.5rem', marginBlockEnd: '0.5rem' }}>{children}</p>;
};

export default Paragraph;
