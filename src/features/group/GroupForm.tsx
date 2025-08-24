import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Group } from "./types";
import { useTranslation } from "react-i18next";



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
  const { t } = useTranslation();


  useEffect(() => {
    setName(initial.Name ?? "");
    setDescription(initial.Description ?? "");
    setIsActive(initial.IsActive ? 'true' : 'false');
  }, [initial.Name, initial.Description, initial.IsActive]);

  const validateFields = () => {
    const isNameValid = Name.trim().length > 0;
    console.log("Validation results:", {
      isNameValid,

    });
    return isNameValid;
  };

  const canSave = validateFields();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const formattedIsActive = IsActive === "true";

    onSave({ Name, Description, IsActive: formattedIsActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label={t("groups.name")} maxLength={20} minLength={3} required value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input label={t("groups.description")} required value={Description} onChange={(e) => setDescription(e.target.value)} /></Col>
      </Row>
      
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" type="button" onClick={onCancel}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={!canSave}>{t("actions.save")}</Button>
      </div>
    </form>
  );
};