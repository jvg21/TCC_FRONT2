import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Document } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";
import { regexPatterns } from "../../utils/regexUtils";


const Row = styled.div` display:flex; gap:12px; margin-bottom: 12px; `;
const Col = styled.div` flex:1; `;

type Props = {
    initial?: Partial<Document>;
    isEditing?: boolean;
    onCancel: () => void;
    onSave: (data: Omit<Document, "DocumentId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "UserId" | "FolderId"> & Partial<Document>) => void;
};

export const DocumentForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
    const [Title, setTitle] = useState(initial.Title ?? "");
    const [Content, setContent] = useState(initial.Content ?? "");
    const [UserId, setUserId] = useState(initial.UserId ?? "");
    const [FolderId, setFolderId] = useState(initial.FolderId ?? "");
    const { t } = useTranslation();

    useEffect(() => {
        setTitle(initial.Title ?? "");
        setContent(initial.Content ?? "");
        setUserId(initial.UserId ?? "");
        setFolderId(initial.FolderId ?? "");
    }, [initial.Title, initial.Content, initial.UserId, initial.FolderId]);

    const validateFields = () => {
        const isTitleValid = Title.trim().length > 0;
        console.log("Validation results:", {
            isTitleValid,

        });
        return isTitleValid;
    };

    const canSave = validateFields();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;

        
        onSave({ Title, Content, UserId, FolderId });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Row>
                <Col><Input label={t("documents.title_field")} maxLength={50} minLength={3} required value={Title} onChange={(e) => setTitle(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Input label={t("documents.content")} required value={Content} onChange={(e) => setContent(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Select label={t("documents.user")} required value={UserId} options={[
                    { value: "false", label: t("status.disabled") },
                    { value: "true", label: t("status.enabled") },
                ]} /></Col>
                <Col><Select label={t("documents.folder")} required value={FolderId} options={[
                    { value: "false", label: t("status.disabled") },
                    { value: "true", label: t("status.enabled") },
                ]} /></Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button variant="ghost" type="button" onClick={onCancel}>{t("actions.cancel")}</Button>
                <Button type="submit" disabled={!canSave}>{t("actions.save")}</Button>
            </div>
        </form>
    );
};