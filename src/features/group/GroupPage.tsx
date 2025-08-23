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
import { useTranslation } from "react-i18next";


const GroupPage: React.FC = () => {
  const { activeGroup, create, update, softDelete } = useGroup();
  const modal = useModal();
  const [editing, setEditing] = useState<Group | null>(null);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const Columns = (onEdit: (c: Group) => void, onDelete: (id: string) => void): ColumnDef<Group>[] => [
  { key: "Name", header: t("groups.name"), render: (row) => row.Name || "-" },
    { key: "Description", header: t("groups.description"), render: (row) => row.Description || "-" },
    {
      key: "IsActive",
      header: t("groups.is_active"),
      // Renderiza o status com cores -------------------------------------------
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
                //onClick={() => onToggleStatus(row.CompanyId)}
                onClick={() => {}}
              >
                <FiTrash2 />
              </button>
            </div>
          )
        }
    ];
  const filteredGroup = React.useMemo(() => {
    if (!query) return activeGroup;
    
    const searchQuery = query.toLowerCase();
    return activeGroup.filter(group => {
      const searchableText = [
        group.Name || "",
        group.Description || "",
      ].join(" ").toLowerCase();
      
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
    <PageLayout title={t("groups.title")} actions={<Button onClick={handleAdd}><FiPlus />&nbsp;{t("groups.add_group")}</Button>}>
      <FilterBar 
        columns={columns} 
        value={query} 
        onChange={setQuery}
        placeholder={t("groups.search_groups")}
      />
      <DataTable columns={columns} data={filteredGroup} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("groups.edit_group") : t("groups.add_group")}>
        <GroupForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default GroupPage;