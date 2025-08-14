import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Document } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";


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
    const [IsActive, setIsActive] = useState(initial.IsActive ?? "");
    const { t } = useTranslation();

    useEffect(() => {
        setTitle(initial.Title ?? "");
        setContent(initial.Content ?? "");
        setUserId(initial.UserId ?? "");
        setFolderId(initial.FolderId ?? "");
        setIsActive(initial.IsActive ?? "");
    }, [initial]);

    const canSave = Title.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        onSave({ Title, Content, UserId, FolderId, IsActive });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Row>
                <Col><Input label={t("documents.title_field")} value={Title} onChange={(e) => setTitle(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Input label={t("documents.content")} value={Content} onChange={(e) => setContent(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Select label={t("documents.user")} value={UserId} options={[
                    { value: "false", label: t("status.disabled") },
                    { value: "true", label: t("status.enabled") },
                ]} /></Col>
                <Col><Select label={t("documents.folder")} value={FolderId} options={[
                    { value: "false", label: t("status.disabled") },
                    { value: "true", label: t("status.enabled") },
                ]} /></Col>
            </Row>

            <Row>
                <Col><Select label={t("documents.is_active")} value={IsActive} options={[
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