import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';
import type { MdValue } from '../../../../plateTypes';

export const CodeLineElement = (props: PlateRenderElementProps<MdValue>) => {
  const { attributes, children, nodeProps } = props;

  return (
    <div {...attributes} {...nodeProps}>
      {children}
    </div>
  );
};
