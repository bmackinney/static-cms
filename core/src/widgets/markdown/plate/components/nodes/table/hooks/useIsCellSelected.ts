import { useMemo } from 'react';

import { useTableStore } from '../table.atoms';

import type { TElement } from '@udecode/plate-core';

export const useIsCellSelected = (element: TElement) => {
  const selectedCells = useTableStore().get.selectedCells();

  return useMemo(() => selectedCells?.includes(element), [
    element,
    selectedCells,
  ]);
};
