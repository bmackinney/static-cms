import type { TEditableProps } from '@udecode/plate';
import type { MdValue } from './plateTypes';

export const editableProps: TEditableProps<MdValue> = {
  spellCheck: false,
  autoFocus: false,
  readOnly: false,
  placeholder: 'Type…',
};
