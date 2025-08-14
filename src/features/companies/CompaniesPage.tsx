import React, { useEffect, useState } from "react";
import { useCompanies } from "./useCompanies";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { CompanyForm } from "./CompanyForm";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import type { Company } from "./types";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import { useTranslation } from "react-i18next";


const CompaniesPage: React.FC = () => {
  const { activeCompanies, create, update, softDelete } = useCompanies();
  const modal = useModal();
  const [editing, setEditing] = useState<Company | null>(null);
  const [query, setQuery] = useState("");

  const { t } = useTranslation();

  const Columns = (onEdit: (c: Company) => void, onDelete: (id: string) => void): ColumnDef<Company>[] => [
    { key: "Name", header: t("companies.name") },
    { key: "TaxId", header: t("companies.tax_id") },
    { key: "Email", header: t("companies.email") },
    { key: "IsActive", header: t("companies.is_active") },
    {
      key: "actions",
      header: t("actions.actions"),
      width: "160px",
      render: (row) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button title={t("actions.edit")} onClick={() => onEdit(row)}><FiEdit /></button>
          <button title={t("actions.delete")} onClick={() => onDelete(row.CompanyId)}><FiTrash2 /></button>
        </div>
      )
    }
  ];


  // Filtrar dados baseado na busca global
  const filteredCompanies = React.useMemo(() => {
    if (!query) return activeCompanies;

    const searchQuery = query.toLowerCase();
    return activeCompanies.filter(company => {
      const searchableText = [
        company.Name,
        company.TaxId,
        company.Email,
        company.Phone,
        company.Adress,
        company.IsActive,
      ].filter(Boolean).join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [activeCompanies, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Company) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.CompanyId, payload);
    } else {
      create(payload);
    }
    modal.close();
  };

  const handleDelete = (id: string) => {
    softDelete(id);
  };

  const columns = Columns(handleEdit, handleDelete);

  return (
    <PageLayout title={t("companies.title")}  actions={<Button onClick={handleAdd}><FiPlus />&nbsp;{t("companies.add_company")}</Button>}>
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("companies.search_companies")}
      />
      <DataTable columns={columns} data={filteredCompanies} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("companies.edit_company") : t("companies.add_company")}>
        <CompanyForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default CompaniesPage;