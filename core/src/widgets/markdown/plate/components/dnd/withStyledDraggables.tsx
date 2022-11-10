import React from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Tippy from '@tippyjs/react';
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_OL,
  ELEMENT_TABLE,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  withDraggables,
} from '@udecode/plate';

import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '../../plugins/heading/constants';
import { ELEMENT_PARAGRAPH } from '../../plugins/paragraph/createParagraphPlugin';

import type { createPlateUI } from '@udecode/plate';
import type { TippyProps } from '@tippyjs/react';

const styles = {
  grabber: { fontSize: 12 },
  grabberText: { color: 'rgba(255, 255, 255, 0.45)' },
  dragButton: {
    width: 18,
    height: 18,
    color: 'rgba(55, 53, 47, 0.3)',
  },
};

const GrabberTooltipContent = () => (
  <div style={styles.grabber}>
    <div>
      Drag <span style={styles.grabberText}>to move</span>
    </div>
  </div>
);

export const grabberTooltipProps: TippyProps = {
  content: <GrabberTooltipContent />,
  placement: 'bottom',
  arrow: false,
  offset: [0, 0],
  delay: [300, 0],
  duration: [0, 0],
  hideOnClick: true,
  theme: 'small',
};

export const withStyledDraggables = (components: ReturnType<typeof createPlateUI>) => {
  return withDraggables(components, [
    {
      keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
      level: 0,
    },
    {
      keys: [
        ELEMENT_PARAGRAPH,
        ELEMENT_BLOCKQUOTE,
        ELEMENT_TODO_LI,
        ELEMENT_H1,
        ELEMENT_H2,
        ELEMENT_H3,
        ELEMENT_H4,
        ELEMENT_H5,
        ELEMENT_H6,
        ELEMENT_IMAGE,
        ELEMENT_OL,
        ELEMENT_UL,
        ELEMENT_TABLE,
        ELEMENT_MEDIA_EMBED,
        ELEMENT_CODE_BLOCK,
      ],
      onRenderDragHandle: () => {
        return (
          <Tippy {...grabberTooltipProps}>
            <button type="button" className="drag-button">
              <DragIndicatorIcon style={styles.dragButton} />
            </button>
          </Tippy>
        );
      },
    },
    {
      key: ELEMENT_H1,
      styles: {
        gutterLeft: {
          padding: '2em 0 4px',
          fontSize: '1.875em',
        },
        blockToolbarWrapper: {
          height: '1.3em',
        },
      },
    },
    {
      key: ELEMENT_H2,
      styles: {
        gutterLeft: {
          padding: '1.4em 0 1px',
          fontSize: '1.5em',
        },
        blockToolbarWrapper: {
          height: '1.3em',
        },
      },
    },
    {
      key: ELEMENT_H3,
      styles: {
        gutterLeft: {
          padding: '1em 0 1px',
          fontSize: '1.25em',
        },
        blockToolbarWrapper: {
          height: '1.3em',
        },
      },
    },
    {
      keys: [ELEMENT_H4, ELEMENT_H5, ELEMENT_H6],
      styles: {
        gutterLeft: {
          padding: '0.75em 0 0',
          fontSize: '1.1em',
        },
        blockToolbarWrapper: {
          height: '1.3em',
        },
      },
    },
    {
      keys: [ELEMENT_PARAGRAPH, ELEMENT_UL, ELEMENT_OL],
      styles: {
        gutterLeft: {
          padding: '4px 0 0',
        },
      },
    },
    {
      key: ELEMENT_BLOCKQUOTE,
      styles: {
        gutterLeft: {
          padding: '18px 0 0',
        },
      },
    },
    {
      key: ELEMENT_CODE_BLOCK,
      styles: {
        gutterLeft: {
          padding: '12px 0 0',
        },
      },
    },
  ]);
};
