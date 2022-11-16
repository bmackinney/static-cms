import React from 'react';

import { useSelectedCells } from '../hooks/useSelectedCells';
import { useTableStore } from '../table.atoms';

import type { PlateRenderElementProps } from '@udecode/plate';
import type { MdValue } from '../../../../plateTypes';

export const TableElement = ({ ...props }: PlateRenderElementProps<MdValue>) => {
  const { attributes, children, nodeProps, element } = props;

  const selectedCells = useTableStore().get.selectedCells();

  useSelectedCells();

  return (
    <table {...attributes} {...nodeProps}>
      <tbody>{children}</tbody>
    </table>
  );
};
