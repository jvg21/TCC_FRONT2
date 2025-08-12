import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Company } from "./types";

const Row = styled.div` display:flex; gap:12px; margin-bottom: 12px; `;
const Col = styled.div` flex:1; `;

type Props = {
  initial?: Partial<Company>;
  isEditing?: boolean;
  onCancel: () => void;
  onSave: (data: Omit<Company, "CompanyId" | "CreatedAt" | "UpdatedAt" | "IsActive"> & Partial<Company>) => void;
};

export const CompanyForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [Name, setName] = useState(initial.Name ?? "");
  const [TaxId, setCnpj] = useState(initial.TaxId ?? "");
  const [Email, setEmail] = useState(initial.Email ?? "");
  const [Phone, setPhone] = useState(initial.Phone ?? "");
  const [Adress, setAdress] = useState(initial.Adress ?? "");

  useEffect(() => {
    setName(initial.Name ?? "");
    setCnpj(initial.TaxId ?? "");
    setEmail(initial.Email ?? "");
    setPhone(initial.Phone ?? "");
    setAdress(initial.Adress ?? "");
  }, [initial]);

  const canSave = Name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ Name, TaxId, Email, Phone, Adress });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label="Nome" value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input label="CNPJ" value={TaxId} onChange={(e) => setCnpj(e.target.value)} /></Col>
        <Col><Input label="E-mail" value={Email} onChange={(e) => setEmail(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input label="Telefone" value={Phone} onChange={(e) => setPhone(e.target.value)} /></Col>
        <Col><Input label="Endereço" value={Adress} onChange={(e) => setAdress(e.target.value)} /></Col>
      </Row>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={!canSave}>Salvar</Button>
      </div>
    </form>
  );
};
