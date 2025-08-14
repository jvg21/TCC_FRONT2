import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Folder } from "./types";
import { Select } from "../../components/common/Select";



const Row = styled.div` display:flex; gap:12px; margin-bottom: 12px; `;
const Col = styled.div` flex:1; `;

type Props = {
  initial?: Partial<Folder>;
  isEditing?: boolean;
  onCancel: () => void;
  onSave: (data: Omit<Folder, "ParentFolderId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "FolderId"> & Partial<Folder>) => void;
};

export const FolderForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [Name, setName] = useState(initial.Name ?? "");
  const [FolderId, setFolderId] = useState(initial.FolderId ?? "");
  const [UserId, setUserId] = useState(initial.UserId ?? "");
  const [IsActive, setIsActive] = useState(initial.IsActive ?? "");

  useEffect(() => {
    setName(initial.Name ?? "");
    setFolderId(initial.FolderId ?? "");
    setUserId(initial.UserId ?? "");
    setIsActive(initial.IsActive ?? "");
  }, [initial]);

  const canSave = Name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ Name, FolderId, UserId, IsActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label="Nome" value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Select label="Usuário" options={[
          { value: "false", label: "Desativado" },
          { value: "true", label: "Ativado" },
        ]} /></Col>
        <Col><Select label="Pasta" options={[
          { value: "false", label: "Desativado" },
          { value: "true", label: "Ativado" },
        ]} /></Col>
      </Row>

      <Row>
        <Col><Select label="Ativo" options={[
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