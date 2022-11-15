import { styled } from '@mui/material/styles';
import isEmpty from 'lodash/isEmpty';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import uuid from 'uuid';

import FieldLabel from '../../components/UI/FieldLabel';
import Outline from '../../components/UI/Outline';
import { IMAGE_EXTENSION_REGEX } from '../../constants/files';
import { doesUrlFileExist } from '../../lib/util/fetch.util';
import { isNotNullish } from '../../lib/util/null.util';
import { isNotEmpty } from '../../lib/util/string.util';
import useEditorOptions from './hooks/useEditorOptions';
import useMedia, { MediaHolder } from './hooks/useMedia';
import usePlugins from './hooks/usePlugins';
import useToolbarItems from './hooks/useToolbarItems';
import useMarkdownToSlate from './plate/hooks/useMarkdownToSlate';
import PlateEditor from './plate/PlateEditor';
import serialize from './plate/serialization/serializer';

import type { BlockType, LeafType } from 'remark-slate';
import type { MarkdownField, MediaLibrary, WidgetControlProps } from '../../interface';
import type { MdValue } from './plate/plateTypes';

const StyledEditorWrapper = styled('div')`
  position: relative;
  width: 100%;

  .toastui-editor-main .toastui-editor-md-vertical-style .toastui-editor {
    width: 100%;
  }

  .toastui-editor-main .toastui-editor-md-splitter {
    display: none;
  }

  .toastui-editor-md-preview {
    display: none;
  }

  .toastui-editor-defaultUI {
    border: none;
  }
`;

const MarkdownControl = ({
  label,
  value,
  onChange,
  hasErrors,
  field,
  openMediaLibrary,
  mediaPaths,
  getAsset,
  config,
}: WidgetControlProps<string, MarkdownField>) => {
  const [internalValue, setInternalValue] = useState(value ?? '');
  const [hasFocus, setHasFocus] = useState(false);

  const handleOnFocus = useCallback(() => {
    setHasFocus(true);
  }, []);

  const handleOnBlur = useCallback(() => {
    setHasFocus(false);
  }, []);

  const handleOnChange = useCallback(
    (slateValue: MdValue) => {
      const newValue = slateValue
        .map(v => {
          const response = serialize(v as BlockType | LeafType);
          console.log('[Plate] slate node to markdown', v.type, v, response);
          return response;
        })
        .join('\n');
      console.log('[Plate] slateValue', slateValue, 'newMarkdownValue', newValue);
      // const newValue = editorRef.current?.getInstance().getMarkdown() ?? '';
      if (newValue !== internalValue) {
        setInternalValue(newValue);
        onChange(newValue);
      }
    },
    [internalValue, onChange],
  );

  const handleLabelClick = useCallback(() => {
    // editorRef.current?.getInstance().focus();
  }, []);

  const controlID: string = useMemo(() => uuid(), []);
  const mediaLibraryFieldOptions: MediaLibrary = useMemo(
    () => field.media_library ?? {},
    [field.media_library],
  );
  const handleOpenMedialLibrary = useCallback(
    (forImage: boolean) => {
      openMediaLibrary({
        controlID,
        forImage,
        allowMultiple: false,
        field,
        config: 'config' in mediaLibraryFieldOptions ? mediaLibraryFieldOptions.config : undefined,
      });
    },
    [controlID, field, mediaLibraryFieldOptions, openMediaLibrary],
  );

  const getMedia = useCallback(
    async (path: string) => {
      const { type, exists } = await doesUrlFileExist(path);
      if (!exists) {
        const asset = await getAsset(path, field);
        if (isNotNullish(asset)) {
          return {
            type: IMAGE_EXTENSION_REGEX.test(path) ? 'image' : 'file',
            exists: false,
            url: asset.toString(),
          };
        }
      }

      return { url: path, type, exists };
    },
    [field, getAsset],
  );

  const mediaPath = mediaPaths[controlID];
  useEffect(() => {
    if (isEmpty(mediaPath) || Array.isArray(mediaPath)) {
      return;
    }

    const addMedia = async () => {
      const { type } = await getMedia(mediaPath);
      let content: string | undefined;
      const name = mediaPath.split('/').pop();
      if (type.startsWith('image')) {
        content = `![${name}](${mediaPath})`;
      } else {
        content = `[${name}](${mediaPath})`;
      }

      if (isNotEmpty(content)) {
        // const editorInstance = editorRef.current?.getInstance();
        // if (!editorInstance) {
        //   return;
        // }
        // editorInstance.focus();
        // const isOnMarkdown = editorInstance.isMarkdownMode();
        // if (!isOnMarkdown) {
        //   editorInstance.changeMode('markdown');
        // }
        // editorInstance.insertText(content);
        // if (!isOnMarkdown) {
        //   editorInstance.changeMode('wysiwyg');
        // }
        // setTimeout(() => {
        //   handleOnChange();
        // });
      }
    };

    addMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaPath]);

  const { initialEditType, height, ...markdownEditorOptions } = useEditorOptions();

  const media = useMedia({ value, getAsset, field });
  const mediaHolder = useMemo(() => new MediaHolder(), []);

  useEffect(() => {
    mediaHolder.setBulkMedia(media);
    // editorRef.current?.getInstance().setMarkdown(internalValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  const plugins = usePlugins(markdownEditorOptions.plugins, {
    media: mediaHolder,
    config,
    field,
    mode: 'editor',
  });
  const toolbarItems = useToolbarItems(markdownEditorOptions.toolbarItems, handleOpenMedialLibrary);

  const [slateValue, loaded] = useMarkdownToSlate(internalValue);

  console.log('[Plate] slateValue', slateValue);

  return useMemo(
    () => (
      <StyledEditorWrapper key="markdown-control-wrapper">
        <FieldLabel
          key="markdown-control-label"
          isActive={hasFocus}
          hasErrors={hasErrors}
          onClick={handleLabelClick}
        >
          {label}
        </FieldLabel>
        {loaded ? <PlateEditor initialValue={slateValue} onChange={handleOnChange} /> : null}
        <Outline key="markdown-control-outline" hasLabel hasError={hasErrors} />
      </StyledEditorWrapper>
    ),
    [handleLabelClick, handleOnChange, hasErrors, hasFocus, label, loaded, slateValue],
  );
};

export default MarkdownControl;
