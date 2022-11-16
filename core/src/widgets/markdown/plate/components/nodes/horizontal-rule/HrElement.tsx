import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';
import type { MdValue } from '../../../plateTypes';

export const HrElement = (props: PlateRenderElementProps<MdValue>) => {
  const { attributes, children, nodeProps } = props;

  return (
    <div {...attributes} {...nodeProps}>
      <hr contentEditable={false} {...nodeProps} />
      {children}
    </div>
  );
};
