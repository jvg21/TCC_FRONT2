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
  onSave: (data: Omit<Company, "id" | "createdAt" | "updatedAt" | "isDeleted"> & Partial<Company>) => void;
};

export const CompanyForm: React.FC<Props> = ({ initial = {}, isEditing = false, onCancel, onSave }) => {
  const [name, setName] = useState(initial.name ?? "");
  const [cnpj, setCnpj] = useState(initial.cnpj ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [address, setAddress] = useState(initial.address ?? "");

  useEffect(() => {
    setName(initial.name ?? "");
    setCnpj(initial.cnpj ?? "");
    setEmail(initial.email ?? "");
    setPhone(initial.phone ?? "");
    setAddress(initial.address ?? "");
  }, [initial]);

  const canSave = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ name, cnpj, email, phone, address });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input label="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} /></Col>
        <Col><Input label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} /></Col>
        <Col><Input label="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} /></Col>
      </Row>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={!canSave}>Salvar</Button>
      </div>
    </form>
  );
};
