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
import { useTranslation } from "react-i18next";

const DocumentPage: React.FC = () => {
  const { activeDocument, create, update, softDelete } = useDocument();
  const modal = useModal();
  const [editing, setEditing] = useState<Document | null>(null);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  
  const Columns = (onEdit: (c: Document) => void, onToggleStatus: (id: number) => void): ColumnDef<Document>[] => [
    { key: "Title", header: t("documents.title_field"), render: (row) => row.Title || "-" }, 
    { key: "FolderId", header: t("documents.folder"), render: (row) => row.FolderId || "-" },
    { key: "UserId", header: t("documents.creator"), render: (row) => row.UserId || "-" },
    {
      key: "IsActive",
      header: t("documents.is_active"),
      render: (row) => (
        <span style={{
          color: row.IsActive ? '#28a745' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {row.IsActive ? t("status.enabled") : t("status.disabled")}
        </span>
      )
    },
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
            onClick={() => onToggleStatus(row.DocumentId)}
          >
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ];

  const filteredDocument = React.useMemo(() => {
    if (!query) return activeDocument;

    const searchQuery = query.toLowerCase();
    
    return activeDocument.filter(document => {
      const searchableText = [
        document.Title || "",
        document.Content || "",
      ].join(" ").toLowerCase();

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

  const handleSave = async (payload: any) => {
    try {
      if (editing) {
        await update(editing.DocumentId, payload);
      } else {
        await create(payload);
      }
      modal.close();
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await softDelete(id);
    } catch (error) {
      console.error("Erro ao alterar status do documento:", error);
    }
  };

  const columns = Columns(handleEdit, handleToggleStatus);

  return (
    <PageLayout 
      title={t("documents.title")} 
      actions={
        <Button onClick={handleAdd}>
          <FiPlus />&nbsp;{t("documents.add_document")}
        </Button>
      }
    >
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("documents.search_documents")}
      />
      <DataTable columns={columns} data={filteredDocument} />
      <Modal 
        isOpen={modal.isOpen} 
        onClose={modal.close} 
        title={editing ? t("documents.edit_document") : t("documents.add_document")}
      >
        <DocumentForm 
          initial={editing ?? undefined} 
          onCancel={modal.close} 
          onSave={handleSave} 
        />
      </Modal>
    </PageLayout>
  );
};

export default DocumentPage;