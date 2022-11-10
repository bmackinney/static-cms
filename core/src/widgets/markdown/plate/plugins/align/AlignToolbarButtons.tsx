import React from 'react';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { AlignToolbarButton } from '@udecode/plate';

export const AlignToolbarButtons = () => {
  return (
    <>
      <AlignToolbarButton value="left" icon={<FormatAlignLeftIcon />} />
      <AlignToolbarButton value="center" icon={<FormatAlignCenterIcon />} />
      <AlignToolbarButton value="right" icon={<FormatAlignRightIcon />} />
      <AlignToolbarButton value="justify" icon={<FormatAlignJustifyIcon />} />
    </>
  );
};
