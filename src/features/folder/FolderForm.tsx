import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import type { Folder } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";
import { useFolder } from "./useFolder";
import { useUser } from "../user/useUser";

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
  const { activeUser } = useUser();

  useEffect(() => {
    setName(initial.Name ?? "");
    setParentFolderId(initial.ParentFolderId?.toString() ?? "");
    setValidatorId(initial.ValidatorId?.toString() ?? "");
  }, [initial.Name, initial.ParentFolderId, initial.ValidatorId]);

  const validateFields = () => {
    const isNameValid = Name.trim().length >= 3 && Name.trim().length <= 20;
    return isNameValid;
  };

  const canSave = validateFields();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    console.log(ParentFolderId, ValidatorId);

    const payload = {
      Name: Name.trim(),
      ParentFolderId: ParentFolderId ? parseInt(ParentFolderId) : null,
      ValidatorId: ValidatorId ? parseInt(ValidatorId) : null 
    };

    onSave(payload);
  };

  const parentFolderOptions = [
    { value: "", label: t("folders.no_parent_folder") },
    ...activeFolder
      .filter(folder => folder.FolderId !== initial.FolderId)
      .map(folder => ({
        value: folder.FolderId.toString(),
        label: folder.Name
      }))
  ];

  const validatorOptions = [
    { value: "", label: t("folders.select_validator") }, 
    ...activeUser.map(user => ({
      value: user.UserId.toString(), 
      label: user.Name
    }))
  ]

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
            onChange={(e) => setParentFolderId(e.target.value.toString())}
            options={parentFolderOptions}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Select
            label={t("folders.validator")}
            value={ValidatorId}
            onChange={(e) => setValidatorId(e.target.value)} 
            options={validatorOptions}
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