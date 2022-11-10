import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { ELEMENT_OL, ELEMENT_UL, getPluginType, ListToolbarButton } from '@udecode/plate';
import React from 'react';

import { useMdPlateEditorRef } from '../../plateTypes';

export const ListToolbarButtons = () => {
  const editor = useMdPlateEditorRef();

  return (
    <>
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_UL)}
        icon={<FormatListBulletedIcon />}
      />
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_OL)}
        icon={<FormatListNumberedIcon />}
      />
    </>
  );
};
