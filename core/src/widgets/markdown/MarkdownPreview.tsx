import { MDXProvider } from '@mdx-js/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { VFileMessage } from 'vfile-message';

import WidgetPreviewContainer from '../../components/UI/WidgetPreviewContainer';
import useEditorOptions from './hooks/useEditorOptions';
import useMedia, { MediaHolder } from './hooks/useMedia';
import usePlugins from './hooks/usePlugins';
import useMdx from './plate/hooks/useMdx';

import type { FC } from 'react';
import type { MarkdownField, WidgetPreviewProps } from '../../interface';

interface FallbackComponentProps {
  error: string;
}

function FallbackComponent({ error }: FallbackComponentProps) {
  const message = new VFileMessage(error);
  message.fatal = true;
  return (
    <pre>
      <code>{String(message)}</code>
    </pre>
  );
}

const MarkdownPreview = ({
  value,
  getAsset,
  config,
  field,
}: WidgetPreviewProps<string, MarkdownField>) => {
  const options = useEditorOptions();

  const mediaHolder = useMemo(() => new MediaHolder(), []);
  const media = useMedia({ value, getAsset, field });

  useEffect(() => {
    // viewer.current?.getInstance().setMarkdown(value ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    mediaHolder.setBulkMedia(media);
    // viewer.current?.getInstance().setMarkdown(value ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  const plugins = usePlugins(options.plugins, {
    config,
    media: mediaHolder,
    field,
    mode: 'preview',
  });

  const [state, setValue] = useMdx(value ?? '');
  const [prevValue, setPrevValue] = useState(value);
  useEffect(() => {
    console.log('PREVIEW', value)
    if (prevValue !== value) {
      setPrevValue(value ?? '');
      setValue(value ?? '');
    }
  }, [prevValue, setValue, value]);

  // Create a preview component that can handle errors with try-catch block; for catching invalid JS expressions errors that ErrorBoundary cannot catch.
  const MdxComponent = useCallback(() => {
    if (!state.file) {
      return null;
    }

    try {
      return (state.file.result as FC)({});
    } catch (error) {
      return <FallbackComponent error={String(error)} />;
    }
  }, [state.file]);

  const components = useMemo(() => ({}), []);

  return useMemo(() => {
    if (!value) {
      return null;
    }

    return (
      <WidgetPreviewContainer>
        {state.file && state.file.result ? (
          <MDXProvider components={components}>
            <MdxComponent />
          </MDXProvider>
        ) : null}
      </WidgetPreviewContainer>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugins, MdxComponent]);
};

export default MarkdownPreview;
