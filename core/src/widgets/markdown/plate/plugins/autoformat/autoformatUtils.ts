import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  getParentNode,
  isElement,
  isType,
  toggleList,
  unwrapList,
} from '@udecode/plate';

import type { AutoformatBlockRule } from '@udecode/plate';
import type { MdEditor, MdValue } from '../../plateTypes';

export const preFormat: AutoformatBlockRule<MdValue, MdEditor>['preFormat'] = editor =>
  unwrapList(editor);

export const format = (editor: MdEditor, customFormatting: any) => {
  if (editor.selection) {
    const parentEntry = getParentNode(editor, editor.selection);
    if (!parentEntry) return;
    const [node] = parentEntry;
    if (
      isElement(node) &&
      !isType(editor, node, ELEMENT_CODE_BLOCK) &&
      !isType(editor, node, ELEMENT_CODE_LINE)
    ) {
      customFormatting();
    }
  }
};

export const formatList = (editor: MdEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor, {
      type: elementType,
    }),
  );
};

export const formatText = (editor: MdEditor, text: string) => {
  format(editor, () => editor.insertText(text));
};
