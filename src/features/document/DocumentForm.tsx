import React, { useState, useEffect } from "react";
import type { Document } from "./types";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { useTranslation } from "react-i18next";
import { useFolder } from "../folder/useFolder";
import { useTemplate } from "../templates/useTemplate";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";
import { FiEdit } from "react-icons/fi";
import styled from "styled-components";
import { notificationActions } from "../notifications/useNotification";

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

const TemplateInfo = styled.div`
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #1565c0;
  display: flex;
  align-items: center;
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
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [appliedTemplate, setAppliedTemplate] = useState<string>("");
    const { t } = useTranslation();
    
    // Integração com hooks
    const { activeFolder } = useFolder();
    const { activeTemplate } = useTemplate();

    useEffect(() => {
        setTitle(initial.Title ?? "");
        setContent(initial.Content ?? "");
        setFolderId(initial.FolderId?.toString() ?? "");
        setSelectedTemplateId("");
        setAppliedTemplate("");
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

    const handleTemplateSelection = (templateId: string) => {
        setSelectedTemplateId(templateId);
        
        if (templateId) {
            const selectedTemplate = activeTemplate.find(template => 
                template.TemplateId.toString() === templateId
            );
            
            if (selectedTemplate) {
                setContent(selectedTemplate.Content);
                setAppliedTemplate(selectedTemplate.Name);
                notificationActions.showNotification(
                    t("documents.template_applied") || "Template aplicado com sucesso!", 
                    'success'
                );
            }
        } else {
            setAppliedTemplate("");
        }
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
                        label={t("documents.title_field") || "Título"} 
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
                    <Select 
                        label={t("documents.template") || "Template"} 
                        value={selectedTemplateId} 
                        onChange={(e) => handleTemplateSelection(e.target.value)}
                        options={[
                            { value: "", label: t("documents.select_template") || "Selecionar template (opcional)" },
                            ...activeTemplate.map(template => ({
                                value: template.TemplateId.toString(),
                                label: template.Name
                            }))
                        ]} 
                    />
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
                        {t("documents.content") || "Conteúdo"} *
                    </label>
                    
                    {appliedTemplate && (
                        <TemplateInfo>
                            ✅ {t("documents.template_applied_from") || "Conteúdo aplicado do template"}: <strong>{appliedTemplate}</strong>
                        </TemplateInfo>
                    )}
                    
                    <ContentPreview>
                        {Content ? 
                            `${Content.substring(0, 100)}${Content.length > 100 ? '...' : ''}` : 
                            t('documents.no_content') || 'Clique em "Editar Conteúdo" para adicionar texto'
                        }
                    </ContentPreview>
                    <EditorButton 
                        type="button" 
                        onClick={handleEditContent}
                    >
                        <FiEdit />
                        {t("documents.edit_content") || "Editar Conteúdo"}
                    </EditorButton>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Select 
                        label={t("documents.folder") || "Pasta"} 
                        value={FolderId} 
                        onChange={(e) => setFolderId(e.target.value)}
                        options={[
                            { value: "", label: t("documents.select_folder") || "Selecionar pasta" },
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
                    {t("actions.cancel") || "Cancelar"}
                </Button>
                <Button type="submit" disabled={!canSave}>
                    {t("actions.save") || "Salvar"}
                </Button>
            </div>
        </form>
    );
};