import { visit } from 'unist-util-visit';

import type { Plugin } from 'unified';
import type { Parent, Node, VisitorResult } from 'unist-util-visit';

const flattenListItemParagraphs: Plugin = function () {
  return ast => {
    visit(ast, 'listItem', (listItem: Parent) => {
      console.log('listItem', listItem);
      if ('children' in listItem && listItem.children.length > 0) {
        listItem.children = listItem.children.flatMap(child => {
          console.log('listItem => child', child);
          return child.type === 'paragraph' ? (child as Parent).children : child;
        }) as Node[];
        console.log('listItem => children', listItem.children);
      }
      return listItem as unknown as VisitorResult;
    });
    return ast;
  };
};

export default flattenListItemParagraphs;
