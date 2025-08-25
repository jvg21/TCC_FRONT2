import React, { useState } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import {  FiPlus } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { Task } from "./types";
import { TaskForm } from "./TaskForm";
import { useTask } from "./useTask";
import { useTranslation } from "react-i18next";
import { taskStatus } from "../../enum/taskStatus";
import { useUser } from "../user/useUser";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { useAuthContext } from "../../context/AuthContext";
import { ActionButtons } from "../../components/lib/ActionButtons";


const TaskPage: React.FC = () => {
  const { activeTask, deactiveTask, create, update, softDelete } = useTask();
  const [searchStatus, setSearchStatus] = useState<number>(1)
  const Task = searchStatus === 1 ? activeTask : searchStatus === 2 ? deactiveTask : [...activeTask, ...deactiveTask]
  const [editing, setEditing] = useState<Task | null>(null);
  const [query, setQuery] = useState("");

  const modal = useModal();
  const { t } = useTranslation();
  const { activeUser } = useUser()
  const { userProfile } = useAuthContext()

  const Columns = (onEdit: (c: Task) => void, onToggleStatus: (id: number) => void): ColumnDef<Task>[] => {
    const baseCols: ColumnDef<Task>[] = [
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
    ];

    if (userProfile) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => (
          <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.TaskId} />
        )
      });
    }
    return baseCols;
  };

  const filteredTask = React.useMemo(() => {
    if (!query) return Task;

    const searchQuery = query.toLowerCase();
    return Task.filter(task => {
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
  }, [Task, query]);

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

  const handleDelete = (id: number) => {
    softDelete(id);
  };

  const columns = Columns(handleEdit, handleDelete);

  return (
    <PageLayout title={t("tasks.title")} actions={<Button disabled={!userProfile} onClick={handleAdd}><FiPlus />&nbsp;{t("tasks.add_task")}</Button>}>
      <FilterBar
        columns={columns}
        value={query}
        onChange={setQuery}
        placeholder={t("tasks.search_tasks")}
      />
      {
        userProfile &&
        <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
      }
      <DataTable columns={columns} data={filteredTask} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("tasks.edit_task") : t("tasks.add_task")}>
        <TaskForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default TaskPage;