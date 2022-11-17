export const MarkNodeTypes = {
  superscript_mark: 'superscript',
  subscript_mark: 'subscript',
  underline_mark: 'underline',
} as const;

export const NodeTypes = {
  paragraph: 'p',
  block_quote: 'blockquote',
  code_block: 'code_block',
  code_line: 'code_line',
  code_syntax: 'code_syntax',
  link: 'a',
  ul_list: 'ul',
  ol_list: 'ol',
  listItem: 'li',
  listItemChild: 'lic',
  table: 'table',
  tableRow: 'tr',
  tableCell: 'td',
  heading: {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  },
  emphasis_mark: 'italic',
  strong_mark: 'bold',
  delete_mark: 'strikethrough',
  inline_code_mark: 'code',
  thematic_break: 'thematic_break',
  image: 'img',
  ...MarkNodeTypes,
} as const;

export type MdastNodeType =
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'listItem'
  | 'link'
  | 'image'
  | 'blockquote'
  | 'code'
  | 'html'
  | 'emphasis'
  | 'strong'
  | 'delete'
  | 'inlineCode'
  | 'thematicBreak'
  | 'text'
  | 'mdxJsxTextElement';

export interface LeafType {
  text: string;
  strikeThrough?: boolean;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  parentType?: string;
}

export interface BlockType {
  type: string;
  parentType?: string;
  link?: string;
  caption?: string;
  language?: string;
  break?: boolean;
  children: Array<BlockType | LeafType>;
}

export type MdastNode = BaseMdastNode | MdxMdastNode;

export interface BaseMdastNode {
  type?: Omit<MdastNodeType, 'mdxJsxTextElement'>;
  ordered?: boolean;
  value?: string;
  text?: string;
  children?: Array<MdastNode>;
  depth?: 1 | 2 | 3 | 4 | 5 | 6;
  url?: string;
  alt?: string;
  lang?: string;
  // mdast metadata
  position?: any;
  spread?: any;
  checked?: any;
  indent?: any;
}

export interface MdxMdastNodeAttributeValue {
  type: 'mdxJsxAttributeValueExpression';
  value: string;
}

export interface StyleMdxMdastNodeAttribute {
  name: 'style';
  type: 'mdxJsxAttribute';
  value: MdxMdastNodeAttributeValue;
}

export interface ColorMdxMdastNodeAttribute {
  name: 'color';
  type: 'mdxJsxAttribute';
  value: string;
}

export type MdxMdastNodeAttribute = StyleMdxMdastNodeAttribute | ColorMdxMdastNodeAttribute;

export interface MdxMdastNode extends BaseMdastNode {
  type: 'mdxJsxTextElement';
  name: string;
  attributes?: MdxMdastNodeAttribute[];
}

export const allowedStyles: string[] = ['color', 'backgroundColor'];

export interface TextNodeStyles {
  color?: string;
  backgroundColor?: string;
}

export type TextNode = { text?: string | undefined } & TextNodeStyles;

export type CodeLineNode = {
  type: typeof NodeTypes['code_line'];
  children: Array<TextNode>;
};

export type CodeBlockNode = {
  type: typeof NodeTypes['code_block'];
  lang: string | undefined;
  code: string;
};

export type HeadingNode = {
  type:
    | typeof NodeTypes['heading'][1]
    | typeof NodeTypes['heading'][2]
    | typeof NodeTypes['heading'][3]
    | typeof NodeTypes['heading'][4]
    | typeof NodeTypes['heading'][5]
    | typeof NodeTypes['heading'][6];
  children: Array<DeserializedNode>;
};

export type ListNode = {
  type: typeof NodeTypes['ol_list'] | typeof NodeTypes['ul_list'];
  children: Array<DeserializedNode>;
};

export type ListItemNode = {
  type: typeof NodeTypes['listItem'];
  children: Array<DeserializedNode>;
};

export type ParagraphNode = {
  type: typeof NodeTypes['paragraph'];
  break?: true;
  children: Array<DeserializedNode>;
};

export type LinkNode = {
  type: typeof NodeTypes['link'];
  children: Array<DeserializedNode>;
  url: string | undefined;
};

export type ImageNode = {
  type: typeof NodeTypes['image'];
  children: Array<DeserializedNode>;
  url: string | undefined;
  caption: TextNode;
};

export type TableNode = {
  type: typeof NodeTypes['table'];
  children: Array<TableRowNode>;
};

export type TableRowNode = {
  type: typeof NodeTypes['tableRow'];
  children: Array<TableCellNode>;
};

export type TableCellNode = {
  type: typeof NodeTypes['tableCell'];
  children: Array<DeserializedNode>;
};

export type BlockQuoteNode = {
  type: typeof NodeTypes['block_quote'];
  children: Array<DeserializedNode>;
};

export type InlineCodeMarkNode = {
  type: typeof NodeTypes['inline_code_mark'];
  children: Array<TextNode>;
  language: string | undefined;
};

export type ThematicBreakNode = {
  type: typeof NodeTypes['thematic_break'];
  children: Array<DeserializedNode>;
};

export type ItalicNode = {
  [K in typeof NodeTypes['emphasis_mark']]: true;
} & {
  children: TextNode;
};

export type MarkNode =
  | SuperscriptNode
  | SubscriptNode
  | UnderlineNode
  | BoldNode
  | StrikeThoughNode
  | InlineCodeNode;

export type SuperscriptNode = {
  [K in typeof NodeTypes['superscript_mark']]: true;
} & {
  children: TextNode;
};

export type SubscriptNode = {
  [K in typeof NodeTypes['subscript_mark']]: true;
} & {
  children: TextNode;
};

export type UnderlineNode = {
  [K in typeof NodeTypes['underline_mark']]: true;
} & {
  children: TextNode;
};

export type BoldNode = {
  bold: true;
  children: TextNode;
};

export type StrikeThoughNode = {
  strikeThrough: true;
  children: TextNode;
};

export type InlineCodeNode = {
  code: true;
  text: string | undefined;
};

export type DeserializedNode =
  | CodeBlockNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | ParagraphNode
  | LinkNode
  | ImageNode
  | BlockQuoteNode
  | InlineCodeMarkNode
  | ThematicBreakNode
  | ItalicNode
  | TextNode
  | MarkNode;
