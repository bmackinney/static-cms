import React, { useEffect, useMemo, useRef } from 'react';

import WidgetPreviewContainer from '../../components/UI/WidgetPreviewContainer';
import useEditorOptions from './hooks/useEditorOptions';
import useMedia, { MediaHolder } from './hooks/useMedia';
import usePlugins from './hooks/usePlugins';

import type { MarkdownField, WidgetPreviewProps } from '../../interface';

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

  return useMemo(() => {
    if (!value) {
      return null;
    }

    return <WidgetPreviewContainer>{value}</WidgetPreviewContainer>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugins]);
};

export default MarkdownPreview;
