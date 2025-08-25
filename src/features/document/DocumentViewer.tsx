// src/components/common/DocumentViewer.tsx
import React from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';

const ViewerContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const ViewerHeader = styled.div`
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DocumentTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
`;

const ViewerContent = styled.div`
  padding: 24px;
  max-height: 600px;
  overflow-y: auto;
  line-height: 1.6;
  color: #333;

  h1, h2, h3, h4, h5, h6 {
    margin: 24px 0 16px 0;
    color: #333;
    &:first-child {
      margin-top: 0;
    }
  }

  h1 { 
    font-size: 32px; 
    font-weight: 700; 
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 8px;
  }
  h2 { 
    font-size: 26px; 
    font-weight: 600; 
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 4px;
  }
  h3 { font-size: 22px; font-weight: 600; }
  h4 { font-size: 18px; font-weight: 600; }
  h5 { font-size: 16px; font-weight: 600; }
  h6 { font-size: 14px; font-weight: 600; text-transform: uppercase; }

  p {
    margin: 0 0 16px 0;
    line-height: 1.7;
  }

  strong {
    font-weight: 600;
    color: #222;
  }

  em {
    font-style: italic;
    color: #555;
  }

  ul, ol {
    margin: 0 0 16px 24px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    ul, ol {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  blockquote {
    border-left: 4px solid #007bff;
    background: #f8f9fa;
    padding: 16px 20px;
    margin: 16px 0;
    font-style: italic;
    color: #555;
    border-radius: 0 4px 4px 0;

    p:last-child {
      margin-bottom: 0;
    }
  }

  code {
    background: #f1f3f4;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    color: #d63384;
    border: 1px solid #e9ecef;
  }

  pre {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 16px;
    margin: 16px 0;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.4;

    code {
      background: transparent;
      padding: 0;
      color: #333;
      border: none;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 16px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  hr {
    border: none;
    border-top: 2px solid #e9ecef;
    margin: 32px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    overflow: hidden;

    th, td {
      border: 1px solid #dee2e6;
      padding: 12px 16px;
      text-align: left;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    tr:nth-child(even) {
      background: #f8f9fa;
    }
  }

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

interface DocumentViewerProps {
  title: string;
  content: string;
  onEdit?: () => void;
  onClose?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  title,
  content,
  onEdit,
  onClose
}) => {
  // Converter markdown básico para HTML
  const markdownToHtml = (markdown: string): string => {
    if (!markdown) return '<p style="color: #999; font-style: italic;">Documento vazio</p>';
    
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Code inline
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      // Lists - bullet points
      .replace(/^\s*\-\s(.+)$/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
      // Lists - numbered
      .replace(/^\s*\d+\.\s(.+)$/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gim, '<ol>$1</ol>')
      // Blockquotes
      .replace(/^>\s(.+)$/gim, '<blockquote><p>$1</p></blockquote>')
      // Horizontal rule
      .replace(/^---+$/gim, '<hr>')
      // Line breaks and paragraphs
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>')
      // Wrap in paragraphs if not already wrapped
      .replace(/^(?!<[h|l|b|u|p])(.+)$/gim, '<p>$1</p>')
      // Clean up empty paragraphs
      .replace(/<p><\/p>/gim, '')
      // Fix nested lists
      .replace(/<\/ul>\s*<ul>/gim, '')
      .replace(/<\/ol>\s*<ol>/gim, '');
  };

  return (
    <ViewerContainer>
      <ViewerHeader>
        <DocumentTitle>{title}</DocumentTitle>
        <ActionButtons>
          {onEdit && (
            <Button  onClick={onEdit}>
              ✏️ Editar
            </Button>
          )}
          {onClose && (
            <Button variant="ghost"  onClick={onClose}>
              ✕ Fechar
            </Button>
          )}
        </ActionButtons>
      </ViewerHeader>
      
      <ViewerContent
        dangerouslySetInnerHTML={{
          __html: markdownToHtml(content)
        }}
      />
    </ViewerContainer>
  );
};