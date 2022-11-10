import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import Looks6Icon from '@mui/icons-material/Looks6';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import {
  BlockToolbarButton,
  CodeBlockToolbarButton,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  getPluginType,
  useEventPlateId,
} from '@udecode/plate';

import { useMdPlateEditorRef } from '../plateTypes';

export const BasicElementToolbarButtons = () => {
  const editor = useMdPlateEditorRef(useEventPlateId());

  return (
    <>
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H1)} icon={<LooksOneIcon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H2)} icon={<LooksTwoIcon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H3)} icon={<Looks3Icon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H4)} icon={<Looks4Icon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H5)} icon={<Looks5Icon />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H6)} icon={<Looks6Icon />} />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuoteIcon />}
      />
      <CodeBlockToolbarButton
        type={getPluginType(editor, ELEMENT_CODE_BLOCK)}
        icon={<CodeIcon />}
      />
    </>
  );
};
