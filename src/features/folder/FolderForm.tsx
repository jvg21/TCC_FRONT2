import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Folder } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";



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
  const { t } = useTranslation();

  useEffect(() => {
    setName(initial.Name ?? "");
    setFolderId(initial.FolderId ?? "");
    setUserId(initial.UserId ?? "");
    setIsActive(initial.IsActive ?? "");
  }, [initial.Name, initial.FolderId, initial.UserId, initial.IsActive]);

  const canSave = Name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ Name, FolderId, UserId, IsActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label={t("folders.name")} value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Select label={t("folders.user")} options={[
          { value: "false", label: t("status.disabled") },
          { value: "true", label: t("status.enabled") },
        ]} /></Col>
        <Col><Select label={t("folders.parent_folder")} options={[
          { value: "false", label: t("status.disabled") },
          { value: "true", label: t("status.enabled") },
        ]} /></Col>
      </Row>

      <Row>
        <Col><Select label={t("folders.is_active")} options={[
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