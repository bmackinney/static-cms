import { TEditableProps } from '@udecode/plate';
import { MdValue } from '../typescript/plateTypes';

export const editableProps: TEditableProps<MdValue> = {
  spellCheck: false,
  autoFocus: false,
  readOnly: false,
  placeholder: 'Type…',
};
