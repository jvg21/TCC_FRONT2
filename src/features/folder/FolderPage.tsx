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
import { useTranslation } from "react-i18next";
import { useFolder } from "./useFolder";


const FolderPage: React.FC = () => {
  const { activeFolder, create, update, softDelete } = useFolder();
  const modal = useModal();
  const [editing, setEditing] = useState<Folder | null>(null);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();
  const Columns = (onEdit: (c: Folder) => void, onDelete: (id: number) => void): ColumnDef<Folder>[] => [
    { key: "Name", header: t("folders.name"), render: (row) => row.Name || "-" },
    {
      key: "ParentFolderId",
      header: t("folders.parent_folder"),
      render: (row) => {
        if (!row.ParentFolderId) return t("folders.no_parent_folder") || "Nenhuma";
        const parentFolder = activeFolder.find(f => f.FolderId === row.ParentFolderId);
        return parentFolder ? parentFolder.Name : row.ParentFolderId.toString();
      }
    },
    { key: "UserId", header: t("folders.user"), render: (row) => row.UserId || "-" },
    { key: "ValidatorId", header: t("folders.validator"), render: (row) => row.ValidatorId || "-" },
    {
      key: "IsActive",
      header: t("folders.is_active"),
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
            onClick={() => softDelete(row.FolderId)}
          >
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ];

  // Correção na função de filtro
  const filteredFolder = React.useMemo(() => {
    if (!query) return activeFolder;

    const searchQuery = query.toLowerCase();
    return activeFolder.filter(folder => {
      const parentFolderName = folder.ParentFolderId
        ? activeFolder.find(f => f.FolderId === folder.ParentFolderId)?.Name || ""
        : "";

      const searchableText = [
        folder.Name || "",
        parentFolderName,
        folder.ValidatorId?.toString() || "",
        folder.UserId?.toString() || ""
      ].join(" ").toLowerCase();

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

  const handleDelete = (id: number) => {
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