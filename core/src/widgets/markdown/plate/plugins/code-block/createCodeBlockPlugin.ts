import { createPluginFactory } from '@udecode/plate-core';

import { ELEMENT_CODE_BLOCK } from './constants';
import { deserializeHtmlCodeBlock } from './deserializeHtmlCodeBlock';

import type { MdValue } from '../../plateTypes';
import type { PlateEditor, HotkeyPlugin } from '@udecode/plate-core';

/**
 * Enables support for pre-formatted code blocks.
 */
export const createCodeBlockPlugin = createPluginFactory<
  HotkeyPlugin,
  MdValue,
  PlateEditor<MdValue>
>({
  key: ELEMENT_CODE_BLOCK,
  isElement: true,
  deserializeHtml: deserializeHtmlCodeBlock,
  options: {
    hotkey: ['mod+opt+8', 'mod+shift+8'],
  },
});
