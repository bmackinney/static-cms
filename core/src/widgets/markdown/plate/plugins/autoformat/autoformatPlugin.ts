import { autoformatRules } from './autoformatRules';

import type { AutoformatPlugin } from '@udecode/plate';
import type { MdEditor, MdPlatePlugin, MdValue } from '../../plateTypes';

export const autoformatPlugin: Partial<MdPlatePlugin<AutoformatPlugin<MdValue, MdEditor>>> = {
  options: {
    rules: autoformatRules,
    enableUndoOnDelete: true,
  },
};
