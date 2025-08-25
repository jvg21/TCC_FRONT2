import React, { useState } from "react";

import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiPlus } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { User } from "./types";
import { UserForm } from "./UserForm";
import { useUser } from "./useUser";
import { useTranslation } from "react-i18next";
import { profiles } from "../../enum/userProfile";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { useAuthContext } from "../../context/AuthContext";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";

const UserPage: React.FC = () => {
  const { activeUser, deactiveUser, create, update, softDelete } = useUser();
  const [searchStatus, setSearchStatus] = useState<number>(1)
  const User = searchStatus === 1 ? activeUser : searchStatus === 2 ? deactiveUser : [...activeUser, ...deactiveUser]
  const [editing, setEditing] = useState<User | null>(null);
  const [query, setQuery] = useState("");

  const modal = useModal();
  const { t } = useTranslation();
  const { userProfile } = useAuthContext()

  const Columns = (onEdit: (c: User) => void, onToggleStatus: (id: number) => void): ColumnDef<User>[] => {
    const baseCols: ColumnDef<User>[] = [
      { key: "Name", header: t("users.name"), render: (row) => row.Name || "-" },
      {
        key: "Profile", header: t("users.profile"), render: (row) => {
          const profileObj = profiles.find(p => p.value === row.Profile.toString());
          return profileObj ? profileObj.label : "-";
        }
      },
      { key: "Email", header: t("users.email"), render: (row) => row.Email || "-" },
      {
        key: "IsActive",
        header: t("companies.is_active"),
        render: (row) => <ActiveLabel IsActive={row.IsActive} />
      },
    ];
    if (userProfile) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => (
          <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.UserId} />
        )
      });
    }
    return baseCols;
  };

  const filteredUser = React.useMemo(() => {
    if (!query) return User;

    const searchQuery = query.toLowerCase();
    return User.filter(user => {
      const searchableText = [
        user.Name || "",
        user.Profile || "",
        user.Email || "",
      ].join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [User, query]);

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

  const handleDelete = (id: number) => {
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
      {
        userProfile &&
        <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
      }
      <DataTable columns={columns} data={filteredUser} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("users.edit_user") : t("users.add_user")}>
        <UserForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default UserPage;