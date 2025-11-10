import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FiCheckSquare,
  FiFile,
  FiChevronRight,
  FiChevronDown,
  FiExternalLink,
  FiCalendar
} from "react-icons/fi";
import { HiFolder, HiDocumentText } from "react-icons/hi";
import { useAuthContext } from "../../context/AuthContext";
import { useTask } from "../task/useTask";
import { useDocument } from "../document/useDocument";
import { useFolder } from "../folder/useFolder";
import { useTypedTranslation } from "../../context/LanguageContext";
import PageLayout from "../../components/common/PageLayout";
import { Button } from "../../components/common/Button";
import CascadeView from "../folder/CascadeView";

const WorkspaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

/* 🔹 alterado: overflow agora visível para permitir scroll interno */
const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface || theme.colors.background};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: visible; /* 👈 antes era hidden */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* 🔹 scroll agora sempre visível, com padding ajustado */
const SectionContent = styled.div<{ $isEmpty?: boolean; $maxRows?: number }>`
  padding: ${props => (props.$isEmpty ? "40px 20px" : "0")};
  max-height: ${({ $maxRows }) => ($maxRows ? `${$maxRows * 78}px` : "400px")};
  overflow-y: scroll; /* 👈 forçado para aparecer */
  scrollbar-gutter: stable both-edges; /* evita salto visual ao aparecer */
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px; /* mais visível */
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surfaceAlt || theme.colors.background};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 8px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-style: italic;
`;

const StatusBadge = styled.span<{ $status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  ${({ $status }) => {
    switch ($status) {
      case 'pending':
        return css`
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'approved':
        return css`
          background-color: #ecfdf5;
          color: #065f46;
        `;
      case 'rejected':
        return css`
          background-color: #fee2e2;
          color: #991b1b;
        `;
      case 'active':
        return css`
          background-color: #dbeafe;
          color: #1e40af;
        `;
      case 'inactive':
        return css`
          background-color: #f3f4f6;
          color: #374151;
        `;
      default:
        return css`
          background-color: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

const ListItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease;
  cursor: pointer;
  min-height: 62px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const TaskItem = styled(ListItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const TaskDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DocumentItem = styled(ListItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DocumentContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DocumentTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const DocumentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const CountBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 600;
`;

const WorkspacePage: React.FC = () => {
  const { t } = useTypedTranslation();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { activeTask, get: getTasks } = useTask();
  const { get: getDocuments, userValidatorDocuments } = useDocument();
  const { get: getFolders } = useFolder();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getTasks(), getDocuments(), getFolders()]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    loadData();
  }, []);

  const myPendingTasks = activeTask.filter(task =>
    task.AssigneeId === user?.UserId && (task.Status === 1 || task.Status === 2)
  );

  const pendingValidations = userValidatorDocuments.filter(document => document.IsActive === true);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleTaskClick = (taskId: number) => navigate(`/task`);
  const handleDocumentClick = (documentId: number) => navigate(`/document/details/${documentId}`);

  return (
    <PageLayout
      title={t("workspace.title") || "Área de Trabalho"}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={() => navigate("/TaskBoardPage")}>
            <FiCheckSquare size={16} /> {t("tasks.task_board") || "Quadro de Tarefas"}
          </Button>
        </div>
      }
    >
      <WorkspaceContainer>
        <BottomSection>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <FiCheckSquare color="#22c55e" />
                {t("tasks.pending_tasks") || "Tarefas Pendentes"}
              </SectionTitle>
              <CountBadge>{myPendingTasks.length}</CountBadge>
            </SectionHeader>
            <SectionContent $isEmpty={myPendingTasks.length === 0} $maxRows={3}>
              {myPendingTasks.length > 0 ? (
                myPendingTasks.map(task => (
                  <TaskItem key={task.TaskId} onClick={() => handleTaskClick(task.TaskId)}>
                    <TaskContent>
                      <TaskTitle>{task.Title}</TaskTitle>
                      <TaskMeta>
                        <StatusBadge $status={task.Status === 1 ? 'pending' : 'active'}>
                          {task.Status === 1
                            ? (t("tasks.statusTask.todo") || "A Fazer")
                            : (t("tasks.statusTask.inprogress") || "Em Progresso")}
                        </StatusBadge>
                        <TaskDate>
                          <FiCalendar size={14} />
                          {formatDate(task.DueDate)}
                        </TaskDate>
                      </TaskMeta>
                    </TaskContent>
                    <FiExternalLink size={16} color="#6b7280" />
                  </TaskItem>
                ))
              ) : (
                <EmptyState>{t("tasks.no_tasks") || "Nenhuma tarefa pendente"}</EmptyState>
              )}
            </SectionContent>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <FiFile color="#3b82f6" />
                {t("documents.tabs.validations_alert_title") || "Validações Pendentes"}
              </SectionTitle>
              <CountBadge>{pendingValidations.length}</CountBadge>
            </SectionHeader>
            <SectionContent $isEmpty={pendingValidations.length === 0} $maxRows={3}>
              {pendingValidations.length > 0 ? (
                pendingValidations.map(doc => (
                  <DocumentItem key={doc.DocumentId} onClick={() => handleDocumentClick(doc.DocumentId)}>
                    <DocumentContent>
                      <DocumentTitle>{doc.Title}</DocumentTitle>
                      <DocumentMeta>
                        <StatusBadge $status="pending">
                          {t("documents.document_details.validation.pending") || "Pendente"}
                        </StatusBadge>
                        <span>{formatDate(doc.CreatedAt)}</span>
                      </DocumentMeta>
                    </DocumentContent>
                    <FiExternalLink size={16} color="#6b7280" />
                  </DocumentItem>
                ))
              ) : (
                <EmptyState>
                  {t("documents.tabs.no_validations_pending_title") || "Nenhuma validação pendente"}
                </EmptyState>
              )}
            </SectionContent>
          </SectionCard>
        </BottomSection>

        <SectionCard>
          <CascadeView {...({ config: { filter: false } } as any)} />
        </SectionCard>
      </WorkspaceContainer>
    </PageLayout>
  );
};

export default WorkspacePage;

