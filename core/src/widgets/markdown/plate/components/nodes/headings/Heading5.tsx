import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

export const Heading5 = (props: PlateRenderElementProps) => {
  const { attributes, children, nodeProps } = props;

  return (
    <h5 {...attributes} {...nodeProps}>
      {children}
    </h5>
  );
};
