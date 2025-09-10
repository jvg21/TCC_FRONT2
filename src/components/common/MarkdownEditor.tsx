import React from 'react';
import { Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import styled from 'styled-components';

// Importar estilos do ByteMD
import 'bytemd/dist/index.css';
import 'highlight.js/styles/default.css';

const EditorContainer = styled.div`
  .bytemd {
    height: 400px;
  }
  
  .bytemd-toolbar {
    border-bottom: 1px solid #e9ecef;
    background: #f8f9fa;
  }
  
  .bytemd-editor {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .bytemd-preview {
    padding: 16px;
    background: #fafafa;
  }

  .bytemd-fullscreen {
    z-index: 1100 !important;
  }
  
  .bytemd-fullscreen .bytemd {
    z-index: 1100 !important;
  }
  
  &:has(.bytemd-fullscreen) {
    z-index: 1100 !important;
    position: relative;
  }
`;
const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

const plugins = [
  gfm(),
  highlight(),
];

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = ""
}) => {
  return (
    <div>
      {label && <Label>{label} {required && '*'}</Label>}
      <EditorContainer>
        <Editor
          value={value}
          onChange={onChange}
          plugins={plugins}
          placeholder={placeholder}
        />
      </EditorContainer>
    </div>
  );
};