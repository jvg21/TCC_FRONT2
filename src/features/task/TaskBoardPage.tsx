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
import { useLanguage } from "../../context/LanguageContext";
import { getTaskStatus } from "../../enum/taskStatus";
import { getTaskPriority } from "../../enum/taskPriority";
import { FormatDate } from "../../utils/FormatDate";


const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  height: calc(100vh - 160px);
  overflow: hidden;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const Column = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ColumnHeader = styled.div`
  padding: 20px 24px;
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
      case 1: return '#ef4444'; 
      case 2: return '#f59e0b'; 
      case 3: return '#3b82f6'; 
      case 4: return '#10b981'; 
      case 5: return '#6b7280'; 
      default: return '#6b7280';
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

const ColumnContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (max-width: 768px) {
    max-height: 400px;
  }
`;

const TaskCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.primary}20;
  }
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
      case 1: return '#dbeafe'; // Baixa - azul claro
      case 2: return '#fef3c7'; // Média - amarelo claro
      case 3: return '#fed7aa'; // Alta - laranja claro
      case 4: return '#fecaca'; // Urgente - vermelho claro
      default: return '#f3f4f6';
    }
  }};
  color: ${({ priority }) => {
    switch (priority) {
      case 1: return '#1e40af'; // Baixa - azul escuro
      case 2: return '#92400e'; // Média - amarelo escuro
      case 3: return '#c2410c'; // Alta - laranja escuro
      case 4: return '#dc2626'; // Urgente - vermelho escuro
      default: return '#374151';
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

  const modal = useModal();
  const { t } = useTranslation();
  const { activeUser } = useUser();
  const { userProfile } = useAuthContext();

  
  const tasksByStatus = useMemo(() => {
    const statuses = getTaskStatus(t);
    return statuses.reduce((acc, status) => {
      acc[status.value] = activeTask.filter(task => 
        task.Status?.toString() === status.value
      );
      return acc;
    }, {} as Record<string, Task[]>);
  }, [activeTask, t]);

  
  const getUserName = (userId?: number) => {
    const user = activeUser.find(u => u.UserId === userId);
    return user ? user.Name : t("tasks.no_assignee") || "Não atribuído";
  };

  
  const getUserInitials = (userId?: number) => {
    const user = activeUser.find(u => u.UserId === userId);
    if (!user) return "?";
    return user.Name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  
  const getPriorityLabel = (priority?: number) => {
    const priorityObj = getTaskPriority(t).find(p => p.value === priority?.toString());
    return priorityObj ? priorityObj.label : t("tasks.priorityTask.low");
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

  // const handleDelete = (id: number) => {
  //   softDelete(id);
  // };

  return (
    <PageLayout 
      title={t("tasks.task_board") || "Task Board"} 
      actions={
        <Button 
          disabled={!userProfile} 
          onClick={() => handleAdd()}
        >
          <FiPlus />&nbsp;{t("tasks.add_task")}
        </Button>
      }
    >
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
              
              <ColumnContent>
                {columnTasks.length > 0 ? (
                  <>
                    {columnTasks.map((task) => (
                      <TaskCard key={task.TaskId} onClick={() => handleEdit(task)}>
                        <TaskHeader>
                          <TaskTitle>{task.Title}</TaskTitle>
                          <TaskActions
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(task);
                            }}
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
                                {FormatDate(task.DueDate, t('date_format'))}
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
                      <div>{t("tasks.no_tasks") || "Nenhuma tarefa"}</div>
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

      {}
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