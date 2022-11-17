import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';
import type { MdValue } from '../../../plateTypes';

export const BlockquoteElement = (props: PlateRenderElementProps<MdValue>) => {
  const { attributes, children, nodeProps } = props;

  return (
    <blockquote {...attributes} {...nodeProps}>
      {children}
    </blockquote>
  );
};
