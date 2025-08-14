import React, { useState } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { Group } from "./types";
import { GroupForm } from "./GroupForm";
import { useGroup } from "./useGroup";



const Columns = (onEdit: (c: Group) => void, onDelete: (id: string) => void): ColumnDef<Group>[] => [
  { key: "Name", header: "Nome" },
  { key: "Description", header: "Description" },
  { key: "IsActive", header: "IsActive" },
  {
    key: "actions",
    header: "Ações",
    width: "160px",
    render: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button title="Editar" onClick={() => onEdit(row)}><FiEdit /></button>
        <button title="Excluir" onClick={() => onDelete(row.GroupId)}><FiTrash2 /></button>
      </div>
    )
  }
];

const GroupPage: React.FC = () => {
  const { activeGroup, create, update, softDelete } = useGroup();
  const modal = useModal();
  const [editing, setEditing] = useState<Group | null>(null);
  const [query, setQuery] = useState("");

  // Filtrar dados baseado na busca global
  const filteredGroup = React.useMemo(() => {
    if (!query) return activeGroup;
    
    const searchQuery = query.toLowerCase();
    return activeGroup.filter(group => {
      const searchableText = [
        group.Name,
        group.Description,
        group.IsActive,
      ].filter(Boolean).join(" ").toLowerCase();
      
      return searchableText.includes(searchQuery);
    });
  }, [activeGroup, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Group) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.GroupId, payload);
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
    <PageLayout title="Grupos" actions={<Button onClick={handleAdd}><FiPlus />&nbsp;Adicionar</Button>}>
      <FilterBar 
        columns={columns} 
        value={query} 
        onChange={setQuery}
        placeholder="Buscar grupos..."
      />
      <DataTable columns={columns} data={filteredGroup} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? "Editar Grupo" : "Adicionar Grupo"}>
        <GroupForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default GroupPage;