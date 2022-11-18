import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { findNodePath, setNodes } from '@udecode/plate';
import { createElementAs } from '@udecode/plate-core';
import React, { useCallback, useState } from 'react';

import type { PlateRenderElementProps } from '@udecode/plate';
import type { TMediaElement } from '@udecode/plate-media';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import type { MdValue } from '../../../plateTypes';

const StyledPopoverContent = styled('div')`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
`;

const StyledPopoverEditingContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  width: 300px;
`;

const StyledFloatingVerticalDivider = styled('div')`
  width: 1px;
  height: 20px;
  background-color: rgba(229, 231, 235, 1);
`;

export const ImageElement = ({ element, editor }: PlateRenderElementProps<MdValue>) => {
  const { url, alt } = element;
  console.log('IMAGE_COMPONENT');

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [editing, setEditing] = useState(false);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setTimeout(() => {
      setEditing(false);
    }, 100);
  }, []);

  const handleEditStart = useCallback(() => {
    setEditing(true);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (event.key === 'Enter') {
        handleClose();
      }
    },
    [handleClose],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, key: string) => {
      const value = event.target.value;
      const path = findNodePath(editor, element);
      path && setNodes<TMediaElement>(editor, { [key]: value }, { at: path });
    },
    [editor, element],
  );

  const handleSourceChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleChange(event, 'src');
    },
    [handleChange],
  );

  const handleAltChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleChange(event, 'alt');
    },
    [handleChange],
  );

  const open = Boolean(anchorEl);
  const id = open ? 'edit-popover' : undefined;

  return (
    <>
      {createElementAs('img', {
        src: url,
        alt: (alt as string | undefined) ?? '',
        draggable: false,
        onClick: handleClick,
      })}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        elevation={16}
      >
        {!editing ? (
          <StyledPopoverContent key="edit-content">
            <Button
              size="small"
              color="inherit"
              component="div"
              sx={{ padding: '4px 8px', textTransform: 'none' }}
              onClick={handleEditStart}
            >
              Edit Image
            </Button>
            <StyledFloatingVerticalDivider />
            <Button size="small" color="inherit" sx={{ padding: '4px', minWidth: 'unset' }}>
              <DeleteForeverIcon />
            </Button>
          </StyledPopoverContent>
        ) : (
          <StyledPopoverEditingContent key="editing-content">
            <TextField
              id="src"
              label="Source"
              variant="standard"
              value={url}
              onKeyDown={handleKeyDown}
              onChange={handleSourceChange}
              fullWidth
            />
            <TextField
              id="alt"
              label="Alt"
              variant="standard"
              value={alt}
              onKeyDown={handleKeyDown}
              onChange={handleAltChange}
              fullWidth
            />
          </StyledPopoverEditingContent>
        )}
      </Popover>
    </>
  );
};
