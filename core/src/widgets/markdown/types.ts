export const SLATE_DEFAULT_BLOCK_TYPE = 'p' as const;
export const SLATE_BLOCK_PARENT_TYPES = ['list-item', 'quote'] as const;

export type SlateBlockParentType = typeof SLATE_BLOCK_PARENT_TYPES[number];
