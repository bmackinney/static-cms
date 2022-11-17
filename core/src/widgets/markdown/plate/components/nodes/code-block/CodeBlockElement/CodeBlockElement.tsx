import { styled } from '@mui/material/styles';
import { findNodePath, setNodes } from '@udecode/plate';
import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import CodeMirror from '@uiw/react-codemirror';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

import Outline from '../../../../../../components/UI/Outline';

import type { PlateRenderElementProps, TCodeBlockElement } from '@udecode/plate';
import type { MdValue } from '../../../plateTypes';
import type { LanguageName } from '@uiw/codemirror-extensions-langs';

const StyledCodeBlock = styled('div')`
  position: relative;
  margin: 12px 0;
  overflow: hidden;
`;

const StyledInputLabel = styled('label')`
  padding: 4px;
  font-weight: 600;
  border: 1px solid rgba(0, 0, 0, 0.35);
`;

const StyledInput = styled('input')`
  flex-grow: 1;
  outline: none;
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 4px 4px 0 0;
  width: 100%;
`;

const StyledCodeBlockContent = styled('div')`
  position: relative;

  & div {
    outline: none;
  }
`;

export const CodeBlockElement = (props: PlateRenderElementProps<MdValue>) => {
  const [langHasFocus, setLangHasFocus] = useState(false);
  const [codeHasFocus, setCodeHasFocus] = useState(false);

  const { attributes, nodeProps, element, editor } = props;
  const id = useMemo(() => uuid(), []);

  const lang = ('lang' in element ? element.lang : '') as string | undefined;
  const code = ('code' in element ? element.code : '') as string | undefined;

  const loadedLangExtension = useMemo(() => {
    if (!lang) {
      return null;
    }
    return loadLanguage(lang as LanguageName);
  }, [lang]);

  console.log('CODE_BLOCK!!! lang', lang, 'code', code);

  const extensions = useMemo(() => {
    const coreExtensions = [basicSetup, keymap.of([indentWithTab])];

    if (!loadedLangExtension) {
      return coreExtensions;
    }

    return [...coreExtensions, loadedLangExtension];
  }, [loadedLangExtension]);

  return (
    <>
      <StyledCodeBlock {...attributes} {...nodeProps} contentEditable={false}>
        <StyledInput
          id={id}
          value={lang}
          onFocus={() => setLangHasFocus(true)}
          onBlur={() => setLangHasFocus(false)}
          onChange={event => {
            const value = event.target.value;
            const path = findNodePath(editor, element);
            path && setNodes<TCodeBlockElement>(editor, { lang: value }, { at: path });
          }}
        />
        <StyledCodeBlockContent
          data-slate-editor="true"
          contentEditable="true"
          suppressContentEditableWarning={true}
        >
          <CodeMirror
            value={code}
            height="auto"
            editable={true}
            onInput={event => {
              console.log('hello!');
              event?.stopPropagation();
            }}
            onFocus={() => setCodeHasFocus(true)}
            onBlur={() => setCodeHasFocus(false)}
            onChange={value => {
              console.log('CODE_BLOCK!!! newValue => ', value);
              const path = findNodePath(editor, element);
              path && setNodes<TCodeBlockElement>(editor, { code: value }, { at: path });
            }}
            extensions={extensions}
          />
        </StyledCodeBlockContent>
        <Outline active={langHasFocus || codeHasFocus} />
      </StyledCodeBlock>
    </>
  );
};
