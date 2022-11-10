import { createPluginFactory, onKeyDownToggleMark, someHtmlElement } from '@udecode/plate-core';

import type { ToggleMarkPlugin } from '@udecode/plate-core';

export const MARK_STRIKETHROUGH = 'strikeThrough';

/**
 * Enables support for strikethrough formatting.
 */
const createStrikethroughPlugin = createPluginFactory<ToggleMarkPlugin>({
  key: MARK_STRIKETHROUGH,
  isLeaf: true,
  handlers: {
    onKeyDown: onKeyDownToggleMark,
  },
  options: {
    hotkey: 'mod+shift+x',
  },
  deserializeHtml: {
    rules: [
      { validNodeName: ['S', 'DEL', 'STRIKE'] },
      {
        validStyle: {
          textDecoration: 'line-through',
        },
      },
    ],
    query: el => !someHtmlElement(el, node => node.style.textDecoration === 'none'),
  },
});

export default createStrikethroughPlugin;
