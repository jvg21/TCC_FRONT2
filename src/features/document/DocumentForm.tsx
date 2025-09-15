import React, { useState, useEffect } from "react";
import type { Document } from "./types";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { useTranslation } from "react-i18next";
import { useFolder } from "../folder/useFolder";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";
import { FiEdit } from "react-icons/fi";
import styled from "styled-components";

const ContentPreview = styled.div`
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 12px;
  background: #f8f9fa;
  min-height: 100px;
  color: #666;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 8px;
`;

const EditorButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

interface DocumentFormProps {
    initial?: Partial<Document>;
    onSave: (data: Partial<Document>) => void;
    onCancel: () => void;
    onEditContent?: (currentContent: string, onContentSaved: (newContent: string) => void) => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
    initial = {},
    onSave,
    onCancel,
    onEditContent
}) => {
    const [Title, setTitle] = useState(initial.Title ?? "");
    const [Content, setContent] = useState(initial.Content ?? "");
    const [FolderId, setFolderId] = useState(initial.FolderId?.toString() ?? "");
    const { t } = useTranslation();
    
    // Integração com hooks
    const { activeFolder } = useFolder();

    useEffect(() => {
        setTitle(initial.Title ?? "");
        setContent(initial.Content ?? "");
        setFolderId(initial.FolderId?.toString() ?? "");
    }, [initial.Title, initial.Content, initial.UserId, initial.FolderId]);

    const validateFields = () => {
        const isTitleValid = Title.trim().length > 0;
        const isContentValid = Content.trim().length > 0;
        return isTitleValid && isContentValid;
    };

    const canSave = validateFields();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;

        onSave({ 
            Title, 
            Content, 
            FolderId: parseInt(FolderId) 
        });
        
    };

    const handleEditContent = () => {
        if (onEditContent) {
            onEditContent(Content, (newContent: string) => {
                setContent(newContent);
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <Input 
                        label={t("documents.title_field")} 
                        maxLength={50} 
                        minLength={3} 
                        required 
                        value={Title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
                        {t("documents.content")} *
                    </label>
                    <ContentPreview>
                        {Content ? 
                            `${Content.substring(0, 100)}${Content.length > 100 ? '...' : ''}` : 
                            'Clique em "Editar Conteúdo" para adicionar o conteúdo do documento'
                        }
                    </ContentPreview>
                    <EditorButton 
                        type="button" 
                        onClick={handleEditContent}
                    >
                        <FiEdit />
                        Editar Conteúdo
                    </EditorButton>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Select 
                        label={t("documents.folder")} 
                        value={FolderId} 
                        onChange={(e) => setFolderId(e.target.value)}
                        options={[
                            { value: "", label: "Selecione uma pasta..." },
                            ...activeFolder.map(folder => ({
                                value: folder.FolderId.toString(),
                                label: folder.Name
                            }))
                        ]} 
                    />
                </Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button variant="ghost" type="button" onClick={onCancel}>
                    {t("actions.cancel")}
                </Button>
                <Button type="submit" disabled={!canSave}>
                    {t("actions.save")}
                </Button>
            </div>
        </form>
    );
};