import CheckIcon from '@mui/icons-material/Check';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import ImageIcon from '@mui/icons-material/Image';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import LinkIcon from '@mui/icons-material/Link';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import {
  ColorPickerToolbarDropdown,
  ImageToolbarButton,
  LineHeightToolbarDropdown,
  LinkToolbarButton,
  MARK_BG_COLOR,
  MARK_COLOR,
  MediaEmbedToolbarButton,
} from '@udecode/plate';
import React from 'react';

import { AlignToolbarButtons } from '../plugins/align/AlignToolbarButtons';
import { IndentToolbarButtons } from '../plugins/indent/IndentToolbarButtons';
import { ListToolbarButtons } from '../plugins/list/ListToolbarButtons';
import { TableToolbarButtons } from '../plugins/table/TableToolbarButtons';
import { BasicElementToolbarButtons } from './BasicElementToolbarButtons';
import { BasicMarkToolbarButtons } from './BasicMarkToolbarButtons';

import type { TippyProps } from '@tippyjs/react';

export const ToolbarButtons = () => {
  const colorTooltip: TippyProps = { content: 'Text color' };
  const bgTooltip: TippyProps = { content: 'Text color' };

  return (
    <>
      <BasicElementToolbarButtons />
      <ListToolbarButtons />
      <IndentToolbarButtons />
      <BasicMarkToolbarButtons />
      <ColorPickerToolbarDropdown
        pluginKey={MARK_COLOR}
        icon={<FormatColorTextIcon />}
        selectedIcon={<CheckIcon />}
        tooltip={colorTooltip}
      />
      <ColorPickerToolbarDropdown
        pluginKey={MARK_BG_COLOR}
        icon={<FontDownloadIcon />}
        selectedIcon={<CheckIcon />}
        tooltip={bgTooltip}
      />
      <LineHeightToolbarDropdown icon={<LineWeightIcon />} />
      <AlignToolbarButtons />
      <LinkToolbarButton icon={<LinkIcon />} />
      <ImageToolbarButton icon={<ImageIcon />} />
      <MediaEmbedToolbarButton icon={<OndemandVideoIcon />} />
      <TableToolbarButtons />
    </>
  );
};
