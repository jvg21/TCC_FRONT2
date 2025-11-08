import React, { useState, useEffect, useRef } from "react";
import { FilterBar } from "../../components/lib/FilterBar";
import { DataTable } from "../../components/lib/DataTable";
import { Button } from "../../components/common/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/common/Modal";
import { FiPlus, FiFileText, FiEdit3, FiCheckCircle, FiClock, FiFilter, FiSearch, FiX, FiChevronLeft, FiChevronRight, FiUpload } from "react-icons/fi";
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
import { RagResultContent, RagResultItem, RagResultsClear, RagResultsContainer, RagResultScore, RagResultsCount, RagResultsHeader, RagResultsList, RagResultTitle, RagResultView, RagSearchButton, RagSearchContainer, RagSearchControls, RagSearchDescription, RagSearchInput, RagSearchTitle, Spinner } from "../../components/common/Components";
import { notificationActions } from "../notifications/useNotification";
import { findSimilarDocuments, type DocumentWithSimilarity } from "./ragFunctions";
import { LoadingIcon } from "../../components/common/LoadingIcon";
import { DocumentTagsCell } from "./DocumentTagsCell";


const DocumentPage: React.FC = () => {
  const {
    activeDocument,
    deactiveDocument,
    userDocuments,
    userValidatorDocuments,
    create,
    update,
    softDelete,
    importDocument,
    updateValidationStatus,
    creatorDocuments,
    generateEmbedding
  } = useDocument();

  const [searchStatus, setSearchStatus] = useState<number>(1);
  const Documents = searchStatus === 1 ? activeDocument : searchStatus === 2 ? deactiveDocument : [...activeDocument, ...deactiveDocument];

  const modal = useModal();
  const editorModal = useModal();
  const [editing, setEditing] = useState<Document | null>(null);
  const [showRagSearch, setShowRagSearch] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<string>("");
  const [contentSaveCallback, setContentSaveCallback] = useState<((content: string) => void) | null>(null);
  const [query, setQuery] = useState("");
  const [activeTabId, setActiveTabId] = useState("geral");
  const [dateFilter, setDateFilter] = useState<{ startDate: string; endDate: string }>({ startDate: "", endDate: "" });
  const [authorFilter, setAuthorFilter] = useState<number | null>(null);
  const [tagFilter, setTagFilter] = useState<number | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tagFilteredDocIds, setTagFilteredDocIds] = useState<number[]>([]);
  const { t } = useTranslation();
  const { userProfile, user } = useAuthContext();
  const { getDocumentsByTag, activeTag } = useTag();
  const { activeUser } = useUser();
  const { activeFolder } = useFolder();
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ragSearchQuery, setRagSearchQuery] = useState("");
  const [isRagSearching, setIsRagSearching] = useState(false);
  const [ragResults, setRagResults] = useState<DocumentWithSimilarity[]>([]);
  const [showRagResults, setShowRagResults] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const resetToFirstPage = () => setCurrentPage(1);
  const importFileRef = useRef<HTMLInputElement>(null);
  const importModal = useModal();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  useEffect(() => {
    resetToFirstPage();
  }, [query, JSON.stringify(dateFilter), authorFilter, tagFilter, showAdvancedFilters, searchStatus, activeTabId]);

  const paginate = (rows: Document[]) => {
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  };

  const useIsNarrow = (breakpoint = 480) => {
    const [isNarrow, setIsNarrow] = useState(false);
    useEffect(() => {
      const onResize = () => setIsNarrow(window.innerWidth < breakpoint);
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, [breakpoint]);
    return isNarrow;
  };

  const PaginationBar: React.FC<{ total: number }> = ({ total }) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const isNarrow = useIsNarrow();

    const canPrev = currentPage > 1;
    const canNext = currentPage < totalPages;

    const tt = (key: string, fallback: string) => {
      const v = t(key) as unknown as string;
      return v && v !== key ? v : fallback;
    };

    
    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [totalPages]);

    if (total === 0) return null;

    const containerStyle: React.CSSProperties = isNarrow
      ? {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: 8,
        alignItems: 'center',
        paddingTop: 12,
      }
      : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingTop: 12,
      };

    return (
      <div style={containerStyle}>
        {}
        <div style={{ fontSize: 14, color: '#666', textAlign: isNarrow ? 'center' : 'left', gridColumn: isNarrow ? '1 / -1' : undefined }}>
          {tt('pagination.showing', 'Mostrando')} {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, total)} {tt('pagination.of', 'de')} {total}
        </div>

        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, color: '#666' }}>{tt('pagination.rows_per_page', 'Itens/pág.')}</label>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); resetToFirstPage(); }}
            style={{ padding: '6px 8px', border: '1px solid #ced4da', borderRadius: 6 }}
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: isNarrow ? 'end' : 'flex-end' }}>
          <Button
            variant="ghost"
            aria-label={tt('pagination.prev', 'Anterior')}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            <FiChevronLeft /> {!isNarrow && tt('pagination.prev', 'Anterior')}
          </Button>
          <div style={{ minWidth: 64, textAlign: 'center' }}>{currentPage} / {totalPages}</div>
          <Button
            variant="ghost"
            aria-label={tt('pagination.next', 'Próxima')}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={!canNext}
          >
            {!isNarrow && tt('pagination.next', 'Próxima')} <FiChevronRight />
          </Button>
        </div>
      </div>
    );
  };
  

  useEffect(() => {
    const loadDocumentsByTag = async () => {
      if (tagFilter) {
        try {
          const response = await getDocumentsByTag(tagFilter);
          if (response && !response.erro && response.objeto) {
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

  
  const handleImportButtonClick = () => {
    if (importFileRef.current) {
      importFileRef.current.click();
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      
      importModal.open();
    }
  };

  const handleImportDocument = async () => {
    const file = importFileRef.current?.files?.[0];

    if (!file || !selectedFolderId) {
      notificationActions.showError(t('documents.importMissingData') || 'Selecione um arquivo e uma pasta');
      return;
    }

    try {
      setIsLoading(true);
      const response = await importDocument(file, selectedFolderId);
      console.log(response)
      importModal.close();
      
      if (importFileRef.current) {
        importFileRef.current.value = '';
      }

      navigate(`/document/details/${response.objeto.documentId}`);

    } catch (error) {
      console.error("Erro ao importar documento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContentFromForm = (currentContent: string, onContentSaved: (newContent: string) => void) => {
    setEditingContent(currentContent);
    setContentSaveCallback(() => onContentSaved);
    editorModal.open();
  };


  const Columns = (
    _: (c: Document) => void,
    onToggleStatus: (id: number) => void,
    onView: (c: Document) => void,
    __: (c: Document) => void
  ): ColumnDef<Document>[] => {
    const baseCols: ColumnDef<Document>[] = [
      {
        key: "Title",
        header: t("documents.title_field"),
        render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
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
          const canEdit = () => {
            if (user && (user.Profile === 1 || user.Profile === 2)) {
              return true;
            }
            if (user && user.Profile === 3) {
              if (row.UserId === user.UserId) {
                return true;
              }
              const folder = activeFolder.find((f) => f.FolderId === row.FolderId);
              if (folder && folder.ValidatorId === user.UserId) {
                return true;
              }
            }
            return true;
          };

          return (
            <div style={{ display: 'flex', gap: '4px' }}>

              {/* <>
                <Button
                  variant="ghost"
                  onClick={() => onView(row)}
                  title={t("documents.view_document")}
                >
                  <FiEye />
                </Button>
              </> */}
              {canEdit() && (
                <>
                  <ActionButtons onEdit={() => onView(row)} onToggleStatus={onToggleStatus} row={row} id={row.DocumentId} />
                </>
              )}
            </div>
          );
        }
      });
    }
    return baseCols;
  };

  const getFilteredDocuments = (documents: Document[]) => {
    let filtered = [...documents];

    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(document => {
        const searchableText = [document.Title || "", document.Content || ""].join(" ").toLowerCase();
        return searchableText.includes(searchQuery);
      });
    }

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

    if (authorFilter) {
      filtered = filtered.filter(document => document.UserId === authorFilter);
    }

    if (tagFilter && tagFilteredDocIds.length > 0) {
      filtered = filtered.filter(document => tagFilteredDocIds.includes(document.DocumentId));
    } else if (tagFilter && tagFilteredDocIds.length === 0) {
      filtered = [];
    }

    return filtered;
  };

  const getMyDocuments = () => {
    if (!user) return [];

    return creatorDocuments;
  };

  // const handleAdd = () => { setEditing(null); modal.open(); };
  const handleEdit = (c: Document) => { setEditing(c); modal.open(); };
  const handleSave = async (payload: any) => {
    let documentId = editing ? editing.DocumentId : null;
    try {
      if (editing) {
        await update(editing.DocumentId, payload);
        await updateValidationStatus(editing.DocumentId, null, "");
      } else {
        const response = await create(payload);
        documentId = response.objeto.documentId;
      }
      navigate(`/document/details/${documentId}`);
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    } finally {
      modal.close();
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

  const handleRagSearch = async () => {
    if (!ragSearchQuery.trim()) return;

    setIsRagSearching(true);
    setShowRagResults(true);

    try {
      
      const queryEmbedding = await generateEmbedding(ragSearchQuery);

      if (!queryEmbedding) {
        notificationActions.showError("Não foi possível gerar embeddings para a busca");
        setIsRagSearching(false);
        return;
      }

      console.log(`Embedding generated successfully with length: ${queryEmbedding.length}`);

      
      const allDocuments = [...activeDocument, ...deactiveDocument];
      console.log(`Searching among ${allDocuments.length} total documents`);

      
      const withEmbeddings = allDocuments.filter(d => d.Embedding && d.Embedding.length > 0);
      console.log(`${withEmbeddings.length} documents have embeddings`);

      
      const similarDocuments = findSimilarDocuments(
        activeDocument,
        queryEmbedding,
        {
          maxResults: 5,      
          threshold: 0.3,     
          forceResults: false, 
          minResults: 2       
        }
      );

      console.log(`Found ${similarDocuments.length} similar documents`);

      if (similarDocuments.length > 0) {
        
        similarDocuments.forEach((doc, i) => {
          console.log(`Result ${i + 1}: Score ${doc.similarityScore.toFixed(4)} - ${doc.Title}`);
        });
      }

      
      setRagResults(similarDocuments);

      
      if (similarDocuments.length === 0) {
        notificationActions.showError(t("documents.no_similar_documents"));
      }
    } catch (error) {
      console.error(t("documents.error_during_search"), error);
      notificationActions.showError(t("documents.error_during_search"));
    } finally {
      setIsRagSearching(false);
    }
  };


  const columns = Columns(handleEdit, handleToggleStatus, handleView, handleEditContent);

  const InfoAlert = ({ type, title, description }: { type: string; title: string; description: string }) => {
    const colors = {
      info: { bg: `${theme.colors.primary}15`, border: theme.colors.primary, icon: 'ℹ️' },
      success: { bg: theme.colors.primary === '#4f46e5' ? '#065f4615' : '#e8f5e9', border: theme.colors.primary === '#4f46e5' ? '#065f46' : '#4CAF50', icon: '✅' },
      warning: { bg: theme.colors.primary === '#4f46e5' ? '#92400e15' : '#fff3cd', border: theme.colors.primary === '#4f46e5' ? '#92400e' : '#ffc107', icon: '⚠️' }
    } as const;
    const color = (colors as any)[type] || colors.info;

    return (
      <div style={{ background: color.bg, border: `1px solid ${color.border}`, borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '14px', color: theme.colors.text }}>
        {color.icon} <strong>{title}:</strong> {description}
      </div>
    );
  };

  const EmptyState = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div style={{ textAlign: 'center', padding: '48px 16px', color: '#666' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ marginBottom: '8px', color: '#333' }}>{title}</h3>
      <p style={{ color: '#666' }}>{description}</p>
    </div>
  );

  const AdvancedFilters = () => (
    <div style={{ background: `${theme.colors.primary}15`, border: '1px solid #dee2e6', borderRadius: '8px', padding: '16px', marginBottom: '16px', display: showAdvancedFilters ? 'block' : 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>{t("documents.filters.date_range") || "Período"}</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="date" value={dateFilter.startDate} onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))} style={{ flex: 1, padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px' }} />
            <input type="date" value={dateFilter.endDate} onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))} style={{ flex: 1, padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px' }} />
          </div>
        </div>

        {}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>{t("documents.filters.author") || "Autor"}</label>
          <select value={authorFilter || ""} onChange={(e) => setAuthorFilter(e.target.value ? Number(e.target.value) : null)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px' }}>
            <option value="">{t("documents.filters.all_authors") || "Todos os autores"}</option>
            {activeUser.map(user => (<option key={user.UserId} value={user.UserId}>{user.Name}</option>))}
          </select>
        </div>

        {}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>{t("documents.filters.tag")}</label>
          <select value={tagFilter || ""} onChange={(e) => setTagFilter(e.target.value ? Number(e.target.value) : null)} style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px' }}>
            <option value="">{t("documents.filters.all_tags")}</option>
            {activeTag.map(tag => (<option key={tag.TagId} value={tag.TagId}>{tag.Name}</option>))}
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
                <>⏳{t('documents.loading')}</>
              ) : (
                <>✓ {tagFilteredDocIds.length} documento(s) encontrado(s){t('documents.found')}</>
              )}

            </div>
          )}
        </div>
      </div>

      { }
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="ghost"
          onClick={() => {
            setDateFilter({ startDate: "", endDate: "" });
            setAuthorFilter(null);
            setTagFilter(null);
          }}
        >
          {t("documents.filters.clear_filters")}
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
          <InfoAlert type="info" title={t("documents.tabs.general_alert_title")} description={t("documents.tabs.general_alert_description")} />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <FilterBar columns={columns} value={query} onChange={setQuery} placeholder={t("documents.search_documents")} />
            <Button variant="ghost" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} title={t("documents.filters.advanced_filters") || "Filtros avançados"}>
              <FiFilter /> {showAdvancedFilters ? (t("documents.filters.hide") || "Ocultar") : (t("documents.filters.show") || "Mostrar")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowRagSearch(!showRagSearch)}
              title={t("documents.semantic_search")}
            >
              <FiSearch /> {showRagSearch ? (t("documents.filters.rag.hide") || "Ocultar") : (t("documents.filters.rag.show") || "Mostrar")}
            </Button>
          </div>

          { }
          <AdvancedFilters />

          {}
          {showRagSearch && (
            <div style={{ marginBottom: '16px' }}>
              <RagSearchContainer>
                <RagSearchTitle>
                  <FiSearch style={{ marginRight: '8px' }} />
                  {t("documents.semantic_search")}
                </RagSearchTitle>
                <RagSearchDescription>
                  {t("documents.semantic_search_description")}
                </RagSearchDescription>
                <RagSearchControls>
                  <RagSearchInput
                    type="text"
                    value={ragSearchQuery}
                    onChange={(e) => setRagSearchQuery(e.target.value)}
                    placeholder={t("documents.search_by_meaning")}
                  />
                  <RagSearchButton
                    onClick={handleRagSearch}
                    disabled={isRagSearching || !ragSearchQuery.trim()}
                  >
                    {isRagSearching ? (
                      <Spinner aria-hidden="true" />
                    ) : (
                      <FiSearch />
                    )}
                    {t("actions.find_similar")}
                  </RagSearchButton>
                </RagSearchControls>

                {}
                {showRagResults && (
                  <RagResultsContainer>
                    <RagResultsHeader>
                      <RagResultsCount>
                        {
                          ragResults.length === 0 && !isRagSearching ? (
                            t("documents.no_similar_documents")
                          ) : null
                        }

                        {ragResults.length > 0
                          ? `${ragResults.length} ${t("documents.similar_documents")} ${t("documents.found")}`
                          : null}
                      </RagResultsCount>

                      {ragResults.length > 0 && (
                        <RagResultsClear
                          onClick={() => {
                            setRagResults([]);
                            setShowRagResults(false);
                            setRagSearchQuery("");
                          }}
                        >
                          <FiX />
                          {t("actions.clear_results")}
                        </RagResultsClear>
                      )}
                    </RagResultsHeader>

                    {ragResults.length > 0 && (
                      <RagResultsList>
                        {ragResults.map((doc) => (
                          <RagResultItem
                            key={doc.DocumentId}
                            onClick={() => navigate(`/document/details/${doc.DocumentId}`)}
                          >
                            <RagResultTitle>
                              <FiFileText style={{ marginRight: '8px' }} />
                              {doc.Title}
                              <RagResultScore>
                                {t("documents.similarity")}: {(doc as any).similarityScore?.toFixed(2) || "N/A"}
                              </RagResultScore>
                            </RagResultTitle>
                            <RagResultContent>
                              {doc.Content && doc.Content.length > 150
                                ? `${doc.Content.substring(0, 150)}...`
                                : doc.Content}
                            </RagResultContent>
                            <RagResultView>
                              {t("documents.click_to_view")}
                            </RagResultView>
                          </RagResultItem>
                        ))}
                      </RagResultsList>
                    )}
                  </RagResultsContainer>
                )}
              </RagSearchContainer>
            </div>
          )}

          {userProfile && (
            <div style={{ marginBottom: '16px' }}>
              <SelectSelector changeFunction={setSearchStatus} searchStatus={searchStatus} />
            </div>
          )}

          {(() => {
            const filtered = getFilteredDocuments(Documents);
            return (
              <>
                <DataTable columns={columns} data={paginate(filtered)} pageSize={pageSize} />
                <PaginationBar total={filtered.length} />
              </>
            );
          })()}
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
          <InfoAlert type="success" title={t("documents.tabs.my_documents_alert_title")} description={t("documents.tabs.my_documents_alert_description")} />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <FilterBar columns={columns} value={query} onChange={setQuery} placeholder={t("documents.tabs.search_my_documents")} />
            <Button variant="ghost" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <FiFilter /> {showAdvancedFilters ? (t("documents.filters.hide") || "Ocultar") : (t("documents.filters.show") || "Mostrar")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowRagSearch(!showRagSearch)}
              title={t("documents.semantic_search")}
            >
              <FiSearch /> {showRagSearch ? (t("documents.filters.rag.hide") || "Ocultar") : (t("documents.filters.rag.show") || "Mostrar")}
            </Button>
          </div>

          <AdvancedFilters />

          {getMyDocuments().length === 0 ? (
            <EmptyState icon="📄" title={t("documents.tabs.no_documents_created_title")} description={t("documents.tabs.no_documents_created_description")} />
          ) : (
            (() => {
              const mine = getFilteredDocuments(getMyDocuments());
              return (
                <>
                  <DataTable columns={columns} data={paginate(mine)} pageSize={pageSize} />
                  <PaginationBar total={mine.length} />
                </>
              );
            })()
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
          <InfoAlert type="warning" title={t("documents.tabs.to_edit_alert_title")} description={t("documents.tabs.to_edit_alert_description")} />

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
              <FiFilter /> {showAdvancedFilters ? (t("documents.filters.hide")) : (t("documents.filters.show"))}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowRagSearch(!showRagSearch)}
              title={t("documents.semantic_search")}
            >
              <FiSearch /> {showRagSearch ? (t("documents.filters.rag.hide") || "Ocultar") : (t("documents.filters.rag.show") || "Mostrar")}
            </Button>
          </div>

          <AdvancedFilters />

          {userDocuments.length === 0 ? (
            <EmptyState icon="✅" title={t("documents.tabs.no_documents_to_edit_title")} description={t("documents.tabs.no_documents_to_edit_description")} />
          ) : (
            (() => {
              const toEdit = getFilteredDocuments(userDocuments);
              return (
                <>
                  <DataTable columns={columns} data={paginate(toEdit)} pageSize={pageSize} />
                  <PaginationBar total={toEdit.length} />
                </>
              );
            })()
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
          <InfoAlert type="info" title={t("documents.tabs.validations_alert_title")} description={t("documents.tabs.validations_alert_description")} />

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
              <FiFilter /> {showAdvancedFilters ? (t("documents.filters.hide")) : (t("documents.filters.show"))}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowRagSearch(!showRagSearch)}
              title={t("documents.semantic_search")}
            >
              <FiSearch /> {showRagSearch ? (t("documents.filters.rag.hide") || "Ocultar") : (t("documents.filters.rag.show") || "Mostrar")}
            </Button>
          </div>

          <AdvancedFilters />

          {userValidatorDocuments.length === 0 ? (
            <EmptyState icon="🎉" title={t("documents.tabs.no_validations_pending_title")} description={t("documents.tabs.no_validations_pending_description")} />
          ) : (
            (() => {
              const vals = getFilteredDocuments(userValidatorDocuments);
              return (
                <>
                  <DataTable columns={columns} data={paginate(vals)} pageSize={pageSize} />
                  <PaginationBar total={vals.length} />
                </>
              );
            })()
          )}
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title={t("documents.title")}
      actions={
        <>
          {}
          <Button
            onClick={handleImportButtonClick}
            variant="primary"
            aria-label={t('documents.import') || 'Importar'}
            style={{ marginRight: '8px' }}
          >
            <FiUpload /> {t('documents.import') || 'Importar'}
          </Button>

          {}
          <input
            type="file"
            ref={importFileRef}
            style={{ display: 'none' }}
            accept=".pdf,.docx"
            onChange={handleFileSelection}
          />

          {}
          <Button
            onClick={() => {
              setEditing(null);
              modal.open();
            }}
            variant="primary"
            aria-label={t("documents.add")}
          >
            <FiPlus /> {t("documents.add")}
          </Button>
        </>
      }
    >
      { }
      <TabContainer
        tabs={tabs}
        defaultTab="geral"
        onTabChange={handleTabChange}
      />
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

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? t("documents.edit_document") : t("documents.add_document")}>
        <DocumentForm initial={editing ?? undefined} onCancel={modal.close} onSave={handleSave} onEditContent={handleEditContentFromForm} />
      </Modal>

      <Modal isOpen={editorModal.isOpen} onClose={editorModal.close} title={t("documents.markdown_editor")}>
        <MarkdownEditorPage initialContent={editingContent} onSave={handleSaveContent} onCancel={editorModal.close} />
      </Modal>

      {}
      <Modal
        isOpen={importModal.isOpen}
        onClose={importModal.close}
        title={t('documents.importDocument') || 'Importar Documento'}
      >
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              {t('documents.selectFolder') || 'Selecione a pasta'}
            </label>
            <select
              value={selectedFolderId || ''}
              onChange={(e) => setSelectedFolderId(Number(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">{t('documents.selectFolderPlaceholder') || 'Selecione uma pasta...'}</option>
              {activeFolder.map((folder) => (
                <option key={folder.FolderId} value={folder.FolderId}>
                  {folder.Name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={importModal.close} variant="ghost">
              {t('navigation.cancel') || 'Cancelar'}
            </Button>
            <Button onClick={handleImportDocument} variant="primary">
              { }
              {isLoading ? (
                <>
                  <LoadingIcon size={18} />
                  {t("actions.importing") || "Importando..."}
                </>
              ) : (
                t('documents.import') || 'Importar'
              )}
            </Button>


          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default DocumentPage;

