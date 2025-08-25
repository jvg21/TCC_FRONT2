import React, { useState } from "react";
import { useCompanies } from "./useCompanies";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { CompanyForm } from "./CompanyForm";
import { FiEdit, FiPlus, FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import type { Company } from "./types";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import { useTranslation } from "react-i18next";
import { regexPatterns } from "../../utils/regexUtils";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { useAuthContext } from "../../context/AuthContext";
import { ActiveLabel } from "../../components/lib/ActiveLabel";

const CompaniesPage: React.FC = () => {
  const { activeCompanies, deactiveCompanies, query, setQuery, create, update, softDelete } = useCompanies();
  const [searchStatus, setSearchStatus] = useState<number>(1)
  const Companies = searchStatus === 1 ? activeCompanies : searchStatus === 2 ? deactiveCompanies : [...activeCompanies, ...deactiveCompanies]
  const [editing, setEditing] = useState<Company | null>(null);

  const modal = useModal();
  const { t } = useTranslation();
  const { userProfile } = useAuthContext()


  // adicionado o metodo render para as colunas -------------------------------------------
  const Columns = (onEdit: (c: Company) => void, onToggleStatus: (id: number) => void): ColumnDef<Company>[] => [
    { key: "Name", header: t("companies.name") },
    {
      key: "TaxId",
      header: t("companies.tax_id"),
      //aplica a marsks no CNPJ -------------------------------------------
      render: (row) => regexPatterns.applyMask(row.TaxId || "", "99.999.999/9999-99") || "-"
    },
    {
      key: "Email",
      header: t("companies.email"),
      render: (row) => row.Email || "-"
    },
    {
      key: "Phone",
      header: t("companies.phone"),
      render: (row) => regexPatterns.applyMask(row.Phone || "", "+99 (99) 99999-9999") || "-"
    },
    {
      key: "Adress",
      header: t("companies.address"),
      render: (row) => row.Adress || "-"
    },
    {
      key: "ZipCode",
      header: t("companies.zipcode"),
      render: (row) => regexPatterns.applyMask(row.ZipCode || "", "99999-999") || "-"
    },
    {
      key: "IsActive",
      header: t("companies.is_active"),
      render: (row) => ( <ActiveLabel IsActive={row.IsActive}/>)
    },
    { 
      key: "actions",
      header: t("actions.actions"),
      render: (row) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button title={t("actions.edit")} onClick={() => onEdit(row)}>
            <FiEdit />
          </button>
          <button
            title={row.IsActive ? t("actions.deactivate") : t("actions.activate")}
            onClick={() => onToggleStatus(row.CompanyId)}
          >
            {
              row.IsActive ? <FiMinusCircle /> : <FiPlusCircle />
            }
          </button>
        </div>
      )
    }
  ];

  const filteredCompanies = React.useMemo(() => {
    if (!query) return Companies;

    const searchQuery = query.toLowerCase();

    return Companies.filter(company => {
      const searchableText = [
        company.Name || "",
        company.TaxId || "",
        company.Email || "",
        company.Phone || "",
        company.ZipCode || "",
        company.Adress || "",
      ].join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [Companies, query]);

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
      {
        userProfile &&
        <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
      }
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