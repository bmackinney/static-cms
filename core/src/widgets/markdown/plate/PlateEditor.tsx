import { styled } from '@mui/material/styles';
import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  createFontBackgroundColorPlugin,
  createFontColorPlugin,
  createHeadingPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createParagraphPlugin,
  createPlateUI,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_PARAGRAPH,
  Plate,
  PlateProvider,
} from '@udecode/plate';
import React, { useMemo, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import MarkBalloonToolbar from './components/balloon-toolbar/MarkBalloonToolbar';
import { CodeBlockElement } from './components/nodes/code-block';
import { Heading1 } from './components/nodes/headings/Heading1';
import { Heading2 } from './components/nodes/headings/Heading2';
import { Heading3 } from './components/nodes/headings/Heading3';
import { Heading4 } from './components/nodes/headings/Heading4';
import { Heading5 } from './components/nodes/headings/Heading5';
import { Heading6 } from './components/nodes/headings/Heading6';
import { TableCellElement, TableElement, TableRowElement } from './components/nodes/table';
import { Toolbar } from './components/toolbar/Toolbar';
import { ToolbarButtons } from './components/ToolbarButtons';
import { editableProps } from './editableProps';
import { createMdPlugins } from './plateTypes';
import { autoformatPlugin } from './plugins/autoformat/autoformatPlugin';
import { createCodeBlockPlugin } from './plugins/code-block/createCodeBlockPlugin';
import { CursorOverlayContainer } from './plugins/cursor-overlay/CursorOverlayContainer';
import { exitBreakPlugin } from './plugins/exit-break/exitBreakPlugin';
import { linkPlugin } from './plugins/link/linkPlugin';
import Paragraph from './plugins/paragraph/Paragraph';
import { resetBlockTypePlugin } from './plugins/reset-node/resetBlockTypePlugin';
import { softBreakPlugin } from './plugins/soft-break/softBreakPlugin';
import {
  createTablePlugin,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TH,
  ELEMENT_TR,
} from './plugins/table';
import { trailingBlockPlugin } from './plugins/trailing-block/trailingBlockPlugin';

import type { AutoformatPlugin } from '@udecode/plate';
import type { CSSProperties } from 'react';
import type { MdEditor, MdValue } from './plateTypes';

const StyledPlateEditor = styled('div')`
  position: relative;
  padding: 1.25rem;
`;

const components = createPlateUI({
  [ELEMENT_H1]: Heading1,
  [ELEMENT_H2]: Heading2,
  [ELEMENT_H3]: Heading3,
  [ELEMENT_H4]: Heading4,
  [ELEMENT_H5]: Heading5,
  [ELEMENT_H6]: Heading6,
  [ELEMENT_PARAGRAPH]: Paragraph,
  [ELEMENT_TABLE]: TableElement,
  [ELEMENT_TR]: TableRowElement,
  [ELEMENT_TH]: TableCellElement,
  [ELEMENT_TD]: TableCellElement,
  [ELEMENT_CODE_BLOCK]: CodeBlockElement,
});

const styles: Record<string, CSSProperties> = {
  container: { position: 'relative' },
};

interface PlateEditorProps {
  initialValue: MdValue;
  onChange: (value: MdValue) => void;
}

const PlateEditor = ({ initialValue, onChange }: PlateEditorProps) => {
  const containerRef = useRef(null);

  const plugins = useMemo(
    () =>
      createMdPlugins(
        [
          createParagraphPlugin(),
          createBlockquotePlugin(),
          // createTodoListPlugin(),
          createHeadingPlugin(),
          createImagePlugin(),
          // createHorizontalRulePlugin(),
          createLinkPlugin(linkPlugin),
          createListPlugin(),
          createTablePlugin(),
          // createMediaEmbedPlugin(),
          createCodeBlockPlugin(),
          // createAlignPlugin(alignPlugin),
          createBoldPlugin(),
          createCodePlugin(),
          createItalicPlugin(),
          // createHighlightPlugin(),
          createUnderlinePlugin(),
          createStrikethroughPlugin(),
          createSubscriptPlugin(),
          createSuperscriptPlugin(),
          createFontColorPlugin(),
          createFontBackgroundColorPlugin(),
          // createFontSizePlugin(),
          // createKbdPlugin(),
          // createNodeIdPlugin(),
          // createDndPlugin({ options: { enableScroller: true } }),
          // dragOverCursorPlugin,
          // createIndentPlugin(indentPlugin),
          createAutoformatPlugin<AutoformatPlugin<MdValue, MdEditor>, MdValue, MdEditor>(
            autoformatPlugin,
          ),
          createResetNodePlugin(resetBlockTypePlugin),
          createSoftBreakPlugin(softBreakPlugin),
          createExitBreakPlugin(exitBreakPlugin),
          createTrailingBlockPlugin(trailingBlockPlugin),
          // createSelectOnBackspacePlugin(selectOnBackspacePlugin),
          // createComboboxPlugin(),
          // createMentionPlugin(),
          // createDeserializeMdPlugin(),
          // createDeserializeCsvPlugin(),
          // createDeserializeDocxPlugin(),
          // createJuicePlugin() as MdPlatePlugin,
        ],
        {
          components,
        },
      ),
    [],
  );

  return (
    <StyledPlateEditor>
      <DndProvider backend={HTML5Backend}>
        <PlateProvider<MdValue> initialValue={initialValue} plugins={plugins} onChange={onChange}>
          <Toolbar>
            <ToolbarButtons />
          </Toolbar>

          <div ref={containerRef} style={styles.container}>
            <Plate editableProps={editableProps}>
              <MarkBalloonToolbar />
              <CursorOverlayContainer containerRef={containerRef} />
            </Plate>
          </div>
        </PlateProvider>
      </DndProvider>
    </StyledPlateEditor>
  );
};

export default PlateEditor;
