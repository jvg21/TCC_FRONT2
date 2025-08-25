import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiEdit, FiPlus, FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { Folder } from "./types";
import { FolderForm } from "./FolderForm";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFolder } from "./useFolder";
import { useUser } from "../user/useUser";
import { useAuthContext } from "../../context/AuthContext";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";


const FolderPage: React.FC = () => {
  const { activeFolder, deactiveFolder, create, update, softDelete } = useFolder();
  const [searchStatus, setSearchStatus] = useState<number>(1)
  const Folder = searchStatus === 1 ? activeFolder : searchStatus === 2 ? deactiveFolder : [...activeFolder, ...deactiveFolder]
  const [editing, setEditing] = useState<Folder | null>(null);
  const [query, setQuery] = useState("");
  const modal = useModal();
  const { t } = useTranslation();
  const { userProfile } = useAuthContext()


  const { activeUser } = useUser();


  const Columns = (onEdit: (c: Folder) => void, onToggleStatus: (id: number) => void): ColumnDef<Folder>[] => {
    const baseCols: ColumnDef<Folder>[] = [
      { key: "Name", header: t("folders.name"), render: (row) => row.Name || "-" },
      {
        key: "ParentFolderId",
        header: t("folders.parent_folder"),
        render: (row) => {
          if (!row.ParentFolderId) return t("folders.no_parent_folder");
          const parentFolder = Folder.find(f => f.FolderId === row.ParentFolderId);
          return parentFolder ? parentFolder.Name : row.ParentFolderId.toString();
        }
      },
      {
        key: "UserId", header: t("folders.user"), render: (row) => {
          const userObj = activeUser.find(f => f.UserId === row.UserId);
          return userObj ? userObj.Name : "-";
        }
      },
      {
        key: "ValidatorId", header: t("folders.validator"), render: (row) => {
          const userObj = activeUser.find(f => f.UserId === row.ValidatorId);
          return userObj ? userObj.Name : "-";
        }
      },
      {
        key: "IsActive",
        header: t("folders.is_active"),
        render: (row) => <ActiveLabel IsActive={row.IsActive} />
      },
    ]
    if (userProfile) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => (
          <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.FolderId} />
        )
      });
    }
    return baseCols
  }

  const filteredFolder = React.useMemo(() => {
    if (!query) return Folder;

    const searchQuery = query.toLowerCase();
    return Folder.filter(folder => {
      const parentFolderName = folder.ParentFolderId
        ? Folder.find(f => f.FolderId === folder.ParentFolderId)?.Name || ""
        : "";

      const searchableText = [
        folder.Name || "",
        parentFolderName,
        folder.ValidatorId?.toString() || "",
        folder.UserId?.toString() || ""
      ].join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [Folder, query]);

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

  const handleToggleStatus = async (id: number) => {
    try {
      await softDelete(id);
    } catch (error) {
      console.error("Erro ao alterar status da folder:", error);
    }
  };

  const columns = Columns(handleEdit, handleToggleStatus);

  return (
    <PageLayout title={t("folders.title")} actions={<Button onClick={handleAdd}><FiPlus />&nbsp;{t("folders.add_folder")}</Button>}>
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("folders.search_folders")}
      />
      {
        userProfile &&
        <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
      }
      <DataTable columns={columns} data={filteredFolder} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("folders.edit_folder") : t("folders.add_folder")}>
        <FolderForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default FolderPage;