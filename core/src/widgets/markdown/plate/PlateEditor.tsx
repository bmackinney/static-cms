import React, { useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createComboboxPlugin,
  createDeserializeCsvPlugin,
  createDeserializeDocxPlugin,
  createDeserializeMdPlugin,
  createDndPlugin,
  createExitBreakPlugin,
  createFontBackgroundColorPlugin,
  createFontColorPlugin,
  createFontSizePlugin,
  createHeadingPlugin,
  createHighlightPlugin,
  createHorizontalRulePlugin,
  createImagePlugin,
  createIndentPlugin,
  createItalicPlugin,
  createKbdPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createMentionPlugin,
  createNodeIdPlugin,
  createNormalizeTypesPlugin,
  createParagraphPlugin,
  createPlateUI,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  MentionCombobox,
  Plate,
  PlateProvider,
} from '@udecode/plate';
import { createJuicePlugin } from '@udecode/plate-juice';
import { createBlockSelectionPlugin } from '@udecode/plate-selection';

import { createMdPlugins } from './plateTypes';
import { alignPlugin } from './plugins/align/alignPlugin';
import { autoformatPlugin } from './plugins/autoformat/autoformatPlugin';
// import { MarkBalloonToolbar } from './balloon-toolbar/MarkBalloonToolbar';
import { editableProps } from './editableProps';
// import { CursorOverlayContainer } from './cursor-overlay/CursorOverlayContainer';
import { dragOverCursorPlugin } from './plugins/cursor-overlay/dragOverCursorPlugin';
import { withStyledDraggables } from './components/dnd/withStyledDraggables';
import { exitBreakPlugin } from './plugins/exit-break/exitBreakPlugin';
import { forcedLayoutPlugin } from './plugins/forced-layout/forcedLayoutPlugin';
import { indentPlugin } from './plugins/indent/indentPlugin';
import { linkPlugin } from './plugins/link/linkPlugin';
import { resetBlockTypePlugin } from './plugins/reset-node/resetBlockTypePlugin';
import { selectOnBackspacePlugin } from './plugins/select-on-backspace/selectOnBackspacePlugin';
import { softBreakPlugin } from './plugins/soft-break/softBreakPlugin';
// import { Toolbar } from './toolbar/Toolbar';
import { trailingBlockPlugin } from './plugins/trailing-block/trailingBlockPlugin';
// import { playgroundValue } from './playgroundValue';
import { ToolbarButtons } from './ToolbarButtons';

import type { CSSProperties } from 'react';
import type { AutoformatPlugin } from '@udecode/plate';
import type { MdEditor, MdPlatePlugin, MdValue } from './plateTypes';

const components = createPlateUI({
  // customize your components by plugin key
});

const styles: Record<string, CSSProperties> = {
  container: { position: 'relative' },
};

interface PlateEditorProps {
  value: string;
}

const PlateEditor = ({ initialValue }: PlateEditorProps) => {
  const containerRef = useRef(null);
  const [internalValue, setInternalValue] = useState<MdValue>([]);

  unified()
  .use(markdown)
  .use(slate)
  .process(fs.readFileSync('example.md'), (err, file) => {
    if (err) throw err;
    console.log({ file });
  });

  const plugins = useMemo(
    () =>
      createMdPlugins(
        [
          createParagraphPlugin(),
          createBlockquotePlugin(),
          createTodoListPlugin(),
          createHeadingPlugin(),
          createImagePlugin(),
          createHorizontalRulePlugin(),
          createLinkPlugin(linkPlugin),
          createListPlugin(),
          createTablePlugin(),
          createMediaEmbedPlugin(),
          createCodeBlockPlugin(),
          createAlignPlugin(alignPlugin),
          createBoldPlugin(),
          createCodePlugin(),
          createItalicPlugin(),
          createHighlightPlugin(),
          createUnderlinePlugin(),
          createStrikethroughPlugin(),
          createSubscriptPlugin(),
          createSuperscriptPlugin(),
          createFontColorPlugin(),
          createFontBackgroundColorPlugin(),
          createFontSizePlugin(),
          createKbdPlugin(),
          createNodeIdPlugin(),
          createBlockSelectionPlugin(),
          createDndPlugin({ options: { enableScroller: true } }),
          dragOverCursorPlugin,
          createIndentPlugin(indentPlugin),
          createAutoformatPlugin<AutoformatPlugin<MdValue, MdEditor>, MdValue, MdEditor>(
            autoformatPlugin,
          ),
          createResetNodePlugin(resetBlockTypePlugin),
          createSoftBreakPlugin(softBreakPlugin),
          createExitBreakPlugin(exitBreakPlugin),
          createNormalizeTypesPlugin(forcedLayoutPlugin),
          createTrailingBlockPlugin(trailingBlockPlugin),
          createSelectOnBackspacePlugin(selectOnBackspacePlugin),
          createComboboxPlugin(),
          createMentionPlugin(),
          createDeserializeMdPlugin(),
          createDeserializeCsvPlugin(),
          createDeserializeDocxPlugin(),
          createJuicePlugin() as MdPlatePlugin,
        ],
        {
          components: withStyledDraggables(components),
        },
      ),
    [],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <PlateProvider<MdValue> initialValue={initialValue} plugins={plugins}>
        <Toolbar>
          <ToolbarButtons />
        </Toolbar>

        <div ref={containerRef} style={styles.container}>
          <Plate editableProps={editableProps}>
            <MarkBalloonToolbar />

            <MentionCombobox items={MENTIONABLES} />

            <CursorOverlayContainer containerRef={containerRef} />
          </Plate>
        </div>
      </PlateProvider>
    </DndProvider>
  );
};

export default PlateEditor;
