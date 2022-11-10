import React from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import {
  BalloonToolbar,
  getPluginType,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MarkToolbarButton,
} from '@udecode/plate';

import { useMdPlateEditorRef } from '../../plateTypes';

import type { TippyProps } from '@tippyjs/react';

const MarkBalloonToolbar = () => {
  const editor = useMdPlateEditorRef();

  const arrow = false;
  const theme = 'dark';
  const tooltip: TippyProps = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    offset: [0, 17],
    placement: 'top',
  };

  const boldTooltip: TippyProps = { content: 'Bold (⌘B)', ...tooltip };
  const italicTooltip: TippyProps = { content: 'Italic (⌘I)', ...tooltip };
  const underlineTooltip: TippyProps = {
    content: 'Underline (⌘U)',
    ...tooltip,
  };

  return (
    <BalloonToolbar theme={theme} arrow={arrow}>
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<FormatBoldIcon />}
        tooltip={boldTooltip}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<FormatItalicIcon />}
        tooltip={italicTooltip}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<FormatUnderlinedIcon />}
        tooltip={underlineTooltip}
      />
    </BalloonToolbar>
  );
};

export default MarkBalloonToolbar;
