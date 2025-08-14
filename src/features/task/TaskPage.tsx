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



const Columns = (onEdit: (c: Task) => void, onDelete: (id: string) => void): ColumnDef<Task>[] => [
  { key: "Title", header: "Titulo" },
  { key: "Description", header: "Description" },
  { key: "DueDate", header: "DueDate" },
  { key: "Priority", header: "Priority" },
  { key: "Status", header: "Status" },
  { key: "AssigneeId", header: "AssigneeId" },
  { key: "UserId", header: "UserId" },
  { key: "IsActive", header: "IsActive" },
  {
    key: "actions",
    header: "Ações",
    width: "160px",
    render: (row) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button title="Editar" onClick={() => onEdit(row)}><FiEdit /></button>
        <button title="Excluir" onClick={() => onDelete(row.TaskId)}><FiTrash2 /></button>
      </div>
    )
  }
];

const TaskPage: React.FC = () => {
  const {activeTask, create, update, softDelete } = useTask();
  const modal = useModal();
  const [editing, setEditing] = useState<Task | null>(null);
  const [query, setQuery] = useState("");

  // Filtrar dados baseado na busca global
  const filteredTask = React.useMemo(() => {
    if (!query) return activeTask;
    
    const searchQuery = query.toLowerCase();
    return activeTask.filter(task => {
      const searchableText = [
        task.Title,
        task.Description,
        task.DueDate,
        task.Priority,
        task.Status,
        task.AssigneeId,
        task.UserId,
      ].filter(Boolean).join(" ").toLowerCase();
      
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
    <PageLayout title="Tarefas" actions={<Button onClick={handleAdd}><FiPlus />&nbsp;Adicionar</Button>}>
      <FilterBar 
        columns={columns} 
        value={query} 
        onChange={setQuery}
        placeholder="Buscar tarefa..."
      />
      <DataTable columns={columns} data={filteredTask} />
      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? "Editar Tarefa" : "Adicionar Tarefa"}>
        <TaskForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} />
      </Modal>
    </PageLayout>
  );
};

export default TaskPage;