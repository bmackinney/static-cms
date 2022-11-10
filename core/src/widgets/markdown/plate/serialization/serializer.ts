/* eslint-disable no-case-declarations */
// import { BlockType, defaultNodeTypes, LeafType, NodeTypes } from './ast-types';
import escapeHtml from 'escape-html';

import type { BlockType, LeafType, NodeTypes } from 'remark-slate';

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
  listDepth?: number;
  ignoreParagraphNewline?: boolean;
}

const isLeafNode = (node: MdBlockType | MdLeafType): node is MdLeafType => {
  return typeof (node as MdLeafType).text === 'string';
};

const VOID_ELEMENTS: Array<keyof NodeTypes> = ['thematic_break', 'image'];

const BREAK_TAG = '<br>';

const nodeTypes: NodeTypes = {
  paragraph: 'p',
  block_quote: 'block_quote',
  code_block: 'code_block',
  link: 'link',
  ul_list: 'ul',
  ol_list: 'ol',
  listItem: 'li',
  heading: {
    1: 'heading_one',
    2: 'heading_two',
    3: 'heading_three',
    4: 'heading_four',
    5: 'heading_five',
    6: 'heading_six',
  },
  emphasis_mark: 'italic',
  strong_mark: 'bold',
  delete_mark: 'strikeThrough',
  inline_code_mark: 'code',
  thematic_break: 'thematic_break',
  image: 'image',
};

export default function serialize(chunk: MdBlockType | MdLeafType, opts: Options = {}) {
  const { ignoreParagraphNewline = false, listDepth = 0 } = opts;

  const text = (chunk as MdLeafType).text || '';
  let type = (chunk as MdBlockType).type || '';

  const LIST_TYPES = [nodeTypes.ul_list, nodeTypes.ol_list];

  let children = text;

  if (!isLeafNode(chunk)) {
    children = chunk.children
      .map((c: MdBlockType | MdLeafType) => {
        const isList = !isLeafNode(c) ? (LIST_TYPES as string[]).includes(c.type || '') : false;
        const selfIsList = (LIST_TYPES as string[]).includes(chunk.type || '');

        console.log('child is list?', isList, c, 'self is list?', selfIsList, chunk);

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
          childrenHasLink = chunk.children.some(f => !isLeafNode(f) && f.type === nodeTypes.link);
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
          },
        );
      })
      .join('');
  }

  // This is pretty fragile code, check the long comment where we iterate over children
  if (
    !ignoreParagraphNewline &&
    (text === '' || text === '\n') &&
    chunk.parentType === nodeTypes.paragraph
  ) {
    type = nodeTypes.paragraph;
    children = BREAK_TAG;
  }

  if (children === '' && !VOID_ELEMENTS.find(k => nodeTypes[k] === type)) {
    return;
  }

  // Never allow decorating break tags with rich text formatting,
  // this can malform generated markdown
  // Also ensure we're only ever applying text formatting to leaf node
  // level chunks, otherwise we can end up in a situation where
  // we try applying formatting like to a node like this:
  // "Text foo bar **baz**" resulting in "**Text foo bar **baz****"
  // which is invalid markup and can mess everything up
  if (children !== BREAK_TAG && isLeafNode(chunk)) {
    children = escapeHtml(children);
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

  console.log('type', type);
  switch (type) {
    case nodeTypes.heading[1]:
      return `# ${children}\n`;
    case nodeTypes.heading[2]:
      return `## ${children}\n`;
    case nodeTypes.heading[3]:
      return `### ${children}\n`;
    case nodeTypes.heading[4]:
      return `#### ${children}\n`;
    case nodeTypes.heading[5]:
      return `##### ${children}\n`;
    case nodeTypes.heading[6]:
      return `###### ${children}\n`;

    case nodeTypes.block_quote:
      // For some reason, marked is parsing blockquotes w/ one new line
      // as contiued blockquotes, so adding two new lines ensures that doesn't
      // happen
      return `> ${children}\n\n`;

    case nodeTypes.code_block:
      return `\`\`\`${(chunk as MdBlockType).language || ''}\n${children}\n\`\`\`\n`;

    case nodeTypes.link:
      return `[${children}](${(chunk as MdBlockType).link || ''})`;
    case nodeTypes.image:
      return `![${(chunk as MdBlockType).caption}](${(chunk as MdBlockType).link || ''})`;

    case nodeTypes.ul_list:
    case nodeTypes.ol_list:
      console.log('its a list!', chunk, children);
      return `\n${children}\n`;

    case nodeTypes.listItem:
      console.log('its a list item!', chunk, children);
      const isOL = chunk && chunk.parentType === nodeTypes.ol_list;
      const treatAsLeaf =
        (chunk as MdBlockType).children.length === 1 &&
        (isLeafNode((chunk as MdBlockType).children[0]) ||
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

    case nodeTypes.paragraph:
      return `${children}\n`;

    case nodeTypes.thematic_break:
      return `---\n`;

    case 'lic':
      return children;

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
