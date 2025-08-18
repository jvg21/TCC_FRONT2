import React, { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import styled from "styled-components";
import type { Company } from "./types";
import { Select } from "../../components/common/Select";
import { useTypedTranslation } from "../../context/LanguageContext";
import { regexPatterns } from "../../utils/regexUtils";

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
  const [TaxId, setTaxId] = useState(initial.TaxId ?? "");
  const [Email, setEmail] = useState(initial.Email ?? "");
  const [Phone, setPhone] = useState(initial.Phone ?? "");
  const [Adress, setAdress] = useState(initial.Adress ?? "");
  const [ZipCode, setZipCode] = useState(initial.ZipCode ?? "");
  const [IsActive, setIsActive] = useState(initial.IsActive ? 'true' : 'false');
  const { t } = useTypedTranslation();

  // Apenas inicializa os valores quando o objeto 'initial' muda
  // Não reinicializa durante digitação
  useEffect(() => {
    setName(initial.Name ?? "");
    setTaxId(initial.TaxId ?? "");
    setEmail(initial.Email ?? "");
    setPhone(initial.Phone ?? "");
    setAdress(initial.Adress ?? "");
    setZipCode(initial.ZipCode ?? "");
    setIsActive(initial.IsActive ? 'true' : 'false');
  }, [
    initial.Name,
    initial.TaxId,
    initial.Email,
    initial.Phone,
    initial.Adress,
    initial.ZipCode,
    initial.IsActive
  ]);

  const validateFields = () => {
    const isNameValid = Name.trim().length > 0;
    const isTaxIdValid = !!TaxId && regexPatterns.cnpj.test(TaxId);
    const isEmailValid = !!Email && regexPatterns.email.test(Email);
    const isPhoneValid = !!Phone && regexPatterns.phone.test(Phone);
    const isZipCodeValid = !!ZipCode && regexPatterns.cep.test(ZipCode);
    console.log("Validation results:", {
      isNameValid,
      isTaxIdValid,
      isEmailValid,
      isPhoneValid,
      isZipCodeValid
    });
    return isNameValid && isTaxIdValid && isEmailValid && isPhoneValid && isZipCodeValid;
  };

  const canSave = validateFields();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const formattedIsActive = IsActive === "true";

    onSave({ Name, TaxId, Email, Phone, Adress, ZipCode, IsActive: formattedIsActive });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col><Input label={t("companies.name")} maxLength={25} required value={Name} onChange={(e) => setName(e.target.value)} /></Col>
      </Row>
      <Row>
        <Col><Input
          label={t("companies.tax_id")}
          value={TaxId}
          required
          onChange={(e) => setTaxId(e.target.value)}
          regex={regexPatterns.cnpj}
          maskFormat="99.999.999/9999-99"
        /></Col>

        <Col><Input label={t("companies.email")} maxLength={30} required value={Email} onChange={(e) => setEmail(e.target.value)}
          regex={regexPatterns.email}
        /></Col>
      </Row>
      <Row>
        <Col><Input label={t("companies.phone")} required value={Phone} onChange={(e) => setPhone(e.target.value)}
          regex={regexPatterns.phone}
          maskFormat="+99 (99) 99999-9999"
        /></Col>
        <Col><Input label={t("companies.address")} maxLength={100} required value={Adress} onChange={(e) => setAdress(e.target.value)} /></Col>
      </Row>
      <Row>

        <Col><Input label={t("companies.zipcode")} value={ZipCode} onChange={(e) => setZipCode(e.target.value)}
          regex={regexPatterns.cep}
          maskFormat="99999-999"
        /></Col>

        <Col>
          <Select
            label={t("companies.is_active")}
            value={IsActive}
            onChange={(e) => setIsActive(e.target.value)}
            options={[
              { value: "true", label: t("status.enabled") },
              { value: "false", label: t("status.disabled") },
            ]}
          />
        </Col>
      </Row>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" type="button" onClick={onCancel}>{t("actions.cancel")}</Button>
        <Button type="submit" disabled={canSave}>{t("actions.save")}</Button>
      </div>
    </form>
  );
};