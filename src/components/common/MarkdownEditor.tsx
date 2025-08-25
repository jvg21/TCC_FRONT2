import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: ${({ theme }) => theme.borderRadius};
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  flex-wrap: wrap;
  background: #f8f9fa;
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  background: ${({ $active }) => $active ? '#e3f2fd' : 'transparent'};
  color: ${({ $active }) => $active ? '#1976d2' : '#333'};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => $active ? '#e3f2fd' : '#e9ecef'};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ToolbarSeparator = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(0,0,0,0.1);
  margin: 0 4px;
`;

const EditorWrapper = styled.div`
  display: flex;
  min-height: 300px;
`;

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  background: white;

  &::placeholder {
    color: #999;
  }
`;

const PreviewPane = styled.div<{ $visible: boolean }>`
  flex: 1;
  padding: 16px;
  border-left: ${({ $visible }) => $visible ? '1px solid rgba(0,0,0,0.08)' : 'none'};
  display: ${({ $visible }) => $visible ? 'block' : 'none'};
  background: #fafafa;
  overflow-y: auto;

  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 16px 0;
    color: #333;
  }

  h1 { font-size: 28px; font-weight: 700; }
  h2 { font-size: 24px; font-weight: 600; }
  h3 { font-size: 20px; font-weight: 600; }

  p {
    margin: 0 0 16px 0;
    line-height: 1.6;
  }

  strong {
    font-weight: 600;
    color: #333;
  }

  em {
    font-style: italic;
    color: #555;
  }

  ul, ol {
    margin: 0 0 16px 20px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.5;
    }
  }

  blockquote {
    border-left: 4px solid #e3f2fd;
    background: #f8f9fa;
    padding: 12px 16px;
    margin: 0 0 16px 0;
    font-style: italic;
    color: #555;
  }

  code {
    background: #f1f3f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    color: #d63384;
  }

  pre {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 12px;
    margin: 0 0 16px 0;
    overflow-x: auto;

    code {
      background: transparent;
      padding: 0;
      color: #333;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 8px 0;
  }

  hr {
    border: none;
    border-top: 2px solid #e9ecef;
    margin: 24px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 16px 0;

    th, td {
      border: 1px solid #dee2e6;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
    }
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

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = "Digite seu conteúdo em markdown..."
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Função para inserir texto na posição do cursor
  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    onChange(newValue);
    
    // Reposicionar cursor
    setTimeout(() => {
      const newPosition = start + before.length + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [value, onChange]);

  // Funções de formatação
  const formatBold = () => insertText('**', '**', 'texto em negrito');
  const formatItalic = () => insertText('*', '*', 'texto em itálico');
  const formatCode = () => insertText('`', '`', 'código');
  const formatLink = () => insertText('[', '](url)', 'texto do link');
  const formatImage = () => insertText('![', '](url)', 'alt text');
  
  const formatHeader = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertText(prefix, '', `Título ${level}`);
  };

  const formatList = (ordered: boolean = false) => {
    const prefix = ordered ? '1. ' : '- ';
    insertText(prefix, '', 'item da lista');
  };

  const formatQuote = () => insertText('> ', '', 'citação');
  const formatCodeBlock = () => insertText('```\n', '\n```', 'código aqui');
  const insertHr = () => insertText('\n---\n', '', '');

  // Converter markdown básico para HTML para preview
  const markdownToHtml = (markdown: string): string => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Code inline
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
      // Line breaks
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Horizontal rule
      .replace(/^---$/gim, '<hr>')
      // Wrap in paragraphs
      .replace(/^(?!<[h|l|b|u])(.+)$/gim, '<p>$1</p>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');
  };

  return (
    <div>
      {label && <Label>{label} {required && '*'}</Label>}
      <EditorContainer>
        <Toolbar>
          <ToolbarButton onClick={formatBold} title="Negrito (Ctrl+B)">
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton onClick={formatItalic} title="Itálico (Ctrl+I)">
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton onClick={formatCode} title="Código inline">
            {'<>'}
          </ToolbarButton>
          
          <ToolbarSeparator />
          
          <ToolbarButton onClick={() => formatHeader(1)} title="Título 1">
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => formatHeader(2)} title="Título 2">
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => formatHeader(3)} title="Título 3">
            H3
          </ToolbarButton>
          
          <ToolbarSeparator />
          
          <ToolbarButton onClick={() => formatList(false)} title="Lista com marcadores">
            • Lista
          </ToolbarButton>
          <ToolbarButton onClick={() => formatList(true)} title="Lista numerada">
            1. Lista
          </ToolbarButton>
          <ToolbarButton onClick={formatQuote} title="Citação">
            ""
          </ToolbarButton>
          
          <ToolbarSeparator />
          
          <ToolbarButton onClick={formatLink} title="Link">
            🔗
          </ToolbarButton>
          <ToolbarButton onClick={formatImage} title="Imagem">
            🖼️
          </ToolbarButton>
          <ToolbarButton onClick={formatCodeBlock} title="Bloco de código">
            {'{...}'}
          </ToolbarButton>
          <ToolbarButton onClick={insertHr} title="Linha horizontal">
            ---
          </ToolbarButton>
          
          <ToolbarSeparator />
          
          <ToolbarButton 
            onClick={() => setShowPreview(!showPreview)}
            $active={showPreview}
            title={showPreview ? "Ocultar preview" : "Mostrar preview"}
          >
            {showPreview ? '✏️ Editar' : '👁️ Preview'}
          </ToolbarButton>
        </Toolbar>
        
        <EditorWrapper>
          <TextArea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ display: showPreview ? 'none' : 'block' }}
          />
          
          <PreviewPane 
            $visible={showPreview}
            dangerouslySetInnerHTML={{ 
              __html: markdownToHtml(value) || '<p style="color: #999; font-style: italic;">Nada para mostrar ainda...</p>' 
            }}
          />
        </EditorWrapper>
      </EditorContainer>
    </div>
  );
};