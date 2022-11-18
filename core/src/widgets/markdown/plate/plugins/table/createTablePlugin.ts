import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TH, ELEMENT_TR } from '@udecode/plate';
import { createPluginFactory } from '@udecode/plate-core';

import { onKeyDownTable } from './onKeyDownTable';
import { insertTableColumn, insertTableRow } from './transforms/index';
import { withTable } from './withTable';

import type { PlateEditor } from '@udecode/plate';
import type { MdValue } from '../../plateTypes';
import type { TablePlugin } from './types';

/**
 * Enables support for tables.
 */
export const createTablePlugin = createPluginFactory<TablePlugin, MdValue, PlateEditor<MdValue>>({
  key: ELEMENT_TABLE,
  isElement: true,
  handlers: {
    onKeyDown: onKeyDownTable,
  },
  deserializeHtml: {
    rules: [{ validNodeName: 'TABLE' }],
  },
  options: {
    insertColumn: (e, { fromCell }) => {
      insertTableColumn(e, {
        fromCell,
        disableSelect: true,
      });
    },
    insertRow: (e, { fromRow }) => {
      insertTableRow(e, {
        fromRow,
        disableSelect: true,
      });
    },
  },
  withOverrides: withTable,
  plugins: [
    {
      key: ELEMENT_TR,
      isElement: true,
      deserializeHtml: {
        rules: [{ validNodeName: 'TR' }],
      },
    },
    {
      key: ELEMENT_TD,
      isElement: true,
      deserializeHtml: {
        attributeNames: ['rowspan', 'colspan'],
        rules: [{ validNodeName: 'TD' }],
      },
      props: ({ element }) => ({
        nodeProps: {
          colSpan: (element?.attributes as any)?.colspan,
          rowSpan: (element?.attributes as any)?.rowspan,
        },
      }),
    },
    {
      key: ELEMENT_TH,
      isElement: true,
      deserializeHtml: {
        attributeNames: ['rowspan', 'colspan'],
        rules: [{ validNodeName: 'TH' }],
      },
      props: ({ element }) => ({
        nodeProps: {
          colSpan: (element?.attributes as any)?.colspan,
          rowSpan: (element?.attributes as any)?.rowspan,
        },
      }),
    },
  ],
});
