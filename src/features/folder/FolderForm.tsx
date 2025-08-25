import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import type { Folder } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";


type Props = {
  initial?: Partial<Folder>;
  isEditing?: boolean;
  onCancel: () => void;
  onSave: (data: Partial<Folder>) => void;
};

export const FolderForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [Name, setName] = useState(initial.Name ?? "");
  const [FolderId, setFolderId] = useState(initial.FolderId ?? 0);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initial.Name ?? "");
    setFolderId(initial.FolderId ?? 0);
  }, [initial.Name, initial.FolderId, initial.UserId]);

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

    onSave({ Name, FolderId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label={t("folders.name")} maxLength={20} minLength={3} required value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Select label={t("folders.parent_folder")} required options={[
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