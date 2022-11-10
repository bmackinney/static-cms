import { createPluginFactory, onKeyDownToggleElement } from '@udecode/plate-core';

import { KEYS_HEADING } from './constants';

import type { HotkeyPlugin, PlatePlugin } from '@udecode/plate-core';

export type HeadingPlugin = HotkeyPlugin;

export interface HeadingsPlugin {
  /**
   * Heading levels supported from 1 to `levels`
   */
  levels?: number;
}

/**
 * Enables support for headings with configurable levels
 * (from 1 to 6).
 */
export const createHeadingPlugin = createPluginFactory<HeadingsPlugin>({
  key: 'heading',
  options: {
    levels: 6,
  },
  then: (_editor, { options: { levels } = {} }) => {
    const plugins: PlatePlugin<HeadingPlugin>[] = [];

    for (let level = 1; level <= levels!; level++) {
      const key = KEYS_HEADING[level - 1];

      const plugin: PlatePlugin<HeadingPlugin> = {
        key,
        isElement: true,
        deserializeHtml: {
          rules: [
            {
              validNodeName: `H${level}`,
            },
          ],
        },
        handlers: {
          onKeyDown: onKeyDownToggleElement,
        },
        options: {},
      };

      if (level < 4) {
        plugin.options!.hotkey = [`mod+opt+${level}`, `mod+shift+${level}`];
      }

      plugins.push(plugin);
    }

    return {
      plugins,
    };
  },
});
