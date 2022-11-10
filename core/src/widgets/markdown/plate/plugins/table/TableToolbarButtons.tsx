import BorderAllIcon from '@mui/icons-material/BorderAll';
import BorderBottomIcon from '@mui/icons-material/BorderBottom';
import BorderClearIcon from '@mui/icons-material/BorderClear';
import BorderLeftIcon from '@mui/icons-material/BorderLeft';
import BorderRightIcon from '@mui/icons-material/BorderRight';
import BorderTopIcon from '@mui/icons-material/BorderTop';
import {
  deleteColumn,
  deleteRow,
  deleteTable,
  insertTable,
  insertTableColumn,
  insertTableRow,
  TableToolbarButton
} from '@udecode/plate';
import React from 'react';

export const TableToolbarButtons = () => (
  <>
    <TableToolbarButton icon={<BorderAllIcon />} transform={insertTable} />
    <TableToolbarButton icon={<BorderClearIcon />} transform={deleteTable} />
    <TableToolbarButton icon={<BorderBottomIcon />} transform={insertTableRow} />
    <TableToolbarButton icon={<BorderTopIcon />} transform={deleteRow} />
    <TableToolbarButton icon={<BorderLeftIcon />} transform={insertTableColumn} />
    <TableToolbarButton icon={<BorderRightIcon />} transform={deleteColumn} />
  </>
);
