import React, { useState } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import { DocumentForm } from "./DocumentForm";
import { useDocument } from "./useDocument";
import type { Document } from "./types";




const Columns = (onEdit: (c: Document) => void, onDelete: (id: string) => void): ColumnDef<Document>[] => [
  { key: "Title", header: "Titulo" },
  { key: "Content", header: "Content" },
  { key: "FolderId", header: "FolderId" },
  { key: "UserId", header: "UserId" },
  { key: "IsActive", header: "IsActive" },
  {
    key: "actions",
    header: "Ações",
    width: "160px",
    render: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button title="Editar" onClick={() => onEdit(row)}><FiEdit /></button>
        <button title="Excluir" onClick={() => onDelete(row.DocumentId)}><FiTrash2 /></button>
      </div>
    )
  }
];

const DocumentPage: React.FC = () => {
  const { activeDocument, create, update, softDelete } = useDocument();
  const modal = useModal();
  const [editing, setEditing] = useState<Document | null>(null);
  const [query, setQuery] = useState("");

  // Filtrar dados baseado na busca global
  const filteredDocument = React.useMemo(() => {
    if (!query) return activeDocument;
    
    const searchQuery = query.toLowerCase();
    return activeDocument.filter(document => {
      const searchableText = [
        document.Title,
        document.Content,
        document.FolderId,
        document.UserId,
        document.IsActive,
      ].filter(Boolean).join(" ").toLowerCase();
      
      return searchableText.includes(searchQuery);
    });
  }, [activeDocument, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Document) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.DocumentId, payload);
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
    <PageLayout title="Documentos" actions={<Button onClick={handleAdd}><FiPlus />&nbsp;Adicionar</Button>}>
      <FilterBar 
        columns={columns} 
        value={query} 
        onChange={setQuery}
        placeholder="Buscar documento..."
      />
      <DataTable columns={columns} data={filteredDocument} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? "Editar Documento" : "Adicionar Documento"}>
        <DocumentForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default DocumentPage;