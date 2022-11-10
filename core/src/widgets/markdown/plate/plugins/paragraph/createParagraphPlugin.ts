import { createPluginFactory, onKeyDownToggleElement } from '@udecode/plate-core';

import type { HotkeyPlugin } from '@udecode/plate-core';

export const ELEMENT_PARAGRAPH = 'paragraph';

/**
 * Enables support for paragraphs.
 */
export const createParagraphPlugin = createPluginFactory<HotkeyPlugin>({
  key: ELEMENT_PARAGRAPH,
  isElement: true,
  handlers: {
    onKeyDown: onKeyDownToggleElement,
  },
  options: {
    hotkey: ['mod+opt+0', 'mod+shift+0'],
  },
  deserializeHtml: {
    rules: [
      {
        validNodeName: 'P',
      },
    ],
    query: el => el.style.fontFamily !== 'Consolas',
  },
});
