import React, { useState } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { Task } from "./types";
import { TaskForm } from "./TaskForm";
import { useTask } from "./useTask";
import { useTranslation } from "react-i18next";
import { taskStatus } from "../../enum/taskStatus";
import { useUser } from "../user/useUser";


const TaskPage: React.FC = () => {
  const { activeTask, create, update, softDelete } = useTask();
  const modal = useModal();
  const [editing, setEditing] = useState<Task | null>(null);
  const [query, setQuery] = useState("");

  const { activeUser } = useUser()

  const { t } = useTranslation();
  const Columns = (onEdit: (c: Task) => void, onDelete: (id: string) => void): ColumnDef<Task>[] => [
    { key: "Title", header: t("tasks.title_field"), render: (row) => row.Title || "-" },
    { key: "Description", header: t("tasks.description"), render: (row) => row.Description || "-" },
    { key: "DueDate", header: t("tasks.due_date"), render: (row) => row.DueDate || "-" },
    {
      key: "Priority", header: t("tasks.priority"), render: (row) => {
        const priorityObj = taskStatus.find(p => p.value === row.Priority?.toString())
        return priorityObj ? priorityObj.label : "-";
      }
    },
    {
      key: "Status", header: t("tasks.status"), render: (row) => {
        const statusObj = taskStatus.find(p => p.value === row.Status?.toString())
        return statusObj ? statusObj.label : "-";
      }
    },
    {
      key: "AssigneeId", header: t("tasks.assignee"), render: (row) => {
        const assignee = activeUser.filter((a) => a.UserId === row.AssigneeId)[0]
        return assignee ? assignee.Name : "-";
      }
    },
    {
      key: "UserId", header: t("tasks.creator"), render: (row) => {
        const creator = activeUser.filter((a) => a.UserId === row.UserId)[0]
        return creator ? creator.Name : "-";
      }
    },
    {
      key: "IsActive",
      header: t("companies.is_active"),
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
            //onClick={() => onToggleStatus(row.TaskId)}
            onClick={() => { }}
          >
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ];

  const filteredTask = React.useMemo(() => {
    if (!query) return activeTask;

    const searchQuery = query.toLowerCase();
    return activeTask.filter(task => {
      const searchableText = [
        task.Title || "",
        task.Description || "",
        task.DueDate || "",
        task.Priority || "",
        task.Status || "",
        task.AssigneeId || "",
        task.UserId || "",
      ].join(" ").toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [activeTask, query]);

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Task) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.TaskId, payload);
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
    <PageLayout title={t("tasks.title")} actions={<Button onClick={handleAdd}><FiPlus />&nbsp;{t("tasks.add_task")}</Button>}>
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("tasks.search_tasks")}
      />
      <DataTable columns={columns} data={filteredTask} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("tasks.edit_task") : t("tasks.add_task")}>
        <TaskForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default TaskPage;