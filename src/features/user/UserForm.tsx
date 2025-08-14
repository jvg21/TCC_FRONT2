import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { User } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";
import { regexPatterns } from "../../utils/regexUtils";


const Row = styled.div` display:flex; gap:12px; margin-bottom: 12px; `;
const Col = styled.div` flex:1; `;


type Props = {
  initial?: Partial<User>;
  isEditing?: boolean;
  onCancel: () => void;
  onSave: (data: Omit<User, "UserId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "PreferredLanguage" | "PreferredTheme" | "Password" | "LastLoginAt" | "CompanyId"> & Partial<User>) => void;
};

export const UserForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [Name, setName] = useState(initial.Name ?? "");
  const [Email, setEmail] = useState(initial.Email ?? "");
  const [Profile, setProfile] = useState(initial.Profile ?? "");
  const [IsActive, setIsActive] = useState(initial.IsActive ?? "");
  const { t } = useTranslation();

  useEffect(() => {
    setName(initial.Name ?? "");
    setEmail(initial.Email ?? "");
    setProfile(initial.Profile ?? "");
    setIsActive(initial.IsActive ?? "");
  }, [initial.Name, initial.Email, initial.Profile, initial.IsActive]);

  const canSave = Name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ Name, Email, Profile, IsActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label={t("users.name")} value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input label={t("users.profile")} value={Profile} onChange={(e) => setProfile(e.target.value)} /></Col>
        <Col><Input label={t("users.email")} value={Email} onChange={(e) => setEmail(e.target.value)}
        regex={regexPatterns.email}
        /></Col>
      </Row>
      <Row>
        <Col><Select label={t("users.is_active")} options={[
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
