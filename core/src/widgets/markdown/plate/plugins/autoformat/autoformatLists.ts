import {
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  isBlock,
  setNodes,
} from '@udecode/plate';

import { formatList, preFormat } from './autoformatUtils';

import type { TTodoListItemElement } from '@udecode/plate';
import type { MdAutoformatRule } from '../../plateTypes';

export const autoformatLists: MdAutoformatRule[] = [
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['* ', '- '],
    preFormat,
    format: editor => formatList(editor, ELEMENT_UL),
  },
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['1. ', '1) '],
    preFormat,
    format: editor => formatList(editor, ELEMENT_OL),
  },
  {
    mode: 'block',
    type: ELEMENT_TODO_LI,
    match: '[] ',
  },
  {
    mode: 'block',
    type: ELEMENT_TODO_LI,
    match: '[x] ',
    format: editor =>
      setNodes<TTodoListItemElement>(
        editor,
        { type: ELEMENT_TODO_LI, checked: true },
        {
          match: n => isBlock(editor, n),
        },
      ),
  },
];
