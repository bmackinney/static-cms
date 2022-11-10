import {
  CodeBlockElement,
  createPlateUI,
  ELEMENT_CODE_BLOCK,
  StyledElement,
  withProps,
} from '@udecode/plate';

import { ELEMENT_PARAGRAPH } from './plugins/paragraph/createParagraphPlugin';

export const plateUI = createPlateUI({
  [ELEMENT_CODE_BLOCK]: CodeBlockElement,
  [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
    // as: 'p',
    styles: {
      root: {
        margin: 0,
        padding: '4px 0',
      },
    },
    prefixClassNames: 'p',
  }),
});
