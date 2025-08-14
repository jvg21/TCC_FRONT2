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

const Columns = (onEdit: (c: Company) => void, onDelete: (id: string) => void): ColumnDef<Company>[] => [
  { key: "Name", header: "Nome" },
  { key: "TaxId", header: "CNPJ" },
  { key: "Email", header: "E-mail" },
  { key: "IsActive", header: "IsActive" },
  {
    key: "actions",
    header: "Ações",
    width: "160px",
    render: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button title="Editar" onClick={() => onEdit(row)}><FiEdit /></button>
        <button title="Excluir" onClick={() => onDelete(row.CompanyId)}><FiTrash2 /></button>
      </div>
    )
  }
];


const CompaniesPage: React.FC = () => {
  const { activeCompanies, create, update, softDelete } = useCompanies();
  const modal = useModal();
  const [editing, setEditing] = useState<Company | null>(null);
  const [query, setQuery] = useState("");

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
    <PageLayout title="Empresas" actions={<Button onClick={handleAdd}><FiPlus />&nbsp;Adicionar</Button>}>
      <FilterBar 
        columns={columns} 
        value={query} 
        onChange={setQuery}
        placeholder="Buscar empresas..."
      />
      <DataTable columns={columns} data={filteredCompanies} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? "Editar Empresa" : "Adicionar Empresa"}>
        <CompanyForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default CompaniesPage;