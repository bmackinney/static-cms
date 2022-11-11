/* eslint-disable no-case-declarations */
import { allowedStyles, NodeTypes, MarkNodeTypes } from './ast-types';

import type {
  BlockQuoteNode,
  CodeBlockNode,
  ColorMdxMdastNodeAttribute,
  DeserializedNode,
  HeadingNode,
  ImageNode,
  InputNodeTypes,
  ItalicNode,
  LinkNode,
  ListItemNode,
  ListNode,
  MarkNode,
  MdastNode,
  ParagraphNode,
  StyleMdxMdastNodeAttribute,
  TextNode,
  TextNodeStyles,
  ThematicBreakNode,
} from './ast-types';

const forceLeafNode = (children: Array<TextNode>) => ({
  text: children.map(k => k?.text).join(''),
});

// This function is will take any unknown keys, and bring them up a level
// allowing leaf nodes to have many different formats at once
// for example, bold and italic on the same node
function persistLeafFormats(
  children: Array<MdastNode>,
): Omit<MdastNode, 'children' | 'type' | 'text'> {
  return children.reduce((acc, node) => {
    (Object.keys(node) as Array<keyof MdastNode>).forEach(function (key) {
      if (key === 'children' || key === 'type' || key === 'text') return;

      acc[key] = node[key];
    });

    return acc;
  }, {});
}

function mdxToMark<T extends InputNodeTypes>(
  mark: keyof typeof MarkNodeTypes,
  children: DeserializedNode<T>[],
): MarkNode<T> {
  return {
    [MarkNodeTypes[mark] as string]: true,
    ...forceLeafNode(children as Array<TextNode>),
    ...persistLeafFormats(children as Array<MdastNode>),
  } as unknown as MarkNode<T>;
}

export default function deserialize<T extends InputNodeTypes>(node: MdastNode) {
  let children: Array<DeserializedNode<T>> = [{ text: '' }];

  const nodeChildren = node.children;
  if (nodeChildren && Array.isArray(nodeChildren) && nodeChildren.length > 0) {
    console.log('[DESERIALIZE][MAPPING CHILDREN] type', node);
    children = nodeChildren.flatMap((c: MdastNode) =>
      deserialize({
        ...c,
        ordered: node.ordered || false,
      }),
    );
  }

  console.log('[DESERIALIZE] type', node, children);

  switch (node.type) {
    case 'heading':
      return {
        type: NodeTypes.heading[node.depth || 1],
        children,
      } as HeadingNode<T>;
    case 'list':
      return {
        type: node.ordered ? NodeTypes.ol_list : NodeTypes.ul_list,
        children,
      } as ListNode<T>;
    case 'listItem':
      return { type: NodeTypes.listItem, children } as ListItemNode<T>;
    case 'paragraph':
      if ('ordered' in node) {
        return children;
      }
      return { type: NodeTypes.paragraph, children } as ParagraphNode<T>;
    case 'link':
      return {
        type: NodeTypes.link,
        url: node.url,
        children,
      } as LinkNode<T>;
    case 'image':
      return {
        type: NodeTypes.image,
        children: [{ text: '' }],
        url: node.url,
        caption: [{ text: node.alt ?? '' }],
      } as ImageNode<T>;
    case 'blockquote':
      return { type: NodeTypes.block_quote, children } as BlockQuoteNode<T>;
    case 'code':
      return {
        type: NodeTypes.code_block,
        lang: node.lang,
        children: (node.value ?? '').split('\n').map(line => ({
          type: NodeTypes.code_line,
          children: [{ text: line }],
        })),
      } as CodeBlockNode<T>;

    case 'html':
      if (node.value?.includes('<br>')) {
        return {
          break: true,
          type: NodeTypes.paragraph,
          children: [{ text: node.value?.replace(/<br>/g, '') || '' }],
        } as ParagraphNode<T>;
      }
      return { type: 'p', children: [{ text: node.value || '' }] };

    case 'emphasis':
      return {
        [NodeTypes.emphasis_mark]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      } as unknown as ItalicNode<T>;
    case 'strong':
      return {
        [NodeTypes.strong_mark]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      };
    case 'delete':
      return {
        [NodeTypes.delete_mark]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      };
    case 'inlineCode':
      return {
        [NodeTypes.inline_code_mark]: true,
        text: node.value,
        ...persistLeafFormats(children as Array<MdastNode>),
      };
    case 'thematicBreak':
      return {
        type: NodeTypes.thematic_break,
        children: [{ text: '' }],
      } as ThematicBreakNode<T>;

    case 'mdxJsxTextElement':
      if ('name' in node) {
        switch (node.name) {
          case 'sub':
            return mdxToMark('subscript_mark', children);
          case 'sup':
            return mdxToMark('superscript_mark', children);
          case 'u':
            return mdxToMark('underline_mark', children);
          case 'font':
            console.log('font node', node, children);
            const styleAttribute = node.attributes?.find(
              a => a.name === 'style',
            ) as StyleMdxMdastNodeAttribute;
            const nodeStyles: TextNodeStyles = {};
            if (styleAttribute) {
              let styles: Record<string, string> = {};
              try {
                styles =
                  JSON.parse(
                    styleAttribute.value.value
                      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ')
                      .replace(/:[ ]*[']([^']+)[']/g, ': "$1"'),
                  ) ?? {};
              } catch (e) {
                console.error(`Error parsing font styles (${styleAttribute.value.value})`, e);
              }

              Object.keys(styles).map(key => {
                if (allowedStyles.includes(key)) {
                  nodeStyles[key as keyof TextNodeStyles] = styles[key];
                }
              });
            }

            const colorAttribute = node.attributes?.find(
              a => a.name === 'color',
            ) as ColorMdxMdastNodeAttribute;
            if (colorAttribute) {
              nodeStyles.color = colorAttribute.value;
            }

            return {
              ...nodeStyles,
              ...forceLeafNode(children as Array<TextNode>),
              ...persistLeafFormats(children as Array<MdastNode>),
            } as TextNode;
            break;
          default:
            console.warn('unrecognized mdx node', node);
            break;
        }
      }

      return { text: node.value || '' };

    case 'text':
    case 'tableCell':
      return { text: node.value || '' };
    default:
      console.warn('Unrecognized mdast node, proceeding as text', node);
      return { text: node.value || '' };
  }
}
