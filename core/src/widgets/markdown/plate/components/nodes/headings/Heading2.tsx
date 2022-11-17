import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

export const Heading2 = (props: PlateRenderElementProps) => {
  const { attributes, children, nodeProps } = props;

  return (
    <h2 {...attributes} {...nodeProps}>
      {children}
    </h2>
  );
};
