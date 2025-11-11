import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FiPlus, FiMoreVertical, FiCalendar } from "react-icons/fi";
import PageLayout from "../../components/common/PageLayout";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import type { Task } from "./types";
import { TaskForm } from "./TaskForm";
import { useTask } from "./useTask";
import { useTranslation } from "react-i18next";

import { useUser } from "../user/useUser";
import { useAuthContext } from "../../context/AuthContext";
import { getTaskStatus } from "../../enum/taskStatus";
import { getTaskPriority } from "../../enum/taskPriority";
import { FormatDate } from "../../utils/FormatDate";

/** ======== LAYOUT ESTILO TRELLO ======== **/
const BoardViewport = styled.div`
  height: calc(100vh - 160px);
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surfaceAlt ?? "#0f172a10"};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border ?? "#00000033"};
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    height: auto;
    overflow-x: visible;
    overflow-y: visible;
  }
`;

const BoardContainer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 16px;
  padding: 8px 8px 16px;
  min-height: 100%;
  width: max-content;
`;

const Column = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  flex: 0 0 360px;
  max-height: 100%;

  @media (max-width: 768px) {
    flex: 1 0 100%;
    max-height: none;
  }
`;

const ColumnHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 16px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusIndicator = styled.div<{ status: number }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ status }) => {
    switch (status) {
      case 1:
        return "#ef4444";
      case 2:
        return "#f59e0b";
      case 3:
        return "#3b82f6";
      case 4:
        return "#10b981";
      case 5:
        return "#6b7280";
      default:
        return "#6b7280";
    }
  }};
`;

const ColumnTitleText = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const TaskCount = styled.span`
  background: rgba(0, 0, 0, 0.05);
  color: ${({ theme }) => theme.colors.muted};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const ColumnContent = styled.div<{ $isOver?: boolean }>`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border ?? "#00000033"};
    border-radius: 8px;
  }

  /* Destaque visual quando é um alvo de drop */
  outline: ${({ $isOver, theme }) =>
    $isOver ? `2px dashed ${theme.colors.primary}` : "none"};
  outline-offset: ${({ $isOver }) => ($isOver ? "0" : "0")};
  background: ${({ $isOver, theme }) =>
    $isOver ? (theme.isDark ? "#0b122015" : "#3b82f610") : "transparent"};

  @media (max-width: 768px) {
    max-height: none;
  }
`;

const TaskCard = styled.div<{ $dragging?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 16px;
  cursor: grab;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.primary}20;
  }

  &:active {
    cursor: grabbing;
  }

  /* feedback ao arrastar */
  opacity: ${({ $dragging }) => ($dragging ? 0.6 : 1)};
  transform: ${({ $dragging }) => ($dragging ? "rotate(1deg)" : "none")};
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const TaskTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.4;
  flex: 1;
`;

const TaskActions = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s ease;

  ${TaskCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const TaskDescription = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;

const PriorityBadge = styled.div<{ priority: number }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ priority }) => {
    switch (priority) {
      case 1:
        return "#dbeafe";
      case 2:
        return "#fef3c7";
      case 3:
        return "#fed7aa";
      case 4:
        return "#fecaca";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${({ priority }) => {
    switch (priority) {
      case 1:
        return "#1e40af";
      case 2:
        return "#92400e";
      case 3:
        return "#c2410c";
      case 4:
        return "#dc2626";
      default:
        return "#374151";
    }
  }};
`;

const AssigneeAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
`;

const AddTaskButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}05;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      border-color: rgba(0, 0, 0, 0.2);
      color: ${({ theme }) => theme.colors.muted};
      background: transparent;
    }
  }
`;

const EmptyColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const TaskBoardPage: React.FC = () => {
  const { activeTask, create, update } = useTask();
  const [editing, setEditing] = useState<Task | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);

  // estado para DnD
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [overStatus, setOverStatus] = useState<string | null>(null);

  const modal = useModal();
  const { t } = useTranslation();
  const { activeUser } = useUser();
  const { userProfile } = useAuthContext();

  const tasksByStatus = useMemo(() => {
    const statuses = getTaskStatus(t);
    return statuses.reduce((acc, status) => {
      acc[status.value] = activeTask.filter(
        (task) => task.Status?.toString() === status.value
      );
      return acc;
    }, {} as Record<string, Task[]>);
  }, [activeTask, t]);

  const getUserName = (userId?: number) => {
    const user = activeUser.find((u) => u.UserId === userId);
    return user ? user.Name : (t("tasks.no_assignee") as string) || "Não atribuído";
  };

  const getUserInitials = (userId?: number) => {
    const user = activeUser.find((u) => u.UserId === userId);
    if (!user) return "?";
    return user.Name.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getPriorityLabel = (priority?: number) => {
    const priorityObj = getTaskPriority(t).find(
      (p) => p.value === priority?.toString()
    );
    return priorityObj ? priorityObj.label : (t("tasks.priorityTask.low") as string);
  };

  const handleAdd = (status?: number) => {
    setEditing(null);
    setSelectedStatus(status || 1);
    modal.open();
  };

  const handleEdit = (task: Task) => {
    setEditing(task);
    modal.open();
  };

  const handleSave = (payload: any) => {
    if (editing) {
      update(editing.TaskId, payload);
    } else {
      const taskData = { ...payload, Status: selectedStatus };
      create(taskData);
    }
    modal.close();
  };

  // Handlers de Drag & Drop (HTML5)
  const onTaskDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTaskId(task.TaskId);
    setIsDragging(true);
    // carrega o id no dataTransfer
    e.dataTransfer.setData("text/plain", String(task.TaskId));
    e.dataTransfer.effectAllowed = "move";
  };

  const onTaskDragEnd = () => {
    setIsDragging(false);
    setDraggedTaskId(null);
    setOverStatus(null);
  };

  const onColumnDragOver = (e: React.DragEvent, statusValue: string) => {
    // necessário para permitir drop
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverStatus(statusValue);
  };

  const onColumnDragLeave = (_e: React.DragEvent, statusValue: string) => {
    // remove highlight só se ainda está marcado esse status
    setOverStatus((prev) => (prev === statusValue ? null : prev));
  };

  const onColumnDrop = (e: React.DragEvent, statusValue: string) => {
    e.preventDefault();
    const idText = e.dataTransfer.getData("text/plain");
    const id = Number(idText || draggedTaskId);
    if (!id) return;

    const task = activeTask.find((t) => t.TaskId === id);
    if (task && task.Status?.toString() !== statusValue) {
      update(task.TaskId, { Title: task.Title, Description: task.Description, DueDate: task.DueDate, AssigneeId: task.AssigneeId, Status: parseInt(statusValue, 10) });
    }

    setIsDragging(false);
    setDraggedTaskId(null);
    setOverStatus(null);
  };

  return (
    <PageLayout
      title={(t("tasks.task_board") as string) || "Task Board"}
      actions={
        <Button disabled={!userProfile} onClick={() => handleAdd()}>
          <FiPlus />&nbsp;{t("tasks.add_task")}
        </Button>
      }
    >
      <BoardViewport>
        <BoardContainer>
          {getTaskStatus(t).map((status) => {
            const columnTasks = tasksByStatus[status.value] || [];

            return (
              <Column key={status.value}>
                <ColumnHeader>
                  <ColumnTitle>
                    <StatusIndicator status={parseInt(status.value)} />
                    <ColumnTitleText>{status.label}</ColumnTitleText>
                  </ColumnTitle>
                  <TaskCount>{columnTasks.length}</TaskCount>
                </ColumnHeader>

                <ColumnContent
                  $isOver={overStatus === status.value}
                  onDragOver={(e) => onColumnDragOver(e, status.value)}
                  onDragLeave={(e) => onColumnDragLeave(e, status.value)}
                  onDrop={(e) => onColumnDrop(e, status.value)}
                >
                  {columnTasks.length > 0 ? (
                    <>
                      {columnTasks.map((task) => (
                        <TaskCard
                          key={task.TaskId}
                          draggable
                          $dragging={draggedTaskId === task.TaskId}
                          onDragStart={(e) => onTaskDragStart(e, task)}
                          onDragEnd={onTaskDragEnd}
                          onClick={() => {
                            if (isDragging) return; // evita abrir modal ao soltar
                            handleEdit(task);
                          }}
                        >
                          <TaskHeader>
                            <TaskTitle>{task.Title}</TaskTitle>
                            <TaskActions
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(task);
                              }}
                              aria-label="Ações da tarefa"
                              title="Editar"
                            >
                              <FiMoreVertical size={14} />
                            </TaskActions>
                          </TaskHeader>

                          {task.Description && (
                            <TaskDescription>{task.Description}</TaskDescription>
                          )}

                          <TaskFooter>
                            <TaskMeta>
                              {task.DueDate && (
                                <MetaItem>
                                  <FiCalendar size={12} />
                                  {FormatDate(
                                    task.DueDate,
                                    t("date_format") as string
                                  )}
                                </MetaItem>
                              )}

                              {task.Priority && (
                                <PriorityBadge priority={task.Priority}>
                                  {getPriorityLabel(task.Priority)}
                                </PriorityBadge>
                              )}
                            </TaskMeta>

                            <AssigneeAvatar title={getUserName(task.AssigneeId)}>
                              {getUserInitials(task.AssigneeId)}
                            </AssigneeAvatar>
                          </TaskFooter>
                        </TaskCard>
                      ))}

                      <AddTaskButton
                        onClick={() => handleAdd(parseInt(status.value))}
                        disabled={!userProfile}
                      >
                        <FiPlus size={16} />
                        {t("tasks.add_task")}
                      </AddTaskButton>
                    </>
                  ) : (
                    <>
                      <EmptyColumn>
                        <EmptyIcon>
                          <FiPlus size={20} />
                        </EmptyIcon>
                        <div>
                          {(t("tasks.no_tasks") as string) || "Nenhuma tarefa"}
                        </div>
                      </EmptyColumn>
                      <AddTaskButton
                        onClick={() => handleAdd(parseInt(status.value))}
                        disabled={!userProfile}
                      >
                        <FiPlus size={16} />
                        {t("tasks.add_task")}
                      </AddTaskButton>
                    </>
                  )}
                </ColumnContent>
              </Column>
            );
          })}
        </BoardContainer>
      </BoardViewport>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={editing ? t("tasks.edit_task") : t("tasks.add_task")}
      >
        <TaskForm
          initial={editing ?? undefined}
          onCancel={modal.close}
          onSave={handleSave}
        />
      </Modal>
    </PageLayout>
  );
};

export default TaskBoardPage;
