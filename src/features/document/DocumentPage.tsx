// src/features/document/DocumentPage.tsx
import React, { use, useState } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiPlus, FiEye, FiFileText, FiEdit3, FiCheckCircle, FiClock } from "react-icons/fi";
import type { ColumnDef } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import { DocumentForm } from "./DocumentForm";
import { useDocument } from "./useDocument";
import type { Document } from "./types";
import { useTranslation } from "react-i18next";
import { SelectSelector } from "../../components/lib/StatusSelector";
import { useAuthContext } from "../../context/AuthContext";
import { ActiveLabel } from "../../components/lib/ActiveLabel";
import { ActionButtons } from "../../components/lib/ActionButtons";
import { DocumentViewer } from "./DocumentViewer";
import { MarkdownEditorPage } from "../markdown-editor/MarkdownEditorPage";
import { useUser } from "../user/useUser";
import { useFolder } from "../folder/useFolder";
import { useNavigate } from "react-router-dom";
import { TabContainer } from "../../components/common/TabContainer";
import { useTag } from "../tag/useTag";

const DocumentPage: React.FC = () => {
  const {
    activeDocument,
    deactiveDocument,
    userDocuments,
    userValidatorDocuments,
    create,
    update,
    softDelete
  } = useDocument();

  const [searchStatus, setSearchStatus] = useState<number>(1);
  const Documents = searchStatus === 1 ? activeDocument : searchStatus === 2 ? deactiveDocument : [...activeDocument, ...deactiveDocument];

  const modal = useModal();
  const viewModal = useModal();
  const editorModal = useModal();
  const [editing, setEditing] = useState<Document | null>(null);
  const [viewing, setViewing] = useState<Document | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [contentSaveCallback, setContentSaveCallback] = useState<((content: string) => void) | null>(null);
  const [query, setQuery] = useState("");
  const [activeTabId, setActiveTabId] = useState("geral");


  console.log(userDocuments, userValidatorDocuments)

  const { t } = useTranslation();
  const { userProfile, user } = useAuthContext();
  const { getTagsByDocument, getDocumentsByTag } = useTag()
  const { activeUser } = useUser();
  const { activeFolder } = useFolder();
  const { updateValidationStatus } = useDocument();

  const navigate = useNavigate();

  const handleView = (document: Document) => {
    navigate(`/document/details/${document.DocumentId}`);
  };

  const handleEditContent = (document: Document) => {
    setEditingContent(document.Content || "");
    setContentSaveCallback(() => (newContent: string) => {
      update(document.DocumentId, { ...document, Content: newContent });
      editorModal.close();
    });
    editorModal.open();
  };

  const handleEditContentFromForm = (currentContent: string, onContentSaved: (newContent: string) => void) => {
    setEditingContent(currentContent);
    setContentSaveCallback(() => onContentSaved);
    editorModal.open();
  };

  const handleEditFromViewer = () => {
    if (viewing) {
      viewModal.close();
      setEditing(viewing);
      modal.open();
    }
  };

  const Columns = (
    onEdit: (c: Document) => void,
    onToggleStatus: (id: number) => void,
    onView: (c: Document) => void,
    onEditContent: (c: Document) => void
  ): ColumnDef<Document>[] => {
    const baseCols: ColumnDef<Document>[] = [
      {
        key: "Title",
        header: t("documents.title_field"),
        render: (row) => (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500'
          }}>
            <FiFileText size={16} style={{ color: '#007bff' }} />
            {row.Title || t("documents.untitled_document")}
          </div>
        )
      },
      {
        key: "FolderId",
        header: t("documents.folder"),
        render: (row) => {
          const folder = activeFolder.filter((a) => a.FolderId === row.FolderId)[0];
          return folder ? folder.Name : "-";
        }
      },
      {
        key: "UserId",
        header: t("documents.creator"),
        render: (row) => {
          const creator = activeUser.filter((a) => a.UserId === row.UserId)[0];
          return creator ? creator.Name : "-";
        }
      },
      {
        key: "IsActive",
        header: t("documents.is_active"),
        render: (row) => <ActiveLabel IsActive={row.IsActive} />
      }
    ];

    if (userProfile) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => (
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button
              variant="ghost"
              onClick={() => onView(row)}
              title={t("documents.view_document")}
            >
              <FiEye />
            </Button>
            <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.DocumentId} />
          </div>
        )
      });
    }
    return baseCols;
  };

  // Função para filtrar documentos baseado na query
  const getFilteredDocuments = (documents: Document[]) => {
    if (!query) return documents;

    const searchQuery = query.toLowerCase();
    return documents.filter(document => {
      const searchableText = [
        document.Title || "",
        document.Content || "",
      ].join(" ").toLowerCase();
      return searchableText.includes(searchQuery);
    });
  };

  // Função para obter documentos criados pelo usuário atual
  const getMyDocuments = () => {
    if (!user) return [];
    return activeDocument.filter(doc => doc.UserId === user.UserId);
  };

  const handleAdd = () => {
    setEditing(null);
    modal.open();
  };

  const handleEdit = (c: Document) => {
    setEditing(c);
    modal.open();
  };

  const handleSave = async (payload: any) => {
    try {
      if (editing) {
        await update(editing.DocumentId, payload);
      } else {
        await create(payload);

      }
      await updateValidationStatus(payload.DocumentId, null, ""); // Define o status como "Pendente" (0) ao criar ou editar
      modal.close();
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await softDelete(id);
    } catch (error) {
      console.error("Erro ao alterar status do documento:", error);
    }
  };

  const handleSaveContent = (newContent: string) => {
    if (contentSaveCallback) {
      contentSaveCallback(newContent);
    }
    editorModal.close();
  };

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    setQuery(""); // Limpa a busca ao trocar de aba
  };

  const columns = Columns(handleEdit, handleToggleStatus, handleView, handleEditContent);

  // Componente para estado vazio
  const EmptyState: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }> = ({ icon, title, description }) => (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6c757d',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {icon}
      </div>
      <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '14px' }}>{description}</p>
    </div>
  );

  // Componente para aviso informativo
  const InfoAlert: React.FC<{
    type: 'info' | 'warning' | 'success';
    title: string;
    description: string;
  }> = ({ type, title, description }) => {
    const colors = {
      info: { bg: '#d1ecf1', border: '#bee5eb', icon: '🔍' },
      warning: { bg: '#fff3cd', border: '#ffeaa7', icon: '📝' },
      success: { bg: '#d4edda', border: '#c3e6cb', icon: '✅' }
    };

    const color = colors[type];

    return (
      <div style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        fontSize: '14px'
      }}>
        {color.icon} <strong>{title}:</strong> {description}
      </div>
    );
  };

  // Definir as abas com seus respectivos conteúdos
  const tabs = [
    {
      id: "geral",
      label: t("documents.tabs.general"),
      icon: <FiFileText size={16} />,
      badge: Documents.length,
      content: (
        <div>
          <InfoAlert
            type="info"
            title={t("documents.tabs.general_alert_title")}
            description={t("documents.tabs.general_alert_description")}
          />
          <FilterBar
            columns={columns}
            value={query}
            onChange={setQuery}
            placeholder={t("documents.search_documents")}
          />
          {userProfile && (
            <div style={{ marginBottom: '16px' }}>
              <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
            </div>
          )}
          <DataTable columns={columns} data={getFilteredDocuments(Documents)} />
        </div>
      )
    },
    {
      id: "meus-documentos",
      label: t("documents.tabs.my_documents"),
      icon: <FiEdit3 size={16} />,
      badge: getMyDocuments().length,
      content: (
        <div>
          <InfoAlert
            type="success"
            title={t("documents.tabs.my_documents_alert_title")}
            description={t("documents.tabs.my_documents_alert_description")}
          />
          <FilterBar
            columns={columns}
            value={query}
            onChange={setQuery}
            placeholder={t("documents.tabs.search_my_documents")}
          />
          {getMyDocuments().length === 0 ? (
            <EmptyState
              icon="📄"
              title={t("documents.tabs.no_documents_created_title")}
              description={t("documents.tabs.no_documents_created_description")}
            />
          ) : (
            <DataTable columns={columns} data={getFilteredDocuments(getMyDocuments())} />
          )}
        </div>
      )
    },
    {
      id: "to-edit",
      label: t("documents.tabs.to_edit"),
      icon: <FiClock size={16} />,
      badge: userDocuments.length,
      content: (
        <div>
          <InfoAlert
            type="warning"
            title={t("documents.tabs.to_edit_alert_title")}
            description={t("documents.tabs.to_edit_alert_description")}
          />
          <FilterBar
            columns={columns}
            value={query}
            onChange={setQuery}
            placeholder={t("documents.tabs.search_to_edit")}
          />
          {userDocuments.length === 0 ? (
            <EmptyState
              icon="✅"
              title={t("documents.tabs.no_documents_to_edit_title")}
              description={t("documents.tabs.no_documents_to_edit_description")}
            />
          ) : (
            <DataTable columns={columns} data={getFilteredDocuments(userDocuments)} />
          )}
        </div>
      )
    },
    {
      id: "validacoes",
      label: t("documents.tabs.validations"),
      icon: <FiCheckCircle size={16} />,
      badge: userValidatorDocuments.length,
      content: (
        <div>
          <InfoAlert
            type="info"
            title={t("documents.tabs.validations_alert_title")}
            description={t("documents.tabs.validations_alert_description")}
          />
          <FilterBar
            columns={columns}
            value={query}
            onChange={setQuery}
            placeholder={t("documents.tabs.search_validations")}
          />
          {userValidatorDocuments.length === 0 ? (
            <EmptyState
              icon="🎉"
              title={t("documents.tabs.no_validations_pending_title")}
              description={t("documents.tabs.no_validations_pending_description")}
            />
          ) : (
            <DataTable columns={columns} data={getFilteredDocuments(userValidatorDocuments)} />
          )}
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title={t("documents.title")}
      actions={
        <Button disabled={!userProfile} onClick={handleAdd}>
          <FiPlus />&nbsp;{t("documents.add_document")}
        </Button>
      }
    >
      {/* Sistema de Abas */}
      <TabContainer
        tabs={tabs}
        defaultTab="geral"
        onTabChange={handleTabChange}
      />

      {/* Modais existentes */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={editing ? t("documents.edit_document") : t("documents.add_document")}
      >
        <DocumentForm
          initial={editing ?? undefined}
          onCancel={modal.close}
          onSave={handleSave}
          onEditContent={handleEditContentFromForm}
        />
      </Modal>

      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        title={t("documents.view_document")}
      >
        {viewing && (
          <DocumentViewer
            title={viewing.Title || t("documents.untitled_document")}
            content={viewing.Content || ""}
            onEdit={handleEditFromViewer}
            onClose={viewModal.close}
          />
        )}
      </Modal>

      <Modal
        isOpen={editorModal.isOpen}
        onClose={editorModal.close}
        title={t("documents.markdown_editor")}
      >
        <MarkdownEditorPage
          initialContent={editingContent}
          onSave={handleSaveContent}
          onCancel={editorModal.close}
        />
      </Modal>
    </PageLayout>
  );
};

export default DocumentPage;