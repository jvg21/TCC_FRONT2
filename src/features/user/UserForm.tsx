import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { User } from "./types";
import { Select } from "../../components/common/Select";


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

  useEffect(() => {
    setName(initial.Name ?? "");
    setEmail(initial.Email ?? "");
    setProfile(initial.Profile ?? "");
    setIsActive(initial.IsActive ?? "");
  }, [initial]);

  const canSave = Name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ Name, Email, Profile, IsActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label="Nome" value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input label="Profile" value={Profile} onChange={(e) => setProfile(e.target.value)} /></Col>
        <Col><Input label="E-mail" value={Email} onChange={(e) => setEmail(e.target.value)} /></Col>
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
