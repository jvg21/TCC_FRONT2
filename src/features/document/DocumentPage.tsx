// src/features/document/DocumentPage.tsx
import React, { useState, useEffect } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiPlus, FiEye, FiFileText, FiEdit3, FiCheckCircle, FiClock, FiFilter } from "react-icons/fi";
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
import { MarkdownEditorPage } from "../markdown-editor/MarkdownEditorPage";
import { useUser } from "../user/useUser";
import { useFolder } from "../folder/useFolder";
import { useNavigate } from "react-router-dom";
import { TabContainer } from "../../components/common/TabContainer";
import { useTag } from "../tag/useTag";
import { useThemeContext } from "../../context/ThemeContext";


const DocumentTagsCell: React.FC<{ documentId: number }> = ({ documentId }) => {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getTagsByDocument } = useTag();

  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      try {
        const response = await getTagsByDocument(documentId);
        if (response && !response.erro) {
          setTags(response.objeto || []);
        }
      } catch (error) {
        console.error('Erro ao carregar tags:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, [documentId]);

  if (loading) {
    return <span style={{ color: '#999', fontSize: '12px' }}>...</span>;
  }

  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {tags.length > 0 ? (
        tags.map((tag) => (
          <span
            key={tag.tagId}
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: tag.color || '#007bff',
              color: '#fff'
            }}
          >
            {tag.name}
          </span>
        ))
      ) : (
        <span style={{ color: '#999', fontSize: '12px' }}>-</span>
      )}
    </div>
  );
};

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

  // Estados para filtros avançados
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: ""
  });
  const [authorFilter, setAuthorFilter] = useState<number | null>(null);
  const [tagFilter, setTagFilter] = useState<number | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tagFilteredDocIds, setTagFilteredDocIds] = useState<number[]>([]);

  // console.log(userDocuments, userValidatorDocuments);

  const { t } = useTranslation();
  const { userProfile, user } = useAuthContext();
  const { getTagsByDocument, getDocumentsByTag, activeTag } = useTag();
  const { activeUser } = useUser();
  const { activeFolder } = useFolder();
  const { updateValidationStatus } = useDocument();
  const { theme } = useThemeContext();


  const navigate = useNavigate();

  // useEffect para carregar documentos quando uma tag é selecionada
  useEffect(() => {
    const loadDocumentsByTag = async () => {
      if (tagFilter) {
        try {
          const response = await getDocumentsByTag(tagFilter);
          if (response && !response.erro && response.objeto) {
            // Extrair os IDs dos documentos
            const docIds = response.objeto.map((item: any) => item.documentId);
            setTagFilteredDocIds(docIds);
          }
        } catch (error) {
          console.error('Erro ao carregar documentos por tag:', error);
          setTagFilteredDocIds([]);
        }
      } else {
        setTagFilteredDocIds([]);
      }
    };

    loadDocumentsByTag();
  }, [tagFilter]);

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
        key: "Tags",
        header: t("documents.tags") || "Tags",
        render: (row) => <DocumentTagsCell documentId={row.DocumentId} />
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

    if (true) {
      baseCols.push({
        key: "actions",
        header: t("actions.actions"),
        render: (row) => {
          // Verificar se o usuário pode editar este documento
          const canEdit = () => {
            // Usuários nível 1 e 2 podem editar tudo
            if (user && (user.Profile === 1 || user.Profile === 2)) {
              return true;
            }

            // Usuários nível 3 podem editar se:
            if (user && user.Profile === 3) {
              // 1. Criaram o documento
              if (row.UserId === user.UserId) {
                return true;
              }

              // 2. São validadores da pasta do documento
              const folder = activeFolder.find((f) => f.FolderId === row.FolderId);
              if (folder && folder.ValidatorId === user.UserId) {
                return true;
              }
            }

            return false;
          };

          return (
            <div style={{ display: 'flex', gap: '4px' }}>

              {canEdit() && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => onView(row)}
                    title={t("documents.view_document")}
                  >
                    <FiEye />
                  </Button>
                  <ActionButtons onEdit={onEdit} onToggleStatus={onToggleStatus} row={row} id={row.DocumentId} />
                </>

              )}
            </div>
          );
        }
      });
    }
    return baseCols;
  };

  // Função ATUALIZADA para filtrar documentos com múltiplos critérios
  const getFilteredDocuments = (documents: Document[]) => {
    let filtered = [...documents];

    // Filtro por texto
    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(document => {
        const searchableText = [
          document.Title || "",
          document.Content || "",
        ].join(" ").toLowerCase();
        return searchableText.includes(searchQuery);
      });
    }

    // Filtro por data
    if (dateFilter.startDate || dateFilter.endDate) {
      filtered = filtered.filter(document => {
        const docDate = new Date(document.CreatedAt);
        const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
        const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

        if (startDate && endDate) {
          return docDate >= startDate && docDate <= endDate;
        } else if (startDate) {
          return docDate >= startDate;
        } else if (endDate) {
          return docDate <= endDate;
        }
        return true;
      });
    }

    // Filtro por autor
    if (authorFilter) {
      filtered = filtered.filter(document => document.UserId === authorFilter);
    }

    // Filtro por tag - usando os IDs carregados do backend
    if (tagFilter && tagFilteredDocIds.length > 0) {
      filtered = filtered.filter(document => tagFilteredDocIds.includes(document.DocumentId));
    } else if (tagFilter && tagFilteredDocIds.length === 0) {
      // Se uma tag está selecionada mas não há documentos, retornar array vazio
      filtered = [];
    }

    return filtered;
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
      await updateValidationStatus(payload.DocumentId, null, "");
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
  };

  const columns = Columns(handleEdit, handleToggleStatus, handleView, handleEditContent);

  // Componente InfoAlert
  const InfoAlert = ({ type, title, description }: { type: string; title: string; description: string }) => {

    const colors = {
      info: {
        bg: `${theme.colors.primary}15`,
        border: theme.colors.primary,
        icon: 'ℹ️'
      },
      success: {
        bg: theme.colors.primary === '#4f46e5' ? '#065f4615' : '#e8f5e9',
        border: theme.colors.primary === '#4f46e5' ? '#065f46' : '#4CAF50',
        icon: '✅'
      },
      warning: {
        bg: theme.colors.primary === '#4f46e5' ? '#92400e15' : '#fff3cd',
        border: theme.colors.primary === '#4f46e5' ? '#92400e' : '#ffc107',
        icon: '⚠️'
      }
    };
    const color = colors[type as keyof typeof colors] || colors.info;

    return (
      <div style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        fontSize: '14px',
        color: theme.colors.text
      }}>
        {color.icon} <strong>{title}:</strong> {description}
      </div>
    );
  };

  // Componente EmptyState
  const EmptyState = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div style={{
      textAlign: 'center',
      padding: '48px 16px',
      color: '#666'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ marginBottom: '8px', color: '#333' }}>{title}</h3>
      <p style={{ color: '#666' }}>{description}</p>
    </div>
  );

  // Componente de Filtros Avançados
  const AdvancedFilters = () => (
    <div style={{
      background: `${theme.colors.primary}15`,
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      display: showAdvancedFilters ? 'block' : 'none'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {/* Filtro de Data */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
            {t("documents.filters.date_range") || "Período"}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Filtro de Autor */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
            {t("documents.filters.author") || "Autor"}
          </label>
          <select
            value={authorFilter || ""}
            onChange={(e) => setAuthorFilter(e.target.value ? Number(e.target.value) : null)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">{t("documents.filters.all_authors") || "Todos os autores"}</option>
            {activeUser.map(user => (
              <option key={user.UserId} value={user.UserId}>
                {user.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Tag */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
            {t("documents.filters.tag")}
          </label>
          <select
            value={tagFilter || ""}
            onChange={(e) => setTagFilter(e.target.value ? Number(e.target.value) : null)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">{t("documents.filters.all_tags")}</option>
            {activeTag.map(tag => (
              <option key={tag.TagId} value={tag.TagId}>
                {tag.Name}
              </option>
            ))}
          </select>
          {tagFilter && (
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {tagFilteredDocIds.length === 0 ? (
                <>⏳ Carregando documentos...</>
              ) : (
                <>✓ {tagFilteredDocIds.length} documento(s) encontrado(s)</>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botão para limpar filtros */}
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="ghost"
          onClick={() => {
            setDateFilter({ startDate: "", endDate: "" });
            setAuthorFilter(null);
            setTagFilter(null);
          }}
        >
          {t("documents.filters.clear_filters") || "Limpar filtros"}
        </Button>
      </div>
    </div>
  );

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

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <FilterBar
              columns={columns}
              value={query}
              onChange={setQuery}
              placeholder={t("documents.search_documents")}
            />
            <Button
              variant="ghost"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              title={t("documents.filters.advanced_filters") || "Filtros avançados"}
            >
              <FiFilter /> {showAdvancedFilters ? (t("documents.filters.hide") || "Ocultar") : (t("documents.filters.show") || "Mostrar")}
            </Button>
          </div>

          {/* Filtros Avançados */}
          <AdvancedFilters />

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

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <FilterBar
              columns={columns}
              value={query}
              onChange={setQuery}
              placeholder={t("documents.tabs.search_my_documents")}
            />
            <Button
              variant="ghost"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FiFilter /> {showAdvancedFilters ? (t("documents.filters.hide") || "Ocultar") : (t("documents.filters.show") || "Mostrar")}
            </Button>
          </div>

          <AdvancedFilters />

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

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <FilterBar
              columns={columns}
              value={query}
              onChange={setQuery}
              placeholder={t("documents.tabs.search_to_edit")}
            />
            <Button
              variant="ghost"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FiFilter /> {showAdvancedFilters ? (t("documents.filters.hide") || "Ocultar") : (t("documents.filters.show") || "Mostrar")}
            </Button>
          </div>

          <AdvancedFilters />

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

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <FilterBar
              columns={columns}
              value={query}
              onChange={setQuery}
              placeholder={t("documents.tabs.search_validations")}
            />
            <Button
              variant="ghost"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FiFilter /> {showAdvancedFilters ? (t("documents.filters.hide") || "Ocultar") : (t("documents.filters.show") || "Mostrar")}
            </Button>
          </div>

          <AdvancedFilters />

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
        <Button onClick={handleAdd}>
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