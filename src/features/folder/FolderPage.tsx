import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { Folder } from "./types";
import { FolderForm } from "./FolderForm";
import React, { useState } from "react";
import { useFolder } from "./useFolder";
import { useTranslation } from "react-i18next";


const FolderPage: React.FC = () => {
  const { activeFolder, create, update, softDelete } = useFolder();
  const modal = useModal();
  const [editing, setEditing] = useState<Folder | null>(null);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();


  const Columns = (onEdit: (c: Folder) => void, onDelete: (id: string) => void): ColumnDef<Folder>[] => [
    { key: "Name", header: t("folders.name") },
    { key: "FolderId", header: t("folders.parent_folder") },
    { key: "UserId", header: t("folders.user") },
    { key: "IsActive", header: t("folders.is_active") },
    {
      key: "actions",
      header: t("actions.actions", "Ações"),
      width: "160px",
      render: (row) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button title={t("actions.edit")} onClick={() => onEdit(row)}><FiEdit /></button>
          <button title={t("actions.delete")} onClick={() => onDelete(row.FolderId)}><FiTrash2 /></button>
        </div>
      )
    }
  ];

  const filteredFolder = React.useMemo(() => {
    if (!query) return activeFolder;

    const searchQuery = query.toLowerCase();
    return activeFolder.filter(folder => {
      const searchableText = [
        folder.Name,
        folder.FolderId,
        folder.UserId,
        folder.IsActive,


      ].filter(Boolean).join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [activeFolder, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Folder) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.FolderId, payload);
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
    <PageLayout title={t("folders.title")} actions={<Button onClick={handleAdd}><FiPlus />&nbsp;{t("folders.add_folder")}</Button>}>
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("folders.search_folders")}
      />
      <DataTable columns={columns} data={filteredFolder} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("folders.edit_folder") : t("folders.add_folder")}>
        <FolderForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default FolderPage;