import React, { useState } from "react";

import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { User } from "./types";
import { UserForm } from "./UserForm";
import { useUser } from "./useUser";
import { useTranslation } from "react-i18next";



const UserPage: React.FC = () => {
  const { activeUser, create, update, softDelete } = useUser();
  const modal = useModal();
  const [editing, setEditing] = useState<User | null>(null);
  const [query, setQuery] = useState("");

  const { t } = useTranslation();
  const Columns = (onEdit: (c: User) => void, onDelete: (id: string) => void): ColumnDef<User>[] => [
    { key: "Name", header: t("users.name") },
    { key: "Profile", header: t("users.profile") },
    { key: "Email", header: t("users.email") },
    { key: "IsActive", header: t("users.is_active") },

    {
      key: "actions",
      header: t("actions.actions", "Ações"),
      width: "160px",
      render: (row) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button title={t("actions.edit")} onClick={() => onEdit(row)}><FiEdit /></button>
          <button title={t("actions.delete")} onClick={() => onDelete(row.UserId)}><FiTrash2 /></button>
        </div>
      )
    }
  ];

  // Filtrar dados baseado na busca global
  const filteredUser = React.useMemo(() => {
    if (!query) return activeUser;

    const searchQuery = query.toLowerCase();
    return activeUser.filter(user => {
      const searchableText = [
        user.Name,
        user.Profile,
        user.Email,
        user.IsActive,
      ].filter(Boolean).join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [activeUser, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: User) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.UserId, payload);
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
    <PageLayout title={t("users.title")} actions={<Button onClick={handleAdd}><FiPlus />&nbsp;{t("users.add_user")}</Button>}>
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("users.search_users")}
      />
      <DataTable columns={columns} data={filteredUser} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("users.edit_user") : t("users.add_user")}>
        <UserForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default UserPage;