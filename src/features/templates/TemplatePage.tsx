import React, { useState } from "react";
import styled from "styled-components";
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiFileText } from "react-icons/fi";
import { Button } from "../../components/common/Button";
import PageLayout from "../../components/common/PageLayout";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { useTypedTranslation } from "../../context/LanguageContext";
import { useAuthContext } from "../../context/AuthContext";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";
import type { ColumnDef } from "../../types";
import { useTemplate } from "./useTemplate";
import type { Template } from "./types";
import { TemplateForm } from "./TemplateForm";

const TemplatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.colors.background};
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.muted};
    
  &:hover {
    color: ${({ $active, theme }) => 
      $active ? 'white' : theme.colors.text};
  }
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const TemplateCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary}40;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    min-height: 160px;
  }
`;

const TemplateIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
  }
`;

const TemplateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const TemplatePreview = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  
  @media (max-width: 768px) {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
`;

const TemplateActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${TemplateCard}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.edit {
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary}25;
    }
  }
  
  &.copy {
    background: rgba(34, 197, 94, 0.15);
    color: rgb(34, 197, 94);
    
    &:hover {
      background: rgba(34, 197, 94, 0.25);
    }
  }
  
  &.delete {
    background: ${({ theme }) => theme.colors.danger}15;
    color: ${({ theme }) => theme.colors.danger};
    
    &:hover {
      background: ${({ theme }) => theme.colors.danger}25;
    }
  }
`;

const CreateTemplateCard = styled.div`
  background: transparent;
  border: 2px dashed rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 24px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.muted};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}60;
    background: ${({ theme }) => theme.colors.primary}05;
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    min-height: 160px;
  }
`;

const CreateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  
  ${CreateTemplateCard}:hover & {
    background: ${({ theme }) => theme.colors.primary}25;
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const CreateText = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  grid-column: 1 / -1;
  
  @media (max-width: 768px) {
    padding: 48px 16px;
  }
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.primary}10;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 24px 0;
  max-width: 400px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TemplatePage: React.FC = () => {
  const { activeTemplate, deactiveTemplate, create, update, softDelete, copyTemplate } = useTemplate();
  const [searchStatus, setSearchStatus] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const Templates = searchStatus === 1 ? activeTemplate : searchStatus === 2 ? deactiveTemplate : [...activeTemplate, ...deactiveTemplate];
  const [editing, setEditing] = useState<Template | null>(null);
  const [query, setQuery] = useState("");

  const modal = useModal();
  const { t } = useTypedTranslation();
  const { userProfile } = useAuthContext();

  const filteredTemplates = Templates.filter(template =>
    template.Name.toLowerCase().includes(query.toLowerCase()) ||
    template.Content.toLowerCase().includes(query.toLowerCase())
  );

  const Columns = (onEdit: (c: Template) => void, onToggleStatus: (id: number) => void, onCopy: (id: number) => void): ColumnDef<Template>[] => [
    { key: "Name", header: t("templates.name"), render: (row) => row.Name || "-" },
    { 
      key: "Content", 
      header: t("templates.content"), 
      render: (row) => (
        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.Content ? row.Content.substring(0, 50) + (row.Content.length > 50 ? '...' : '') : "-"}
        </div>
      )
    },
    { key: "CreatedAt", header: t("templates.created_at"), render: (row) => new Date(row.CreatedAt).toLocaleDateString() },
    { key: "UpdatedAt", header: t("templates.updated_at"), render: (row) => new Date(row.UpdatedAt).toLocaleDateString() },
    {
      key: "IsActive",
      header: t("templates.is_active"),
      render: (row) => <ActiveLabel IsActive={row.IsActive} />
    },
    {
      key: "actions",
      header: t("actions.actions"),
      render: (row) => (
        <ActionButtons
        row={row}id={row.TemplateId}
          onEdit={() => onEdit(row)}
          onToggleStatus={() => onToggleStatus(row.TemplateId)}
        />
      )
    }
  ];

  const handleCreate = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (template: Template) => {
    setEditing(template);
    modal.open();
  };

  const handleSubmit = async (data: Omit<Template, "TemplateId" | "CreatedAt" | "UpdatedAt" | "IsActive">) => {
    if (editing) {
      await update(editing.TemplateId, data);
    } else {
      await create(data);
    }
    modal.close();
  };

  const handleToggleStatus = async (id: number) => {
    await softDelete(id);
  };

  const handleCopy = async (id: number) => {
    await copyTemplate(id);
  };

  const renderCardsView = () => (
    <TemplatesGrid>
      <CreateTemplateCard onClick={handleCreate}>
        <CreateIcon>
          <FiPlus size={24} />
        </CreateIcon>
        <CreateText>
          {t("templates.create_template") || "Criar Novo Template"}
        </CreateText>
      </CreateTemplateCard>

      {filteredTemplates.length > 0 ? (
        filteredTemplates.map((template) => (
          <TemplateCard key={template.TemplateId}>
            <TemplateIcon>
              <FiFileText size={20} />
            </TemplateIcon>
            <TemplateTitle>{template.Name}</TemplateTitle>
            <TemplatePreview>
              {template.Content.length > 100 
                ? `${template.Content.substring(0, 100)}...` 
                : template.Content
              }
            </TemplatePreview>
            <TemplateActions>
              <ActionButton 
                className="edit" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(template);
                }}
                title={t("actions.edit") || "Editar"}
              >
                <FiEdit2 size={14} />
              </ActionButton>
              <ActionButton 
                className="copy" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(template.TemplateId);
                }}
                title={t("actions.copy") || "Copiar"}
              >
                <FiCopy size={14} />
              </ActionButton>
              <ActionButton 
                className="delete" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(template.TemplateId);
                }}
                title={t("actions.delete") || "Excluir"}
              >
                <FiTrash2 size={14} />
              </ActionButton>
            </TemplateActions>
          </TemplateCard>
        ))
      ) : (
        <EmptyState>
          <EmptyIcon>
            <FiFileText size={32} />
          </EmptyIcon>
          <EmptyTitle>
            {t("templates.no_templates") || "Nenhum template encontrado"}
          </EmptyTitle>
          <EmptyDescription>
            {t("templates.no_templates_description") || "Crie seu primeiro template para começar a padronizar seus documentos."}
          </EmptyDescription>
          <Button onClick={handleCreate}>
            <FiPlus size={16} style={{ marginRight: 8 }} />
            {t("templates.create_first_template") || "Criar Primeiro Template"}
          </Button>
        </EmptyState>
      )}
    </TemplatesGrid>
  );

  return (
    <PageLayout
      title={t("templates.title") || "Templates"}
      actions={
        <Button onClick={handleCreate}>
          <FiPlus size={16} style={{ marginRight: 8 }} />
          {t("templates.add_template") || "Novo Template"}
        </Button>
      }
    >
      <TemplatesContainer>

        {viewMode === 'cards' ? (
          renderCardsView()
        ) : (
          <DataTable
            columns={Columns(handleEdit, handleToggleStatus, handleCopy)}
            data={filteredTemplates}
          />
        )}
      </TemplatesContainer>

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        <TemplateForm
          template={editing}
          onSubmit={handleSubmit}
          onCancel={modal.close}
        />
      </Modal>
    </PageLayout>
  );
};

export default TemplatePage;