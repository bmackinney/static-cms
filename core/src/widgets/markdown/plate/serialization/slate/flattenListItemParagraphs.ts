import { visit } from 'unist-util-visit';

import type { Plugin } from 'unified';
import type { Node, VisitorResult } from 'unist-util-visit';

const flattenListItemParagraphs: Plugin = function () {
  return ast => {
    visit(ast, 'listItem', (listItem: Node) => {
      if (listItem.children.length === 1 && listItem.children[0].type === 'paragraph') {
        listItem.children = listItem.children[0].children;
      }
      return listItem as VisitorResult;
    });
    return ast;
  };
};

export default flattenListItemParagraphs;
