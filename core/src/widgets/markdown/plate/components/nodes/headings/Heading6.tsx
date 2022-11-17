import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

export const Heading6 = (props: PlateRenderElementProps) => {
  const { attributes, children, nodeProps } = props;

  return (
    <h6 {...attributes} {...nodeProps}>
      {children}
    </h6>
  );
};
