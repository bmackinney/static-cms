import React from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';
import type { MdValue } from '../../../plateTypes';

export const CodeBlockElement = (props: PlateRenderElementProps<MdValue>) => {
  const { attributes, children, nodeProps, element } = props;

  const { lang } = element;

  const codeClassName = lang ? `${lang} language-${lang}` : '';

  return (
    <>
      <pre {...attributes} {...nodeProps}>
        <code className={codeClassName}>{children}</code>
      </pre>
    </>
  );
};
