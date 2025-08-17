import React, { useState } from "react";
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
  const { activeCompanies, query, setQuery, create, update, softDelete } = useCompanies();
  const modal = useModal();
  const [editing, setEditing] = useState<Company | null>(null);

  const { t } = useTranslation();

  const Columns = (onEdit: (c: Company) => void, onToggleStatus: (id: number) => void): ColumnDef<Company>[] => [
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
          <button title={t("actions.edit")} onClick={() => onEdit(row)}>
            <FiEdit />
          </button>
          <button 
            title={row.IsActive ? t("actions.deactivate") : t("actions.activate")} 
            onClick={() => onToggleStatus(row.CompanyId)}
          >
            <FiTrash2 />
          </button>
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

  const handleSave = async (payload: any) => {
    try {
      if (editing) {
        await update(editing.CompanyId, payload);
      } else {
        await create(payload);
      }
      modal.close();
    } catch (error) {
      // Error já é tratado no hook useCompanies
      console.error("Erro ao salvar empresa:", error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await softDelete(id);
    } catch (error) {
      // Error já é tratado no hook useCompanies
      console.error("Erro ao alterar status da empresa:", error);
    }
  };

  const columns = Columns(handleEdit, handleToggleStatus);

  return (
    <PageLayout 
      title={t("companies.title")} 
      actions={
        <Button onClick={handleAdd}>
          <FiPlus />&nbsp;{t("companies.add_company")}
        </Button>
      }
    >
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("companies.search_companies")}
      />
      <DataTable columns={columns} data={filteredCompanies} />
      <Modal 
        isOpen={modal.isOpen} 
        onClose={modal.close} 
        title={editing ? t("companies.edit_company") : t("companies.add_company")}
      >
        <CompanyForm 
          initial={editing ?? undefined} 
          onCancel={modal.close} 
          onSave={handleSave} 
        />
      </Modal>
    </PageLayout>
  );
};

export default CompaniesPage;