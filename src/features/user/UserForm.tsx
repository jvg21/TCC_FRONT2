import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import type { User } from "./types";
import { Select } from "../../components/common/Select";
import { useTranslation } from "react-i18next";
import { regexPatterns } from "../../utils/regexUtils";
import { useAuthContext } from "../../context/AuthContext";
import { profiles } from "../../enum/userProfile";
import { Row } from "../../components/common/Row";
import { Col } from "../../components/common/Col";

type Props = {
  initial?: Partial<User>;
  isEditing?: boolean;
  onCancel: () => void;
  onSave: (data: Omit<User, "UserId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "PreferredLanguage" | "PreferredTheme" | "LastLoginAt" | "CompanyId"> & Partial<User>) => void;
};

export const UserForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [Name, setName] = useState(initial.Name ?? "");
  const [Email, setEmail] = useState(initial.Email ?? "");
  const [Password, setPassword] = useState(initial.Password ?? "");
  const [Profile, setProfile] = useState(initial.Profile ?? 0);
  const { t } = useTranslation();
  const { user } = useAuthContext();

  useEffect(() => {
    setName(initial.Name ?? "");
    setEmail(initial.Email ?? "");
    setPassword(initial.Password ?? "");
    setProfile(initial.Profile ?? 3); // Mudança: padrão 3 (Employee) ao invés de 0
  }, [initial.Name, initial.Email, initial.Profile]);


  const validateFields = () => {
    const isNameValid = Name.trim().length > 0;
    const isEmailValid = !!Email && regexPatterns.email.test(Email);
    const isPasswordValid = Password.trim().length >= 6 && regexPatterns.password.test(Password);

    return isNameValid && isEmailValid && isPasswordValid;
  };

  const canSave = validateFields();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ Name, Email, Profile, Password });
  };

  const userProfile = user?.Profile || 0;
  const profileOptions = profiles.filter(p => {
    if (userProfile === 1) return true; // Admin vê todos
    if (userProfile === 2) return p.value !== '1'; // Manager não vê admin
    return p.value === '3'; // Employee só vê ele mesmo
  });

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label={t("users.name")} maxLength={20} minLength={3} required value={Name} onChange={(e) => setName(e.target.value)} /></Col>

        <Col ><Input label={t("users.password")} type="password" value={Password} minLength={6} required onChange={(e) => setPassword(e.target.value)}
          regex={regexPatterns.password}
          title={t("users.passwordRequirements")}
        /></Col>
      </Row>
      <Row>
        <Col><Select
          label={t("users.profile")}
          required
          options={profileOptions}
          value={Profile.toString()}
          onChange={(e) => setProfile(Number(e.target.value))}
        /></Col>

        <Col><Input label={t("users.email")} value={Email} maxLength={30} required onChange={(e) => setEmail(e.target.value)}
          regex={regexPatterns.email}
        /></Col>
      </Row>
      {/* <Row>
        <Col><Select label={t("users.is_active")} required options={[
          { value: "false", label: t("status.disabled") },
          { value: "true", label: t("status.enabled") },
        ]} /></Col>
      </Row> */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" type="button" onClick={onCancel}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={!canSave}>{t("actions.save")}</Button>
      </div>
    </form>
  );
};
