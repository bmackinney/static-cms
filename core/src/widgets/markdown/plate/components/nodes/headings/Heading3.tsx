import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

export const Heading3 = (props: PlateRenderElementProps) => {
  const { attributes, children, nodeProps } = props;

  return (
    <h3 {...attributes} {...nodeProps}>
      {children}
    </h3>
  );
};
