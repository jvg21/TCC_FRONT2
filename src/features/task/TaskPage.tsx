import React, { useState, useEffect } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import type { Task } from "./types";
import { TaskForm } from "./TaskForm";
import { useTask } from "./useTask";
import { useTranslation } from "react-i18next";
import { getTaskStatus } from "../../enum/taskStatus";
import { useUser } from "../user/useUser";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { useAuthContext } from "../../context/AuthContext";
import { ActionButtons } from "../../components/lib/ActionButtons";
import { getTaskPriority } from "../../enum/taskPriority";
import { useLanguage } from "../../context/LanguageContext";
import { dateUtils } from "../../utils/dateUtils";

const TaskPage: React.FC = () => {
  const { activeTask, deactiveTask, create, update, softDelete } = useTask();
  const [searchStatus, setSearchStatus] = useState<number>(1);
  const Task = searchStatus === 1 ? activeTask : searchStatus === 2 ? deactiveTask : [...activeTask, ...deactiveTask];
  const [editing, setEditing] = useState<Task | null>(null);
  const [query, setQuery] = useState("");

  const modal = useModal();
  const { t } = useTranslation();
  const { activeUser } = useUser();
  const { userProfile } = useAuthContext();
  const { currentLanguage } = useLanguage();

  // ==== Paginação (adição) ====
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const resetToFirstPage = () => setCurrentPage(1);

  useEffect(() => {
    resetToFirstPage();
  }, [query, searchStatus]);

  const paginate = (rows: Task[]) => {
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  };

  const PaginationBar: React.FC<{ total: number }> = ({ total }) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [totalPages]);

    if (total === 0) return null;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 12 }}>
        <div style={{ fontSize: 14, color: '#666' }}>
          {t("pagination.showing") || "Exibindo"} {(currentPage - 1) * pageSize + 1}
          –{Math.min(currentPage * pageSize, total)} {t("pagination.of") || "de"} {total}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, color: '#666' }}>
            {t("pagination.rows_per_page") || "Linhas por página"}:
          </label>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); resetToFirstPage(); }}
            style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 6 }}
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <Button variant="ghost" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <FiChevronLeft /> {t("pagination.prev") || "Anterior"}
          </Button>
          <div style={{ minWidth: 60, textAlign: 'center' }}>
            {currentPage} / {totalPages}
          </div>
          <Button variant="ghost" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
            {t("pagination.next") || "Próxima"} <FiChevronRight />
          </Button>
        </div>
      </div>
    );
  };
  // ==== fim paginação ====

  const Columns = (onEdit: (c: Task) => void, onToggleStatus: (id: number) => void): ColumnDef<Task>[] => {
    const baseCols: ColumnDef<Task>[] = [
      { key: "Title", header: t("tasks.title_field"), render: (row) => row.Title || "-" },
      { key: "Description", header: t("tasks.description"), render: (row) => row.Description || "-" },
      {
        key: "DueDate",
        header: t("tasks.due_date"),
        render: (row) => dateUtils.formatDateShort(row.DueDate, currentLanguage)
      },
      {
        key: "Priority", header: t("tasks.priority"), render: (row) => {
          const priorityObj = getTaskPriority(t).find(p => p.value === row.Priority?.toString());
          return priorityObj ? priorityObj.label : "-";
        }
      },
      {
        key: "Status", header: t("tasks.status"), render: (row) => {
        const statusObj = getTaskStatus(t).find(p => p.value === row.Status?.toString());
          return statusObj ? statusObj.label : "-";
        }
      },
      {
        key: "AssigneeId", header: t("tasks.assignee"), render: (row) => {
          const assignee = activeUser.filter((a) => a.UserId === row.AssigneeId)[0];
          return assignee ? assignee.Name : "-";
        }
      },
      {
        key: "UserId", header: t("tasks.creator"), render: (row) => {
          const creator = activeUser.filter((a) => a.UserId === row.UserId)[0];
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
        String(task.AssigneeId || ""),
        String(task.UserId || ""),
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

      {/* Tabela + Paginação */}
      {(() => {
        const total = filteredTask.length;
        const page = paginate(filteredTask);
        return (
          <>
            <DataTable columns={columns} data={page} />
            <PaginationBar total={total} />
          </>
        );
      })()}

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("tasks.edit_task") : t("tasks.add_task")}>
        <TaskForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default TaskPage;