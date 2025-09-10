import React, { useState, useEffect } from "react";
import { Button } from "../../components/common/Button";
import { useTranslation } from "react-i18next";
import { FiSave, FiX } from "react-icons/fi";
import styled from "styled-components";
import PageLayout from "../../components/common/PageLayout";
import { MarkdownEditor } from "../../components/markdownEditor/MarkdownEditor";

const EditorContainer = styled.div`
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 0;
  border-top: 1px solid rgba(0,0,0,0.08);
`;

interface MarkdownEditorPageProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export const MarkdownEditorPage: React.FC<MarkdownEditorPageProps> = ({
  initialContent = "",
  onSave,
  onCancel
}) => {
  const [content, setContent] = useState(initialContent);
  const { t } = useTranslation();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
  };

  const hasChanges = content !== initialContent;

  return (
    <PageLayout
      title="Editor de Markdown"
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={onCancel}>
            <FiX />&nbsp;{t("actions.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <FiSave />&nbsp;{t("actions.save")}
          </Button>
        </div>
      }
    >
      <EditorContainer>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="Digite seu conteúdo em markdown..."
        />
      </EditorContainer>
    </PageLayout>
  );
};