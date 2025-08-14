import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Group } from "./types";
import { Select } from "../../components/common/Select";



const Row = styled.div` display:flex; gap:12px; margin-bottom: 12px; `;
const Col = styled.div` flex:1; `;

type Props = {
  initial?: Partial<Group>;
  isEditing?: boolean;
  onCancel: () => void;
  onSave: (data: Omit<Group, "GroupId" | "CreatedAt" | "UpdatedAt" | "IsActive"> & Partial<Group>) => void;
};

export const GroupForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [Name, setName] = useState(initial.Name ?? "");
  const [Description, setDescription] = useState(initial.Description ?? "");
  const [IsActive, setIsActive] = useState(initial.IsActive ?? "");


  useEffect(() => {
    setName(initial.Name ?? "");
    setDescription(initial.Description ?? "");
    setIsActive(initial.IsActive ?? "");
  }, [initial]);

  const canSave = Name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ Name, Description, IsActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label="Nome" value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input label="Description" value={Description} onChange={(e) => setDescription(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Select label="Ativo" options={[
          { value: "false", label: "Desativado" },
          { value: "true", label: "Ativado" },
        ]} /></Col>


        <Col><Select label="Usuario" options={[
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