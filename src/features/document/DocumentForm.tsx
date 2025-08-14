import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Document } from "./types";
import { Select } from "../../components/common/Select";


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
                <Col><Input label="Titulo" value={Title} onChange={(e) => setTitle(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Input label="Content" value={Content} onChange={(e) => setContent(e.target.value)} /></Col>
            </Row>
            <Row>
                <Col><Select label="Usuário" value={UserId} options={[
                    { value: "false", label: "Desativado" },
                    { value: "true", label: "Ativado" },
                ]} /></Col>
                <Col><Select label="Pasta" value={FolderId} options={[
                    { value: "false", label: "Desativado" },
                    { value: "true", label: "Ativado" },
                ]} /></Col>
            </Row>

            <Row>
                <Col><Select label="Ativo" value={IsActive} options={[
                    { value: "false", label: "Desativado" },
                    { value: "true", label: "Ativado" },
                ]} /></Col>
            </Row>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" disabled={!canSave}>Salvar</Button>
            </div>
        </form>
    );
};