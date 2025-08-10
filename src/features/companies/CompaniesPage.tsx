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

const Columns = (onEdit: (c: Company) => void, onDelete: (id: string) => void): ColumnDef<Company>[] => [
  { key: "name", header: "Nome" },
  { key: "cnpj", header: "CNPJ" },
  { key: "email", header: "E-mail" },
  {
    key: "actions",
    header: "Ações",
    width: "160px",
    render: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button title="Editar" onClick={() => onEdit(row)}><FiEdit /></button>
        <button title="Excluir" onClick={() => onDelete(row.id)}><FiTrash2 /></button>
      </div>
    )
  }
];

const CompaniesPage: React.FC = () => {
  const { activeCompanies, query, setQuery, create, update, softDelete } = useCompanies();
  const modal = useModal();
  const [editing, setEditing] = useState<Company | null>(null);

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
      update(editing.id, payload);
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
    <PageLayout title="Empresas" actions={<Button onClick={handleAdd}><FiPlus />&nbsp;Adicionar</Button>}>
      <FilterBar value={query} onChange={setQuery} />
      <DataTable columns={columns} data={activeCompanies} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? "Editar Empresa" : "Adicionar Empresa"}>
        <CompanyForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default CompaniesPage;
