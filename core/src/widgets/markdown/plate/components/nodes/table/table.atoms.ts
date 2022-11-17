import { createAtomStore } from '@udecode/plate-core';
import { ELEMENT_TABLE } from '@udecode/plate-table';

import type { TElement } from '@udecode/plate-core';

export const { tableStore, useTableStore } = createAtomStore(
  {
    hoveredColIndex: null as number | null,
    selectedCells: null as TElement[] | null,
  },
  { name: 'table' as const, scope: ELEMENT_TABLE },
);
