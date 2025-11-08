import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { FiClock, FiPlus } from "react-icons/fi";
import { Button } from "../../components/common/Button";
import PageLayout from "../../components/common/PageLayout";
import { useTask } from "../task/useTask";
import { useTranslation } from "react-i18next";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { TaskForm } from "./TaskForm";
import { useAuthContext } from "../../context/AuthContext";
import type { Task } from "../task/types";
import { getTaskStatus } from "../../enum/taskStatus";
import { getTaskPriority } from "../../enum/taskPriority";
import { FormatDate } from "../../utils/FormatDate";


const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 24px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const KanbanSection = styled.div`
  flex: 2;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const SectionActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const AllTasksLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
  }
`;

const KanbanBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const KanbanColumn = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const ColumnHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIndicator = styled.div<{ status: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ status }) => {
    switch (status) {
      case 1: return '#ef4444'; 
      case 2: return '#f59e0b';   
      case 3: return '#3b82f6'; 
      case 4: return '#10b981'; 
      default: return '#6b7280';
    }
  }};
`;

const ColumnTitleText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TaskCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 8px;
`;

const ColumnContent = styled.div`
  padding: 16px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TaskItem = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TaskTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  line-height: 1.3;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
`;

const PriorityDot = styled.div<{ priority: number }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ priority }) => {
    switch (priority) {
      case 1: return '#22c55e'; 
      case 2: return '#f59e0b'; 
      case 3: return '#f97316'; 
      case 4: return '#ef4444'; 
      default: return '#6b7280';
    }
  }};
`;

const EmptyColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  font-style: italic;
  text-align: center;
  padding: 20px;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const UpcomingDeadlines = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const DeadlinesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DeadlineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const DeadlineInfo = styled.div`
  flex: 1;
`;

const DeadlineTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

const DeadlineDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TaskStatistics = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const StatProgress = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
`;

const StatProgressBar = styled.div<{ width: number; color: string }>`
  height: 100%;
  background: ${({ color }) => color};
  width: ${({ width }) => width}%;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const TaskDashboard: React.FC = () => {
  
  const { activeTask, create, update } = useTask();
  const [editing, setEditing] = useState<Task | null>(null);
  const modal = useModal();
  const { t } = useTranslation();
  const { userProfile } = useAuthContext();

  const taskStats = useMemo(() => {
    const total = activeTask.length;
    const completed = activeTask.filter(task => task.Status === 4).length;
    const inProgress = activeTask.filter(task => task.Status === 2).length;
    const pending = activeTask.filter(task => task.Status === 1).length;
    const inReview = activeTask.filter(task => task.Status === 3).length;

    return {
      total,
      completed,
      inProgress,
      pending,
      inReview,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      progressRate: total > 0 ? Math.round((inProgress / total) * 100) : 0,
      pendingRate: total > 0 ? Math.round((pending / total) * 100) : 0
    };
  }, [activeTask]);

  
  const tasksByStatus = useMemo(() => {
    const statuses = getTaskStatus(t);
    return statuses.reduce((acc, status) => {
      acc[status.value] = activeTask.filter(task => 
        task.Status?.toString() === status.value
      );
      return acc;
    }, {} as Record<string, Task[]>);
  }, [activeTask, t]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return activeTask
      .filter(task => {
        if (!task.DueDate) return false;
        const dueDate = new Date(task.DueDate);
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => {
        const dateA = new Date(a.DueDate!);
        const dateB = new Date(b.DueDate!);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5); 
  }, [activeTask]);

  // const getUserName = (userId?: number) => {
  //   const user = activeUser.find(u => u.UserId === userId);
  //   return user ? user.Name : t("tasks.no_assignee") || "Não atribuído";
  // };

  // const getUserInitials = (userId?: number) => {
  //   const user = activeUser.find(u => u.UserId === userId);
  //   if (!user) return "?";
  //   return user.Name.split(' ').map(n => n[0]).join('').toUpperCase();
  // };

  const handleAddTask = () => {
    setEditing(null);
    modal.open();
  };

  const handleViewAllTasks = () => {
    
    console.log("Ver todas as tarefas");
  };

  const handleTaskClick = (task: Task) => {
    setEditing(task);
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

  return (
    <PageLayout 
      title={t("tasks.task_dashboard") || "Painel de Tarefas"}
      actions={
        <Button 
          disabled={!userProfile} 
          onClick={handleAddTask}
        >
          <FiPlus size={16} />&nbsp;{t("tasks.add_task")}
        </Button>
      }
    >
      <DashboardContainer>
        {}
        <TopSection>
          <KanbanSection>
            <SectionHeader>
              <SectionTitle>{t("tasks.task_dashboard") || "Task Dashboard"}</SectionTitle>
              <SectionActions>
                <AllTasksLink onClick={handleViewAllTasks}>
                  {t("tasks.all_tasks") || "All Tasks"} →
                </AllTasksLink>
              </SectionActions>
            </SectionHeader>
            
            <KanbanBoard>
              {getTaskStatus(t).slice(0, 4).map((status) => {
                const columnTasks = tasksByStatus[status.value] || [];
                
                return (
                  <KanbanColumn key={status.value}>
                    <ColumnHeader>
                      <ColumnTitle>
                        <StatusIndicator status={parseInt(status.value)} />
                        <ColumnTitleText>{status.label}</ColumnTitleText>
                      </ColumnTitle>
                      <TaskCount>{columnTasks.length}</TaskCount>
                    </ColumnHeader>
                    
                    <ColumnContent>
                      {columnTasks.length > 0 ? (
                        columnTasks.slice(0, 3).map((task) => (
                          <TaskItem key={task.TaskId} onClick={() => handleTaskClick(task)}>
                            <TaskTitle>{task.Title}</TaskTitle>
                            <TaskMeta>
                              {task.Priority && (
                                <>
                                  <PriorityDot priority={task.Priority} />
                                  <span>{getTaskPriority(t).find(p => p.value === task.Priority?.toString())?.label}</span>
                                </>
                              )}
                              {task.DueDate && (
                                <>
                                  <FiClock size={10} />
                                  <span>{FormatDate(task.DueDate,  t('date_format'))}</span>
                                </>
                              )}
                            </TaskMeta>
                          </TaskItem>
                        ))
                      ) : (
                        <EmptyColumn>
                          {parseInt(status.value) === 2 ? "No tasks in progress" :
                           parseInt(status.value) === 3 ? "No tasks in review" :
                           parseInt(status.value) === 4 ? "No completed tasks" :
                           "No tasks in progress"}
                        </EmptyColumn>
                      )}
                    </ColumnContent>
                  </KanbanColumn>
                );
              })}
            </KanbanBoard>
          </KanbanSection>
        </TopSection>

        {}
        <BottomSection>
          {}
          <UpcomingDeadlines>
            <SectionHeader>
              <SectionTitle>{t("tasks.upcoming_deadlines") || "Upcoming Deadlines"}</SectionTitle>
            </SectionHeader>
            
            <DeadlinesList>
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((task) => (
                  <DeadlineItem key={task.TaskId} onClick={() => handleTaskClick(task)}>
                    <PriorityDot priority={task.Priority || 1} />
                    <DeadlineInfo>
                      <DeadlineTitle>{task.Title}</DeadlineTitle>
                      <DeadlineDate>
                        <FiClock size={12} />
                        {FormatDate(task.DueDate || "", t('date_format'))}
                      </DeadlineDate>
                    </DeadlineInfo>
                  </DeadlineItem>
                ))
              ) : (
                <EmptyColumn>
                  {t("tasks.no_upcoming_deadlines") || "No upcoming deadlines"}
                </EmptyColumn>
              )}
            </DeadlinesList>
          </UpcomingDeadlines>

          {}
          <TaskStatistics>
            <SectionHeader>
              <SectionTitle>{t("tasks.task_statistics") || "Task Statistics"}</SectionTitle>
            </SectionHeader>
            
            <StatsList>
              <StatItem>
                <StatLabel>{t("tasks.total_tasks") || "Total Tasks"}</StatLabel>
                <StatValue>{taskStats.total}</StatValue>
              </StatItem>
              <StatProgress>
                <StatProgressBar width={100} color="#3b82f6" />
              </StatProgress>

              <StatItem>
                <StatLabel>{t("tasks.completed_tasks") || "Completed"}</StatLabel>
                <StatValue>{taskStats.completed} / {taskStats.total}</StatValue>
              </StatItem>
              <StatProgress>
                <StatProgressBar width={taskStats.completionRate} color="#10b981" />
              </StatProgress>

              <StatItem>
                <StatLabel>{t("tasks.in_progress_tasks") || "In Progress"}</StatLabel>
                <StatValue>{taskStats.inProgress} / {taskStats.total}</StatValue>
              </StatItem>
              <StatProgress>
                <StatProgressBar width={taskStats.progressRate} color="#f59e0b" />
              </StatProgress>

              <StatItem>
                <StatLabel>{t("tasks.pending_tasks") || "Pending"}</StatLabel>
                <StatValue>{taskStats.pending} / {taskStats.total}</StatValue>
              </StatItem>
              <StatProgress>
                <StatProgressBar width={taskStats.pendingRate} color="#ef4444" />
              </StatProgress>
            </StatsList>
          </TaskStatistics>
        </BottomSection>
      </DashboardContainer>

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

export default TaskDashboard;