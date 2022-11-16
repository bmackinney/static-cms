import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

export const Heading1 = (props: PlateRenderElementProps) => {
  const { attributes, children, nodeProps } = props;

  return (
    <h1 {...attributes} {...nodeProps}>
      {children}
    </h1>
  );
};
