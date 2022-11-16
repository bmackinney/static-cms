import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';

export const Heading4 = (props: PlateRenderElementProps) => {
  const { attributes, children, nodeProps } = props;

  return (
    <h4 {...attributes} {...nodeProps}>
      {children}
    </h4>
  );
};
