import React, { useState, useEffect } from "react";
import type { Document } from "./types";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { useTranslation } from "react-i18next";
import { useFolder } from "../folder/useFolder";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";

interface DocumentFormProps {
    initial?: Partial<Document>;
    onSave: (data: Partial<Document>) => void;
    onCancel: () => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
    initial = {},
    onSave,
    onCancel
}) => {
    const [Title, setTitle] = useState(initial.Title ?? "");
    const [Content, setContent] = useState(initial.Content ?? "");
    const [FolderId, setFolderId] = useState(initial.FolderId?.toString() ?? "");
    const { t } = useTranslation();
    
    // Integração com hooks
    const { activeFolder } = useFolder();

    console.log(activeFolder)

    useEffect(() => {
        setTitle(initial.Title ?? "");
        setContent(initial.Content ?? "");
        setFolderId(initial.FolderId?.toString() ?? "");
    }, [initial.Title, initial.Content, initial.UserId, initial.FolderId]);

    const validateFields = () => {
        const isTitleValid = Title.trim().length > 0;
        const isContentValid = Content.trim().length > 0;
        const isFolderIdValid = FolderId.trim().length > 0;
        return isTitleValid && isContentValid  && isFolderIdValid;
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
                    <Input 
                        label={t("documents.content")} 
                        required 
                        value={Content} 
                        onChange={(e) => setContent(e.target.value)} 
                    />
                </Col>
            </Row>
            
            <Row>
               
                
                <Col>
                    <Select 
                        label={t("documents.folder")} 
                        required 
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