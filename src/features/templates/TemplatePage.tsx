import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiFileText } from "react-icons/fi";
import { Button } from "../../components/common/Button";
import PageLayout from "../../components/common/PageLayout";
import { DataTable } from "../../components/lib/DataTable";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { useTypedTranslation } from "../../context/LanguageContext";
import { useAuthContext } from "../../context/AuthContext";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";
import type { ColumnDef } from "../../types";
import { useTemplate } from "./useTemplate";
import type { Template } from "./types";
import { TemplateForm } from "./TemplateForm";
import { ActionButton, CreateIcon, CreateTemplateCard, CreateText, EmptyDescription, EmptyIcon, EmptyState, EmptyTitle, TemplateActions, TemplateCard, TemplateIcon, TemplatePreview, TemplatesContainer, TemplatesGrid, TemplateTitle } from "../../components/common/Components";
import { SelectSelector } from "../../components/lib/StatusSelector";



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

    { key: "CreatedAt", header: t("templates.created_at"), render: (row) => new Date(row.CreatedAt!).toLocaleDateString() },
    { key: "UpdatedAt", header: t("templates.updated_at"), render: (row) => new Date(row.UpdatedAt!).toLocaleDateString() },
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
          row={row} id={row.TemplateId}
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
          {t("templates.create_template")}
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
                title={t("actions.edit")}
              >
                <FiEdit2 size={14} />
              </ActionButton>
              <ActionButton
                className="copy"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(template.TemplateId);
                }}
                title={t("actions.copy")}
              >
                <FiCopy size={14} />
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(template.TemplateId);
                }}
                title={t("actions.delete")}
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
        <>
          <Button onClick={()=>setViewMode(viewMode==='cards'?'table':'cards')}>
            <FiPlus size={16} style={{ marginRight: 8 }} />
            {t("templates.change_view") }
          </Button>
          <Button onClick={handleCreate}>
            <FiPlus size={16} style={{ marginRight: 8 }} />
            {t("templates.add_template") }
          </Button>
        </>

      }
    >
      <TemplatesContainer>
        {
          userProfile &&
          <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
        }

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