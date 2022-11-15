/* eslint-disable no-case-declarations */
// import { BlockType, defaultNodeTypes, LeafType, NodeTypes } from './ast-types';
import escapeHtml from 'escape-html';

import { NodeTypes } from './slate/ast-types';

import type { BlockType, LeafType } from 'remark-slate';
import type { TableNode } from './slate/ast-types';

interface FontStyles {
  color?: string;
  backgroundColor?: string;
}

interface MdLeafType extends LeafType, FontStyles {
  superscript?: boolean;
  subscript?: boolean;
  underline?: boolean;
}

interface MdBlockType extends Omit<BlockType, 'children'> {
  children: Array<MdBlockType | MdLeafType>;
}

interface Options {
  isInTable?: boolean;
  isInCode?: boolean;
  listDepth?: number;
  ignoreParagraphNewline?: boolean;
}

const isLeafNode = (node: MdBlockType | MdLeafType): node is MdLeafType => {
  return typeof (node as MdLeafType).text === 'string';
};

const VOID_ELEMENTS: Array<keyof typeof NodeTypes> = ['thematic_break', 'image', 'code_line'];

const BREAK_TAG = '<br />';

const CODE_ELEMENTS = [NodeTypes.code_line, NodeTypes.code_block];
const LIST_TYPES = [NodeTypes.ul_list, NodeTypes.ol_list];

export default function serialize(chunk: MdBlockType | MdLeafType, opts: Options = {}) {
  const {
    ignoreParagraphNewline = false,
    listDepth = 0,
    isInTable = false,
    isInCode = false,
  } = opts;

  const text = (chunk as MdLeafType).text || '';
  let type = (chunk as MdBlockType).type || '';

  let children = text;

  console.log('Processing', chunk);
  if (!isLeafNode(chunk)) {
    let separator = '';
    if (type === NodeTypes.tableRow) {
      separator = '|';
    }

    children = chunk.children
      .map((c: MdBlockType | MdLeafType) => {
        const selfIsTable = type === NodeTypes.table;
        const isList = !isLeafNode(c) ? (LIST_TYPES as string[]).includes(c.type || '') : false;
        const selfIsList = (LIST_TYPES as string[]).includes(chunk.type || '');
        const selfIsCode = (CODE_ELEMENTS as string[]).includes(chunk.type || '');

        // Links can have the following shape
        // In which case we don't want to surround
        // with break tags
        // {
        //  type: 'paragraph',
        //  children: [
        //    { text: '' },
        //    { type: 'link', children: [{ text: foo.com }]}
        //    { text: '' }
        //  ]
        // }
        let childrenHasLink = false;

        if (!isLeafNode(chunk) && Array.isArray(chunk.children)) {
          childrenHasLink = chunk.children.some(f => !isLeafNode(f) && f.type === NodeTypes.link);
        }

        return serialize(
          { ...c, parentType: type },
          {
            // WOAH.
            // what we're doing here is pretty tricky, it relates to the block below where
            // we check for ignoreParagraphNewline and set type to paragraph.
            // We want to strip out empty paragraphs sometimes, but other times we don't.
            // If we're the descendant of a list, we know we don't want a bunch
            // of whitespace. If we're parallel to a link we also don't want
            // to respect neighboring paragraphs
            ignoreParagraphNewline:
              (ignoreParagraphNewline || isList || selfIsList || childrenHasLink) &&
              // if we have c.break, never ignore empty paragraph new line
              !(c as MdBlockType).break,

            // track depth of nested lists so we can add proper spacing
            listDepth: (LIST_TYPES as string[]).includes((c as MdBlockType).type || '')
              ? listDepth + 1
              : listDepth,

            isInTable: selfIsTable || isInTable,

            isInCode: selfIsCode || isInCode,
          },
        );
      })
      .join(separator);
  }

  // This is pretty fragile code, check the long comment where we iterate over children
  if (
    !ignoreParagraphNewline &&
    (text === '' || text === '\n') &&
    chunk.parentType === NodeTypes.paragraph &&
    type !== NodeTypes.image
  ) {
    type = NodeTypes.paragraph;
    children = '\n';
  }

  if (children === '' && !VOID_ELEMENTS.find(k => NodeTypes[k] === type)) {
    console.log('skipping', chunk);
    return;
  }

  // Never allow decorating break tags with rich text formatting,
  // this can malform generated markdown
  // Also ensure we're only ever applying text formatting to leaf node
  // level chunks, otherwise we can end up in a situation where
  // we try applying formatting like to a node like this:
  // "Text foo bar **baz**" resulting in "**Text foo bar **baz****"
  // which is invalid markup and can mess everything up
  if (children !== '\n' && isLeafNode(chunk)) {
    children = isInCode || chunk.code ? children : escapeHtml(children);
    if (chunk.strikeThrough && chunk.bold && chunk.italic) {
      children = retainWhitespaceAndFormat(children, '~~***');
    } else if (chunk.bold && chunk.italic) {
      children = retainWhitespaceAndFormat(children, '***');
    } else {
      if (chunk.bold) {
        children = retainWhitespaceAndFormat(children, '**');
      }

      if (chunk.italic) {
        children = retainWhitespaceAndFormat(children, '_');
      }

      if (chunk.strikeThrough) {
        children = retainWhitespaceAndFormat(children, '~~');
      }

      if (chunk.code) {
        children = retainWhitespaceAndFormat(children, '`');
      }

      if (chunk.subscript) {
        children = retainWhitespaceAndFormat(children, '<sub>', '</sub>');
      }

      if (chunk.superscript) {
        children = retainWhitespaceAndFormat(children, '<sup>', '</sup>');
      }

      if (chunk.underline) {
        children = retainWhitespaceAndFormat(children, '<u>', '</u>');
      }

      if (chunk.color || chunk.backgroundColor) {
        const style: FontStyles = {};
        if (chunk.color) {
          style.color = chunk.color;
        }
        if (chunk.backgroundColor) {
          style.backgroundColor = chunk.backgroundColor;
        }

        const styleString = (Object.keys(style) as (keyof FontStyles)[])
          .map(key => `${key}: '${style[key]}'`)
          .join(', ');

        children = retainWhitespaceAndFormat(
          children,
          `<font style={{ ${styleString} }}>`,
          '</font>',
        );
      }
    }
  }

  if (!type) {
    console.log('No type! Returning just children...', chunk);
    return children;
  }

  console.log('Type check...', `"${type}"`, chunk, children);
  switch (type) {
    case NodeTypes.heading[1]:
      return `# ${children}\n`;
    case NodeTypes.heading[2]:
      return `## ${children}\n`;
    case NodeTypes.heading[3]:
      return `### ${children}\n`;
    case NodeTypes.heading[4]:
      return `#### ${children}\n`;
    case NodeTypes.heading[5]:
      return `##### ${children}\n`;
    case NodeTypes.heading[6]:
      return `###### ${children}\n`;

    case NodeTypes.block_quote:
      // For some reason, marked is parsing blockquotes w/ one new line
      // as contiued blockquotes, so adding two new lines ensures that doesn't
      // happen
      return `> ${children}\n\n`;

    case NodeTypes.code_block:
      return `\`\`\`${(chunk as MdBlockType).lang || ''}\n${children}\n\`\`\`\n`;

    case NodeTypes.link:
      return `[${children}](${(chunk as MdBlockType).url || ''})`;
    case NodeTypes.image:
      console.log('IMAGE', chunk);
      const caption = (chunk as MdBlockType).caption ?? [];
      return `![${caption.length > 0 ? caption[0].text ?? '' : ''}](${
        (chunk as MdBlockType).url || ''
      })`;

    case NodeTypes.ul_list:
    case NodeTypes.ol_list:
      return `\n${children}\n`;

    case NodeTypes.listItem:
      const isOL = chunk && chunk.parentType === NodeTypes.ol_list;
      const treatAsLeaf =
        (chunk as MdBlockType).children.length >= 1 &&
        ((chunk as MdBlockType).children.reduce((acc, child) => acc && isLeafNode(child), true) ||
          (listDepth === 0 && ((chunk as MdBlockType).children[0] as BlockType).type === 'lic'));

      let spacer = '';
      for (let k = 0; listDepth > k; k++) {
        if (isOL) {
          // https://github.com/remarkjs/remark-react/issues/65
          spacer += '   ';
        } else {
          spacer += '  ';
        }
      }
      return `${spacer}${isOL ? '1.' : '-'} ${children}${treatAsLeaf ? '\n' : ''}`;

    case NodeTypes.paragraph:
      return `${children}${!isInTable ? '\n' : ''}`;

    case NodeTypes.thematic_break:
      return `---\n`;

    case NodeTypes.listItemChild:
      return children;

    case NodeTypes.code_line:
      return `${children}\n`;

    case NodeTypes.table:
      const columns = getTableColumnCount(chunk as TableNode);
      console.log('TABLE SETUP', Array(columns).fill('---'));
      return `|${Array(columns).fill('   ').join('|')}|
|${Array(columns).fill('---').join('|')}|
${children}\n`;

    case NodeTypes.tableRow:
      return `|${children}|\n`;

    case NodeTypes.tableCell:
      console.log('TABLE_CELL', children, children.replace(/\|/g, '\\|').replace(/\n/g, BREAK_TAG));
      return children.replace(/\|/g, '\\|').replace(/\n/g, BREAK_TAG);

    default:
      console.warn('Unrecognized slate node, proceeding as text', `"${type}"`, chunk);
      return children;
  }
}

const reverseStr = (string: string) => string.split('').reverse().join('');

// This function handles the case of a string like this: "   foo   "
// Where it would be invalid markdown to generate this: "**   foo   **"
// We instead, want to trim the whitespace out, apply formatting, and then
// bring the whitespace back. So our returned string looks like this: "   **foo**   "
function retainWhitespaceAndFormat(string: string, format: string, endFormat?: string) {
  // we keep this for a comparison later
  const frozenString = string.trim();

  // children will be mutated
  const children = frozenString;

  // We reverse the right side formatting, to properly handle bold/italic and strikeThrough
  // formats, so we can create ~~***FooBar***~~
  const fullFormat = `${format}${children}${endFormat ? endFormat : reverseStr(format)}`;

  // This conditions accounts for no whitespace in our string
  // if we don't have any, we can return early.
  if (children.length === string.length) {
    return fullFormat;
  }

  // if we do have whitespace, let's add our formatting around our trimmed string
  // We reverse the right side formatting, to properly handle bold/italic and strikeThrough
  // formats, so we can create ~~***FooBar***~~
  const formattedString = `${format}${children}${endFormat ? endFormat : reverseStr(format)}`;

  // and replace the non-whitespace content of the string
  return string.replace(frozenString, formattedString);
}

function getTableColumnCount(tableNode: TableNode): number {
  const rows = tableNode.children;
  if (rows.length === 0) {
    return 0;
  }

  return rows[0].children.length;
}
