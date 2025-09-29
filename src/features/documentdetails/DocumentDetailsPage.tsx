import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../user/useUser';
import { useFolder } from '../folder/useFolder';
import { useAuthContext } from '../../context/AuthContext';
import { FiArrowLeft, FiEdit, FiFolder, FiUser, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { useTypedTranslation } from '../../context/LanguageContext';
import { useDocument } from '../document/useDocument';
import { useComment } from '../comment/useComment';
import PageLayout from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { MarkdownEditor } from '../../components/markdownEditor/MarkdownEditor';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTypedTranslation();
  const { GetDocumentValidationById, update, updateValidationStatus, transformSingleApiData } = useDocument();
  const { activeUser } = useUser();
  const { activeFolder } = useFolder();
  const { user } = useAuthContext();
  const showResume = useModal();

  const [document, setDocument] = useState<any>(null);
  const [summary, setSummary] = useState('');
  const [newComment, setNewComment] = useState('');

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

  const hasLoadedRef = useRef(false);

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
        // console.log('Resposta da API:', response);
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

  // Carregar comentários quando o documento for carregado
  useEffect(() => {
    if (document?.DocumentId) {
      getCommentsByDocumentId(document.DocumentId);
    }
  }, [document?.documentId]);

  const handleBack = () => {
    navigate('/documents');
  };

  const handleSaveDocument = async () => {
    if (!document) return;

    try {
      await update(document.DocumentId, {
        ...document,
        content: documentContent,
      });
      notificationActions.showNotification(
        t("documents.updateSuccess") || 'Documento atualizado com sucesso!',
        'success'
      );
    } catch (error) {
      notificationActions.showError(
        t("messages.error.generic") || 'Erro ao salvar documento'
      );
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !document) return;

    try {
      await createComment({
        Content: newComment,
        DocumentId: document.DocumentId,
        UserId: user!.UserId,
      });
      setNewComment('');
      notificationActions.showNotification(
        t("messages.success.created") || 'Comentário adicionado com sucesso!',
        'success'
      );
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleValidation = async (isValid: boolean) => {
    if (!document) return;

    try {
      setValidationStatus(isValid);
      await updateValidationStatus(document.DocumentId, isValid, validatorNote);

      // if (isValid) {
      //   await createComment({
      //     Content: `✅ ${t("documents.document_details.validation.approve")} ${t("documents.document_details.validated_by") || "por"} ${user?.Name}${validatorNote ? `: ${validatorNote}` : ''}`,
      //     DocumentId: document.DocumentId,
      //     UserId: user!.UserId
      //   });
      // } else {
      //   await createComment({
      //     Content: `❌ ${t("documents.document_details.validation.reject") } ${t("documents.document_details.validated_by") || "por"} ${user?.Name}: ${validatorNote}`,
      //     DocumentId: document.DocumentId,
      //     UserId: user!.UserId
      //   });
      // }
      setValidatorNote('');
    } catch (error) {
      console.error('Erro ao aprovar documento:', error);
      setValidationStatus(document?.isValid ?? null);
    }
  };

  const handleGenerateSummary = async () => {
    if (documentContent) {
      const summaryText = await generateSummary(Number(id));
      // console.log(summaryText);
      setSummary(summaryText.content || '');
      showResume.open();
    } else {
      notificationActions.showError(
        t("messages.error.validation")
      );
    }
  };

  // ADICIONAR APÓS handleGenerateSummary:

  // Exportar como PDF
  const handleExportPDF = async () => {
    if (!document) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPosition = margin;

      // Título
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(document.Title, margin, yPosition);
      yPosition += 10;

      // Metadados
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Criado por: ${creator?.Name || 'N/A'}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Pasta: ${folder?.Name || 'N/A'}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Data de criação: ${formatDate(document.CreatedAt)}`, margin, yPosition);
      yPosition += 10;

      // Conteúdo
      pdf.setFontSize(12);
      const lines = pdf.splitTextToSize(documentContent, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);

      pdf.save(`${document.Title}.pdf`);
      notificationActions.showNotification('PDF exportado com sucesso!','success');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      notificationActions.showError('Erro ao exportar PDF');
    }
  };

  // Exportar como DOCX
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

  // Exportar como Markdown
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

  // Função para formatar data seguindo o padrão do projeto
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para obter status de validação traduzido
  const getValidationStatusText = (status: number) => {
    if (status === 0) {
      return `⏳ ${t("documents.document_details.validation.pending") || "Pendente"}`;
    }
    if (status === 1) {
      return `✅ ${t("documents.document_details.validation.approved") || "Aprovado"}`;
    }
    return `❌ ${t("documents.document_details.validation.rejected") || "Rejeitado"}`;
  };

  if (loading || loadingComments) {
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

  // Buscar informações do criador e pasta seguindo o padrão do projeto
  const creator = activeUser.find(u => u.UserId === document.UserId);
  const folder = activeFolder.find(f => f.FolderId === document.FolderId);

  return (
    <PageLayout
      title={t("documents.document_details.title") || "Detalhes do Documento"}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={handleBack}>
            <FiArrowLeft /> {t("documents.document_details.back") || "Voltar"}
          </Button>
          
          <Button onClick={handleExportPDF} variant="primary">
            📄 PDF
          </Button>
          <Button onClick={handleExportDOCX} variant="primary">
            📝 DOCX
          </Button>
          <Button onClick={handleExportMarkdown} variant="primary">
            ⬇️ MD
          </Button>
          
          <Button onClick={handleGenerateSummary}>
            <FiEdit /> {t("documents.document_details.generate_summary") || "Gerar Resumo"}
          </Button>
          <Button onClick={handleSaveDocument}>
            <FiEdit /> {t("documents.document_details.save_changes") || "Salvar Alterações"}
          </Button>
        </div>
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
                <MetaIcon>
                  <FiUser />
                </MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {t("documents.document_details.created_by") || "Criado por"}
                  </div>
                  <MetaValue>
                    {creator?.Name || t("messages.error.not_found") || 'Usuário não encontrado'}
                  </MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon>
                  <FiFolder />
                </MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {t("documents.document_details.folder") || "Pasta"}
                  </div>
                  <MetaValue>
                    {folder?.Name || t("messages.error.not_found") || 'Pasta não encontrada'}
                  </MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon>
                  <FiCalendar />
                </MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {t("documents.document_details.created_at") || "Criado em"}
                  </div>
                  <MetaValue>
                    {formatDate(document.CreatedAt)}
                  </MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon>
                  <FiCalendar />
                </MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {t("documents.document_details.updated_at") || "Atualizado em"}
                  </div>
                  <MetaValue>
                    {formatDate(document.UpdatedAt)}
                  </MetaValue>
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
          {/* Seção de Validação */}
          <ValidationSection>
            <ValidationTitle>
              {t("documents.document_details.validation.title") || "Status de Validação"}
            </ValidationTitle>


            {
              validationStatus !== 0 &&
              (
                <ValidatorActions>

                  <ValidationStatus>
                    <StatusBadge status={validationStatus === 1 ? 'approved' : 'rejected'}>
                      {getValidationStatusText(validationStatus as number)}
                    </StatusBadge>
                     <div style={{ display: 'flex', gap: '16px', marginTop:'4px' }}></div>

                    {/*campo de texo com o validatorNote readonluy*/}
                    {validatorNote && (
                      <ValidatorNote
                        value={validatorNote}
                        readOnly
                      />

                    )
                    }
                  </ValidationStatus>
                </ValidatorActions>
              )
            }


            {validationStatus === 0 && (
              <ValidatorActions>
                <ValidatorNote
                  placeholder={
                    t("documents.document_details.validation.add_note")
                  }
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

          {/* Seção de Tags */}
          {document?.DocumentId && (
            <DocumentTags documentId={document.DocumentId} />
          )}

          {/* Seção de Comentários */}
          <CommentsSection>
            <CommentsTitle>
              <FiMessageSquare />
              {t("documents.document_details.comments.title") || "Comentários"}
            </CommentsTitle>

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
                style={{ alignSelf: 'flex-start', marginTop: '8px' }}
              >
                {t("documents.document_details.comments.add_comment") || "Adicionar Comentário"}
              </Button>
            </CommentForm>
          </CommentsSection>
        </RightColumn>
      </DetailsContainer>

      {/* Modal para resumo */}
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
    </PageLayout >
  );
};

export default DocumentDetailsPage;