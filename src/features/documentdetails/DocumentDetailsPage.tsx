import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../user/useUser';
import { useFolder } from '../folder/useFolder';
import { useAuthContext } from '../../context/AuthContext';
import { FiArrowLeft, FiEdit, FiFolder, FiUser, FiCalendar, FiMessageSquare, FiChevronDown, FiDownload, FiClock } from 'react-icons/fi';
import { useTypedTranslation } from '../../context/LanguageContext';
import { useDocument } from '../document/useDocument';
import { useComment } from '../comment/useComment';
import PageLayout from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { MarkdownEditor } from '../../components/markdownEditor/MarkdownEditor';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { notificationActions } from '../notifications/useNotification';
import {
  CommentAuthor,
  CommentDate,
  CommentForm,
  CommentHeader,
  CommentItem,
  CommentsList,
  CommentsSection,
  CommentsTitle,
  CommentText,
  CommentTextarea,
  DetailsContainer,
  DocumentCard,
  DocumentContent,
  DocumentHeader,
  DocumentMeta,
  DocumentTitle,
  EmptyComments,
  ErrorContainer,
  LeftColumn,
  LoadingContainer,
  MetaIcon,
  MetaItem,
  MetaValue,
  RightColumn,
  StatusBadge,
  ValidationSection,
  ValidationStatus,
  ValidationTitle,
  ValidatorActions,
  ValidatorNote
} from '../../components/common/Components';
import { useAI } from '../ai/useAI';
import { DocumentTags } from '../../components/common/DocumentTags';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../../components/common/Modal';
import { MarkdownEditorPage } from '../markdown-editor/MarkdownEditorPage';
import { ActionsBar, AuthorIndicator, CloseButton, CommentsScrollArea, DropdownContainer, DropdownItemButton, DropdownMenu, SectionLabel, SidebarContent, SidebarHeader, SidebarOverlay, SidebarTitle, VersionAuthor, VersionBadge, VersionDate, VersionItem, VersionSection, VersionSidebar } from '../../components/common/documentDetailsComponents';


const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTypedTranslation();
  const { GetDocumentValidationById, update, updateValidationStatus, transformSingleApiData, getDocumentVersionsByDocumentId } = useDocument();
  const { activeUser } = useUser();
  const { activeFolder } = useFolder();
  const { user } = useAuthContext();
  const showResume = useModal();
  const [document, setDocument] = useState<any>(null);
  const [summary, setSummary] = useState('');
  const [newComment, setNewComment] = useState('');
  const [documentVersions, setDocumentVersions] = useState<any[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  const {
    comments,
    getCommentsByDocumentId,
    createComment,
    loading: loadingComments
  } = useComment();

  const { generateSummary } = useAI();
  const [validatorNote, setValidatorNote] = useState('');
  const [validationStatus, setValidationStatus] = useState<number | boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const hasLoadedRef = useRef(false);

  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [showSummaryDropdown, setShowSummaryDropdown] = useState(false);
  const summaryDropdownRef = useRef<HTMLDivElement | null>(null);

  /* NOVO: loading apenas do envio do comentário */
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    const doc = typeof window !== 'undefined' ? window.document : null;
    if (!doc) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
      if (summaryDropdownRef.current && !summaryDropdownRef.current.contains(event.target as Node)) {
        setShowSummaryDropdown(false);
      }
    };

    doc.addEventListener('mousedown', handleClickOutside);
    return () => {
      doc.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadDocument = async () => {
      if (hasLoadedRef.current || !id) {
        if (!id) {
          setError(t("messages.error.generic") || 'ID do documento não fornecido');
          setLoading(false);
        }
        return;
      }
      hasLoadedRef.current = true;
      try {
        const response = await GetDocumentValidationById(Number(id));
        if (response && !response.erro) {
          setDocument(transformSingleApiData(response.objeto.document));
          setDocumentContent(response.objeto.document.content || '');
          setValidationStatus(response.objeto.status);
          setValidatorNote(response.objeto.comment || '');
          console.log('Documento carregado:', response.objeto);
        } else {
          setError(t("messages.error.generic"));
        }
      } catch (err) {
        setError(t("messages.error.generic"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id, t]);

  useEffect(() => {
    if (document?.DocumentId) {
      getCommentsByDocumentId(document.DocumentId);
      loadDocumentVersions(document.DocumentId);
    }
  }, [document?.DocumentId]);

  useEffect(() => {
    if (showVersionHistory && document?.DocumentId && documentVersions.length === 0) {
      loadDocumentVersions(document.DocumentId);
    }
  }, [showVersionHistory]);

  const handleBack = () => {
    navigate('/document');
  };

  const handleSaveDocument = async () => {
    if (!document) return;

    try {
      await update(document.DocumentId, {
        ...document,
        Content: documentContent,
      });
      notificationActions.showNotification(
        t("documents.updateSuccess") || 'Documento atualizado com sucesso!',
        'success'
      );

      await updateValidationStatus(document.DocumentId, null, validatorNote);
      setValidationStatus(0);
    } catch (error) {
      notificationActions.showError(
        t("messages.error.generic") || 'Erro ao salvar documento'
      );
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !document || !user) return;

    try {
      setIsAddingComment(true); // ativa loading do botão
      await createComment({
        Content: newComment,
        DocumentId: document.DocumentId,
        UserId: user.UserId,
      });
      setNewComment('');
      
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      notificationActions.showError(t("messages.error.generic") || 'Erro ao adicionar comentário');
    } finally {
      setIsAddingComment(false); // desativa loading do botão
    }
  };

  const handleValidation = async (isValid: boolean) => {
    if (!document) return;

    try {
      setValidationStatus(isValid);
      await updateValidationStatus(document.DocumentId, isValid, validatorNote);
      setValidatorNote(validatorNote);
      setValidationStatus(isValid ? 1 : 2);
    } catch (error) {
      console.error('Erro ao aprovar documento:', error);
      setValidationStatus(document?.isValid ?? null);
    }
  };

  const handleGenerateSummary = async (mode: 'default' | 'curto' | 'bullet' = 'default') => {
    if (!documentContent) {
      notificationActions.showError(t("messages.error.validation"));
      return;
    }

    setLoadingSummary(true);
    setShowSummaryDropdown(false);

    let modelType = 1;
    switch (mode) {
      case 'default':
        modelType = 1; // ResumoEstruturado
        break;
      case 'curto':
        modelType = 3; // ResumoAnalitico
        break;
      case 'bullet':
        modelType = 2; // ResumoComparativo
        break;
    }

    try {
      const summaryText = await generateSummary(Number(id), modelType);
      const summaryContent = summaryText.content || '';
      setSummary(summaryContent);

      setTimeout(() => {
        showResume.open();
      }, 100);
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      notificationActions.showError(t("messages.error.generic") || 'Erro ao gerar resumo');
    } finally {

      setSummary((s) => s);
      setLoadingSummary(false);
    }
  };

  const handleExportPDF = async () => {
    if (!document) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPosition = margin;

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(document.Title, margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Criado por: ${creator?.Name || 'N/A'}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Pasta: ${folder?.Name || 'N/A'}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Data de criação: ${formatDate(document.CreatedAt)}`, margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      const lines = pdf.splitTextToSize(documentContent, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);

      pdf.save(`${document.Title}.pdf`);
      notificationActions.showNotification('PDF exportado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      notificationActions.showError('Erro ao exportar PDF');
    }
  };

  const loadDocumentVersions = async (docId: number) => {
    setLoadingVersions(true);
    try {
      const response = await getDocumentVersionsByDocumentId(docId);
      if (response && !response.erro && response.objeto) {
        const sortedVersions = response.objeto.sort((a: any, b: any) =>
          new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
        setDocumentVersions(sortedVersions);
      }
    } catch (error) {
      console.error('Erro ao carregar versões:', error);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleLoadVersion = (version: any) => {
    setDocumentContent(version.content || '');
    setShowVersionHistory(false);
    notificationActions.showNotification(
      `Versão de ${new Date(version.createdAt).toLocaleDateString('pt-BR')} carregada no editor`,
      'success'
    );
  };

  const handleExportDOCX = async () => {
    if (!document) return;

    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: document.Title,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Criado por: ${creator?.Name || 'N/A'}`,
                  break: 1,
                }),
                new TextRun({
                  text: `Pasta: ${folder?.Name || 'N/A'}`,
                  break: 1,
                }),
                new TextRun({
                  text: `Data de criação: ${formatDate(document.CreatedAt)}`,
                  break: 2,
                }),
              ],
            }),
            new Paragraph({
              text: documentContent,
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${document.Title}.docx`);
      notificationActions.showNotification('DOCX exportado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao exportar DOCX:', error);
      notificationActions.showError('Erro ao exportar DOCX');
    }
  };

  const handleExportMarkdown = () => {
    if (!document) return;

    try {
      let markdown = `# ${document.Title}\n\n`;
      markdown += `**Criado por:** ${creator?.Name || 'N/A'}\n`;
      markdown += `**Pasta:** ${folder?.Name || 'N/A'}\n`;
      markdown += `**Data de criação:** ${formatDate(document.CreatedAt)}\n\n`;
      markdown += `---\n\n`;
      markdown += documentContent;

      const blob = new Blob([markdown], { type: 'text/markdown' });
      saveAs(blob, `${document.Title}.md`);
      notificationActions.showNotification('Markdown exportado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao exportar Markdown:', error);
      notificationActions.showError('Erro ao exportar Markdown');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getValidationStatusText = (status: number) => {
    if (status === 0) {
      return `⏳ ${t("documents.document_details.validation.pending") || "Pendente"}`;
    }
    if (status === 1) {
      return `✅ ${t("documents.document_details.validation.approved") || "Aprovado"}`;
    }
    return `❌ ${t("documents.document_details.validation.rejected") || "Rejeitado"}`;
  };

  /* NOVO: o loading global da página ignora o loading do envio de comentário */
  const showGlobalLoading = loading || (loadingComments && !isAddingComment);

  if (showGlobalLoading) {
    return (
      <PageLayout title={t("documents.document_details.title") || "Detalhes do Documento"}>
        <LoadingContainer>
          <div>{t("loading.loading") || "Carregando documento..."}</div>
        </LoadingContainer>
      </PageLayout>
    );
  }

  if (error || !document) {
    return (
      <PageLayout title={t("documents.document_details.title") || "Detalhes do Documento"}>
        <ErrorContainer>
          <div>{error || t("messages.error.not_found") || 'Documento não encontrado'}</div>
          <Button onClick={handleBack} style={{ marginTop: '16px' }}>
            <FiArrowLeft /> {t("documents.document_details.back") || "Voltar"}
          </Button>
        </ErrorContainer>
      </PageLayout>
    );
  }

  const creator = activeUser.find(u => u.UserId === document.UserId);
  const folder = activeFolder.find(f => f.FolderId === document.FolderId);

  return (
    <PageLayout
      title={t("documents.document_details.title") || "Detalhes do Documento"}
      actions={
        <ActionsBar>
          <Button variant="ghost" onClick={handleBack}>
            <FiArrowLeft /> {t("documents.document_details.back") || "Voltar"}
          </Button>

          <Button variant="ghost" onClick={() => setShowVersionHistory(true)}>
            <FiClock /> {t("documents.document_details.version_history.button") || "Histórico"}
          </Button>

          <DropdownContainer ref={dropdownRef}>
            <Button onClick={() => setShowExportDropdown(!showExportDropdown)} variant="primary">
              <FiDownload style={{ marginRight: 6 }} />
              {t("documents.document_details.export.button") || "Exportar"}
              <FiChevronDown style={{ marginLeft: 6 }} />
            </Button>

            {showExportDropdown && (
              <DropdownMenu>
                <DropdownItemButton onClick={() => { handleExportPDF(); setShowExportDropdown(false); }}>
                  📄 {t("documents.document_details.export.export_pdf") || "Exportar PDF"}
                </DropdownItemButton>
                <DropdownItemButton onClick={() => { handleExportDOCX(); setShowExportDropdown(false); }}>
                  📝 {t("documents.document_details.export.export_docx") || "Exportar DOCX"}
                </DropdownItemButton>
                <DropdownItemButton onClick={() => { handleExportMarkdown(); setShowExportDropdown(false); }}>
                  ⬇️ {t("documents.document_details.export.export_md") || "Exportar MD"}
                </DropdownItemButton>
              </DropdownMenu>
            )}
          </DropdownContainer>

          <DropdownContainer ref={summaryDropdownRef}>
            <Button
              onClick={() => setShowSummaryDropdown(!showSummaryDropdown)}
              disabled={loadingSummary}
            >
              {loadingSummary ? (
                <>⏳{t('documents.document_details.generating_summary')}</>
              ) : (
                <>{t("documents.document_details.generate_summary") || "Gerar Resumo"} <FiChevronDown /></>
              )}
            </Button>
            {showSummaryDropdown && !loadingSummary && (
              <DropdownMenu>
                <DropdownItemButton onClick={() => handleGenerateSummary('default')}>
                  <span style={{ marginRight: '8px' }}>📝</span>
                  {t("documents.document_details.summary_types.structured") || "Resumo estruturado"}
                  <span style={{ fontSize: '11px', display: 'block', marginTop: '2px', color: '#666' }}>
                    {t("documents.document_details.summary_types.structured_desc") || "Tópicos organizados com hierarquia"}
                  </span>
                </DropdownItemButton>

                <DropdownItemButton onClick={() => handleGenerateSummary('bullet')}>
                  <span style={{ marginRight: '8px' }}>🔍</span>
                  {t("documents.document_details.summary_types.comparative") || "Resumo comparativo"}
                  <span style={{ fontSize: '11px', display: 'block', marginTop: '2px', color: '#666' }}>
                    {t("documents.document_details.summary_types.comparative_desc") || "Destaca pontos de contraste e semelhança"}
                  </span>
                </DropdownItemButton>

                <DropdownItemButton onClick={() => handleGenerateSummary('curto')}>
                  <span style={{ marginRight: '8px' }}>💡</span>
                  {t("documents.document_details.summary_types.analytical") || "Resumo analítico"}
                  <span style={{ fontSize: '11px', display: 'block', marginTop: '2px', color: '#666' }}>
                    {t("documents.document_details.summary_types.analytical_desc") || "Ideias centrais e suas relações lógicas"}
                  </span>
                </DropdownItemButton>
              </DropdownMenu>
            )}
          </DropdownContainer>

          <Button onClick={handleSaveDocument}>
            <FiEdit /> {t("documents.document_details.save_changes") || "Salvar Alterações"}
          </Button>
        </ActionsBar>
      }
    >
      <DetailsContainer>
        <LeftColumn>
          <DocumentCard>
            <DocumentHeader>
              <DocumentTitle>{document.Title}</DocumentTitle>
            </DocumentHeader>

            <DocumentMeta>
              <MetaItem>
                <MetaIcon><FiUser /></MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {t("documents.document_details.created_by") || "Criado por"}
                  </div>
                  <MetaValue>{creator?.Name || t("messages.error.not_found") || 'Usuário não encontrado'}</MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon><FiFolder /></MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {t("documents.document_details.folder") || "Pasta"}
                  </div>
                  <MetaValue>{folder?.Name || t("messages.error.not_found") || 'Pasta não encontrada'}</MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon><FiCalendar /></MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {t("documents.document_details.created_at") || "Criado em"}
                  </div>
                  <MetaValue>{formatDate(document.CreatedAt)}</MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon><FiCalendar /></MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {t("documents.document_details.updated_at") || "Atualizado em"}
                  </div>
                  <MetaValue>{formatDate(document.UpdatedAt)}</MetaValue>
                </div>
              </MetaItem>
            </DocumentMeta>

            <DocumentContent>
              <MarkdownEditor
                value={documentContent}
                onChange={setDocumentContent}
              />
            </DocumentContent>
          </DocumentCard>
        </LeftColumn>

        <RightColumn>
          <ValidationSection>
            <ValidationTitle>
              {t("documents.document_details.validation.title") || "Validação do Documento"}
            </ValidationTitle>

            {(validationStatus === 1 || validationStatus === 2) && (
              <ValidatorActions>
                <ValidationStatus>
                  <StatusBadge status={validationStatus === 1 ? 'approved' : 'rejected'}>
                    {getValidationStatusText(validationStatus as number)}
                  </StatusBadge>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}></div>

                  {validatorNote && (
                    <ValidatorNote
                      value={validatorNote}
                      readOnly
                    />
                  )}
                </ValidationStatus>
              </ValidatorActions>
            )}

            {validationStatus === 0 && (
              <ValidatorActions>
                <ValidatorNote
                  placeholder={t("documents.document_details.validation.add_note")}
                  value={validatorNote}
                  onChange={(e) => setValidatorNote(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    onClick={() => handleValidation(true)}
                    style={{ flex: 1, background: '#28a745' }}
                  >
                    ✅ {t("documents.document_details.validation.approve") || "Aprovar"}
                  </Button>
                  <Button
                    onClick={() => handleValidation(false)}
                    style={{ flex: 1, background: '#dc3545' }}
                  >
                    ❌ {t("documents.document_details.validation.reject")}
                  </Button>
                </div>
              </ValidatorActions>
            )}
          </ValidationSection>

          {document?.DocumentId && (
            <DocumentTags documentId={document.DocumentId} />
          )}

          <CommentsSection>
            <CommentsTitle>
              <FiMessageSquare />
              {t("documents.document_details.comments.title") || "Comentários"}
            </CommentsTitle>

            <CommentsScrollArea>
              <CommentsList>
                {!comments || comments.length === 0 ? (
                  <EmptyComments>
                    {t("documents.document_details.comments.count") || "Nenhum comentário ainda. Seja o primeiro a comentar!"}
                  </EmptyComments>
                ) : (
                  comments.map((comment) => {
                    const commentAuthor = activeUser.find(u => u.UserId === comment.UserId);
                    return (
                      <CommentItem key={comment.CommentId}>
                        <CommentHeader>
                          <CommentAuthor>
                            {commentAuthor?.Name || t("messages.error.not_found") || 'Usuário não encontrado'}
                          </CommentAuthor>
                          <CommentDate>
                            {formatDate(comment.CreatedAt!)}
                          </CommentDate>
                        </CommentHeader>
                        <CommentText>{comment.Content}</CommentText>
                      </CommentItem>
                    );
                  })
                )}
              </CommentsList>
            </CommentsScrollArea>

            <CommentForm>
              <CommentTextarea
                placeholder={
                  t("documents.document_details.comments.placeholder") ||
                  "Digite seu comentário..."
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                onClick={handleAddComment}
                disabled={isAddingComment}
                style={{ alignSelf: 'flex-start', marginTop: '8px', opacity: isAddingComment ? 0.8 : 1 }}
              >
                {isAddingComment
                  ? (t("loading.loading") ? `⏳ ${t("loading.loading")}` : '⏳ Enviando...')
                  : (t("documents.document_details.comments.add_comment") || "Adicionar Comentário")}
              </Button>
            </CommentForm>
          </CommentsSection>
        </RightColumn>
      </DetailsContainer>

      <Modal
        isOpen={showResume.isOpen}
        onClose={showResume.close}
        title={t("documents.document_details.generate_summary") || "Resumo do Documento"}
      >
        <MarkdownEditorPage
          initialContent={summary}
          onSave={() => { }}
          onCancel={showResume.close}
        />
      </Modal>

      <SidebarOverlay
        isOpen={showVersionHistory}
        onClick={() => setShowVersionHistory(false)}
      />

      <VersionSidebar isOpen={showVersionHistory}>
        <SidebarHeader>
          <SidebarTitle>
            {t("documents.document_details.version_history.title") || "Histórico de versões"}
          </SidebarTitle>
          <CloseButton onClick={() => setShowVersionHistory(false)}>
            ✕
          </CloseButton>
        </SidebarHeader>

        <SidebarContent>
          {loadingVersions ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              {t('loading.loading')}
            </div>
          ) : documentVersions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              {t('documents.document_details.version_history.no_versions') }
            </div>
          ) : (
            <>
              <SectionLabel>
                {t("documents.document_details.version_history.today") || "Histórico"}
              </SectionLabel>

              <VersionSection>
                {documentVersions.map((version, index) => {
                  const versionAuthor = activeUser.find(u => u.UserId === version.userId);
                  const isCurrentVersion = index === 0;

                  return (
                    <VersionItem
                      key={version.documentVersionId || index}
                      onClick={() => handleLoadVersion(version)}
                    >
                      <VersionDate>
                        {new Date(version.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {isCurrentVersion && (
                          <VersionBadge>
                            {t("documents.document_details.version_history.current_version") || "Versão atual"}
                          </VersionBadge>
                        )}
                      </VersionDate>
                      <VersionAuthor>
                        <AuthorIndicator />
                        {versionAuthor?.Name || t("messages.error.not_found") || 'Usuário'}
                      </VersionAuthor>
                      {version.comment && (
                        <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                          {version.comment}
                        </div>
                      )}
                    </VersionItem>
                  );
                })}
              </VersionSection>
            </>
          )}
        </SidebarContent>
      </VersionSidebar>
    </PageLayout>
  );
};

export default DocumentDetailsPage;

