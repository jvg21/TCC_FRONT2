import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { 
  FiCheckSquare, 
  FiFile, 
  FiClock, 
  FiFolderPlus, 
  FiChevronRight,
  FiChevronDown,
  FiExternalLink,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPlus,
  FiCalendar
} from "react-icons/fi";
import { HiFolder, HiDocumentText } from "react-icons/hi";
import { useAuthContext } from "../../context/AuthContext";
import { useTask } from "../task/useTask";
import { useDocument } from "../document/useDocument";
import { useFolder } from "../folder/useFolder";
import { useUser } from "../user/useUser";
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


const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface || theme.colors.background};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
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


const SectionContent = styled.div<{ $isEmpty?: boolean }>`
  padding: ${props => props.$isEmpty ? "40px 20px" : "0"};
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 10px;
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


const TreeContainer = styled.div`
  padding: 0;
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 12px 20px;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 16px;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const TreeNode = styled.div<{ $level: number }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const NodeHeader = styled.div<{ $isFolder: boolean; $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  padding-left: ${({ $isFolder, $level = 0 }) => ($isFolder ? '20px' : '40px')};
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${({ $isSelected, theme }) => 
    $isSelected ? `${theme.colors.primary}10` : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const NodeIcon = styled.div`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const NodeTitle = styled.div<{ $isFolder: boolean }>`
  font-size: ${({ $isFolder }) => ($isFolder ? '15px' : '14px')};
  font-weight: ${({ $isFolder }) => ($isFolder ? '600' : '400')};
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NodeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}10;
  }
`;


const WorkspacePage: React.FC = () => {
  const { t } = useTypedTranslation();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { activeTask, get: getTasks } = useTask();
  const { activeDocument, get: getDocuments } = useDocument();
  const { activeFolder, get: getFolders } = useFolder();
  const { activeUser } = useUser();
  
  const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<{ type: 'folder' | 'document', id: number } | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getTasks(),
          getDocuments(),
          getFolders()
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);
  
  
  const myPendingTasks = activeTask.filter(task => 
    task.AssignedId === user?.UserId && 
    (task.Status === 1 || task.Status === 2) 
  );
  
 
  const pendingValidations = activeDocument.filter(doc => 
    doc.ValidatorId === user?.UserId && 
    doc.ValidationStatus === 0 
  );
  
  
  const buildTree = activeFolder.filter(folder => !folder.ParentFolderId).map(folder => ({
    ...folder,
    children: activeFolder.filter(child => child.ParentFolderId === folder.FolderId),
    documents: activeDocument.filter(doc => doc.FolderId === folder.FolderId)
  }));
  
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const toggleFolderExpanded = (folderId: number) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const handleTaskClick = (taskId: number) => {
    
    console.log("Clicou na tarefa:", taskId);
    navigate(`/task`); 
  };
  
  const handleDocumentClick = (documentId: number) => {
    navigate(`/document/details/${documentId}`);
  };
  
  const renderTreeNode = (node: any, level = 0) => {
    if (node.FolderId) {
    
      const isExpanded = expandedFolders[node.FolderId] || false;
      const isSelected = selectedNode?.type === 'folder' && selectedNode?.id === node.FolderId;
      
      return (
        <React.Fragment key={`folder-${node.FolderId}`}>
          <TreeNode $level={level}>
            <NodeHeader 
              $isFolder={true} 
              $isSelected={isSelected} 
              onClick={() => {
                toggleFolderExpanded(node.FolderId);
                setSelectedNode({ type: 'folder', id: node.FolderId });
              }}
            >
              <NodeIcon>
                {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </NodeIcon>
              <NodeIcon>
                <HiFolder size={16} color="#ff9800" style={{ filter: 'drop-shadow(0 0 2px rgba(255,152,0,0.5))' }} />
              </NodeIcon>
              <NodeTitle $isFolder={true}>{node.Name}</NodeTitle>
              <NodeMeta>
                <StatusBadge $status={node.IsActive ? 'active' : 'inactive'}>
                  {node.IsActive ? t("cascadeview.active") : t("cascadeview.inactive")}
                </StatusBadge>
                <span>{(node.children?.length || 0) + (node.documents?.length || 0)} {t("cascadeview.items")}</span>
              </NodeMeta>
            </NodeHeader>
          </TreeNode>

          {isExpanded && (
            <>
              {node.children?.map((child: any) => renderTreeNode(child, level + 1))}
              {node.documents?.map((doc: any) => renderTreeNode(doc, level + 1))}
            </>
          )}
        </React.Fragment>
      );
    } else {
      
      const isSelected = selectedNode?.type === 'document' && selectedNode?.id === node.DocumentId;
      
      return (
        <TreeNode key={`doc-${node.DocumentId}`} $level={level}>
          <NodeHeader
            $isFolder={false}
            $isSelected={isSelected}
            onClick={() => {
              setSelectedNode({ type: 'document', id: node.DocumentId });
              navigate(`/document/details/${node.DocumentId}`);
            }}
          >
            <NodeIcon style={{ width: '16px' }} />
            <NodeIcon>
              <HiDocumentText size={16} color="#2196f3" style={{ filter: 'drop-shadow(0 0 2px rgba(33,150,243,0.5))' }} />
            </NodeIcon>
            <NodeTitle $isFolder={false}>{node.Title}</NodeTitle>
            <NodeMeta>
              {node.ValidationStatus === 0 && (
                <StatusBadge $status="pending">
                  {t("documents.document_details.validation.pending")}
                </StatusBadge>
              )}
              {node.ValidationStatus === 1 && (
                <StatusBadge $status="approved">
                  {t("documents.document_details.validation.approved")}
                </StatusBadge>
              )}
              {node.ValidationStatus === 2 && (
                <StatusBadge $status="rejected">
                  {t("documents.document_details.validation.rejected")}
                </StatusBadge>
              )}
              <span>{formatDate(node.CreatedAt)}</span>
            </NodeMeta>
          </NodeHeader>
        </TreeNode>
      );
    }
  };
  
  
  return (
    <PageLayout 
      title={t("workspace.title") || "Workspace"}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={() => navigate("/TaskBoardPage")}>
            <FiCheckSquare size={16} /> {t("tasks.task_board") || "Quadro de Tarefas"}
          </Button>
          
        </div>
      }
    >
      <WorkspaceContainer>
        <SectionCard>
          <CascadeView {...({ config: { filter: false } } as any)} />
        </SectionCard>

        <BottomSection>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <FiCheckSquare color="#22c55e" />
                {t("tasks.pending_tasks") || "Tarefas Pendentes"}
              </SectionTitle>
              <CountBadge>{myPendingTasks.length}</CountBadge>
            </SectionHeader>
            <SectionContent $isEmpty={myPendingTasks.length === 0}>
              {myPendingTasks.length > 0 ? (
                myPendingTasks.map(task => (
                  <TaskItem key={task.TaskId} onClick={() => handleTaskClick(task.TaskId)}>
                    <TaskContent>
                      <TaskTitle>{task.Title}</TaskTitle>
                      <TaskMeta>
                        <StatusBadge $status={task.Status === 1 ? 'pending' : 'active'}>
                          {task.Status === 1 ? 
                            (t("tasks.statusTask.todo") || "A Fazer") : 
                            (t("tasks.statusTask.inprogress") || "Em Progresso")}
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
                <EmptyState>
                  {t("tasks.no_tasks") || "Nenhuma tarefa pendente"}
                </EmptyState>
              )}
            </SectionContent>
          </SectionCard>

          {}
          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <FiFile color="#3b82f6" />
                {t("documents.tabs.validations_alert_title") || "Validações Pendentes"}
              </SectionTitle>
              <CountBadge>{pendingValidations.length}</CountBadge>
            </SectionHeader>
            <SectionContent $isEmpty={pendingValidations.length === 0}>
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
      </WorkspaceContainer>
    </PageLayout>
  );
};

export default WorkspacePage;