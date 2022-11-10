import React from 'react';
import { CursorOverlay } from '@udecode/plate';

import { cursorStore } from './cursorStore';

import type { CursorOverlayProps } from '@udecode/plate';

export const CursorOverlayContainer = ({ cursors, ...props }: CursorOverlayProps) => {
  const dynamicCursors = cursorStore.use.cursors();

  const allCursors = { ...cursors, ...dynamicCursors };

  return <CursorOverlay {...props} cursors={allCursors} />;
};
