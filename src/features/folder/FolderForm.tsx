import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import type { Folder } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";
import { useFolder } from "./useFolder";

type Props = {
  initial?: Partial<Folder>;
  onCancel: () => void;
  onSave: (data: Partial<Folder>) => void;
};

export const FolderForm: React.FC<Props> = ({ initial = {}, onCancel, onSave }) => {
  const [Name, setName] = useState(initial.Name ?? "");
  const [ParentFolderId, setParentFolderId] = useState(initial.ParentFolderId?.toString() ?? "");
  const [ValidatorId, setValidatorId] = useState(initial.ValidatorId?.toString() ?? "");
  const { t } = useTranslation();
  const { activeFolder } = useFolder();

  useEffect(() => {
    setName(initial.Name ?? "");
    setParentFolderId(initial.ParentFolderId?.toString() ?? "");
    setValidatorId(initial.ValidatorId?.toString() ?? "");
  }, [initial.Name, initial.ParentFolderId, initial.ValidatorId]);

  const validateFields = () => {
    const isNameValid = Name.trim().length >= 3 && Name.trim().length <= 20;
    const isValidatorValid = ValidatorId.trim().length > 0;
    return isNameValid && isValidatorValid;
  };

  const canSave = validateFields();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const payload = {
      Name: Name.trim(),
      ParentFolderId: ParentFolderId ? parseInt(ParentFolderId) : null,
      ValidatorId: parseInt(ValidatorId)
    };

    onSave(payload);
  };

  // Prepara opções para pasta pai (exclui a pasta atual se estiver editando)
  const parentFolderOptions = [
    { value: "", label: t("folders.no_parent_folder") },
    ...activeFolder
      .filter(folder => folder.FolderId !== initial.FolderId) 
      .map(folder => ({
        value: folder.FolderId.toString(),
        label: folder.Name
      }))
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Input
            label={t("folders.name")}
            maxLength={20}
            minLength={3}
            required
            value={Name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("folders.name_placeholder")}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Select
            label={t("folders.parent_folder")}
            value={ParentFolderId}
            onChange={(e) => setParentFolderId(e.target.value)}
            options={parentFolderOptions}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Input
            label={t("folders.validator_id")}
            type="number"
            required
            value={ValidatorId}
            onChange={(e) => setValidatorId(e.target.value)}
            placeholder={t("folders.validator_placeholder")}
            min="1"
          />
        </Col>
      </Row>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
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