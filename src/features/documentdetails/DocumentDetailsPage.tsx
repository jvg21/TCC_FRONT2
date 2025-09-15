import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../user/useUser';
import { useFolder } from '../folder/useFolder';
import { useAuthContext } from '../../context/AuthContext';
import { FiArrowLeft, FiEdit, FiFolder, FiUser, FiCalendar } from 'react-icons/fi';
import { useTypedTranslation } from '../../context/LanguageContext';
import { useDocument } from '../document/useDocument';
import { useComment } from '../comment/useComment';
import PageLayout from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { MarkdownEditor } from '../../components/markdownEditor/MarkdownEditor';
import { notificationActions } from '../notifications/useNotification';
import { CommentAuthor, CommentDate, CommentForm, CommentHeader, CommentItem, CommentsList, CommentsSection, CommentsTitle, CommentText, CommentTextarea, DetailsContainer, DocumentCard, DocumentContent, DocumentHeader, DocumentMeta, DocumentTitle, EmptyComments, ErrorContainer, LeftColumn, LoadingContainer, MetaIcon, MetaItem, MetaValue, RightColumn, StatusBadge, ValidationSection, ValidationStatus, ValidationTitle, ValidatorActions, ValidatorNote } from '../../components/common/Components';
import { useAI } from '../ai/useAI';




const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTypedTranslation();
  const { getById, update, updateValidationStatus } = useDocument();
  const { activeUser, getById: getUserId } = useUser();
  const { activeFolder } = useFolder();
  const { user } = useAuthContext();


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
  const [validationStatus, setValidationStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState('');

  const hasLoadedRef = useRef(false);


  useEffect(() => {
    const loadDocument = async () => {
      if (hasLoadedRef.current || !id) {
        if (!id) {
          setError('ID do documento não fornecido');
          setLoading(false);
        }
        return;
      }
      hasLoadedRef.current = true;
      try {
        const response = await getById(Number(id));
        if (response && !response.erro) {
          setDocument(response.objeto);
          setDocumentContent(response.objeto.content || '');
          setValidationStatus(response.objeto.isValid ?? null);
          setError(null);
          await getCommentsByDocumentId(Number(id));
        } else {
          setError('Documento não encontrado');
        }
      } catch (error) {
        console.error('Erro ao carregar documento:', error);
        setError('Erro ao carregar documento');
        hasLoadedRef.current = false;
      } finally {
        setLoading(false);
      }
    };
    loadDocument();
  }, [id]);

  useEffect(() => {
    hasLoadedRef.current = false;
  }, [id]);

  const handleContentChange = (newContent: string) => {
    setDocumentContent(newContent);
  };

  const handleSaveDocument = async () => {
    if (document && user) {
      try {
        await update(document.documentId, {
          Title: document.title,
          Content: documentContent,
          FolderId: document.folderId
        });
        // Adicionar comentário de edição real
        if (user.UserId) {
          await createComment({
            Content: `📝 Documento editado por ${user.Name}`,
            DocumentId: document.documentId,
            UserId: user.UserId
          });
        }
      } catch (error) {
        console.error('Erro ao salvar documento:', error);
      }
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() && document && user) {
      try {
        if (user.UserId) {
          await createComment({
            Content: newComment.trim(),
            DocumentId: document.documentId,
            UserId: user.UserId
          });
        }
        setNewComment('');
      } catch (error) {
        notificationActions.showError('Erro ao adicionar comentário');
      }
    }
  };

  const handleBack = () => {
    navigate('/document');
  };

  // Verificar se usuário é validador
  const isValidator = () => {
    if (!document || !user) return false;
    const folder = activeFolder.find(f => f.FolderId === document.folderId);
    return folder && folder.ValidatorId === user.UserId;
  };

  // Funções de validação ATUALIZADAS
  const handleApprove = async (status:boolean) => {
    try {
      await updateValidationStatus(document.documentId, status, validatorNote);
      setDocument((prev: any) => ({ ...prev, isValid: true }));
      setValidationStatus(true);
      if (user && user.UserId) {
        await createComment({
          Content: status?`✅ Documento aprovado por ${user?.Name}${validatorNote ? `: ${validatorNote}` : ''}`:`❌ Documento rejeitado por ${user?.Name}: ${validatorNote}`,
          DocumentId: document.documentId,
          UserId: user.UserId
        });
      }
      setValidatorNote('');
    } catch (error) {
      console.error('Erro ao aprovar documento:', error);
      setValidationStatus(document?.isValid ?? null);
    }
  };


  const handleGenerateSummary = async () => {
    if (documentContent) {
      generateSummary(Number(id))
      setSummary(summary)
    } else {
      notificationActions.showError('O conteúdo do documento está vazio.');
    }
  }

  if (loading || loadingComments) {
    return (
      <PageLayout title="Detalhes do Documento">
        <LoadingContainer>
          <div>Carregando documento...</div>
        </LoadingContainer>
      </PageLayout>
    );
  }

  if (error || !document) {
    return (
      <PageLayout title="Detalhes do Documento">
        <ErrorContainer>
          <div>{error || 'Documento não encontrado'}</div>
          <Button onClick={handleBack} style={{ marginTop: '16px' }}>
            <FiArrowLeft /> Voltar
          </Button>
        </ErrorContainer>
      </PageLayout>
    );
  }

  // Buscar informações do criador e pasta
  const creator = activeUser.find(u => u.UserId === document.userId);
  const folder = activeFolder.find(f => f.FolderId === document.folderId);

  return (
    <PageLayout
      title="Detalhes do Documento"
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={handleBack}>
            <FiArrowLeft /> Voltar
          </Button>
          <Button onClick={handleGenerateSummary}>
            <FiEdit /> Gerar Resumo
          </Button>
          <Button onClick={handleSaveDocument}>
            <FiEdit /> Salvar Alterações
          </Button>
        </div>
      }
    >
      <DetailsContainer>
        <LeftColumn>
          <DocumentCard>
            <DocumentHeader>
              <DocumentTitle>{document.title}</DocumentTitle>
            </DocumentHeader>

            <DocumentMeta>
              <MetaItem>
                <MetaIcon>
                  <FiUser />
                </MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Criado por</div>
                  <MetaValue>{creator?.Name || 'Usuário não encontrado'}</MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon>
                  <FiFolder />
                </MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Pasta</div>
                  <MetaValue>{folder?.Name || 'Pasta não encontrada'}</MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon>
                  <FiCalendar />
                </MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Criado em</div>
                  <MetaValue>
                    {document.createdAt ? new Date(document.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                  </MetaValue>
                </div>
              </MetaItem>

              <MetaItem>
                <MetaIcon>
                  <FiCalendar />
                </MetaIcon>
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Atualizado em</div>
                  <MetaValue>
                    {document.updatedAt ? new Date(document.updatedAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                  </MetaValue>
                </div>
              </MetaItem>
            </DocumentMeta>

            <DocumentContent>
              <MarkdownEditor
                value={documentContent}
                onChange={handleContentChange}
              />
            </DocumentContent>
          </DocumentCard>
        </LeftColumn>

        <RightColumn>
          {/* Seção de Validação - apenas para validadores */}
          {isValidator() && (
            <ValidationSection>
              <ValidationTitle>
                🔍 Validação do Documento
              </ValidationTitle>

              <ValidationStatus>
                <StatusBadge status={
                  validationStatus === null ? 'pending' :
                    validationStatus === true ? 'approved' : 'rejected'
                }>
                  {validationStatus === null && '⏳ Pendente de Validação'}
                  {validationStatus === true && '✅ Documento Aprovado'}
                  {validationStatus === false && '❌ Documento Rejeitado'}
                </StatusBadge>
              </ValidationStatus>

              {validationStatus === null && (
                <ValidatorActions>
                  <ValidatorNote
                    value={validatorNote}
                    onChange={(e) => setValidatorNote(e.target.value)}
                    placeholder="Adicione uma nota sobre a validação (opcional para aprovação, obrigatória para rejeição)..."
                  />

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      onClick={()=>handleApprove(true)}
                      style={{ background: '#28a745', color: 'white', flex: 1 }}
                    >
                      ✅ Aprovar
                    </Button>
                    <Button
                      onClick={()=>handleApprove(false)}
                      style={{ background: '#dc3545', color: 'white', flex: 1 }}
                    >
                      ❌ Rejeitar
                    </Button>
                  </div>
                </ValidatorActions>
              )}


            </ValidationSection>
          )}

          <CommentsSection>
            <CommentsTitle>
              💬 Comentários ({comments.length})
            </CommentsTitle>

            <CommentsList>
              {comments.length === 0 ? (
                <EmptyComments>
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </EmptyComments>
              ) : (
                comments
                  .filter((c) => c.DocumentId === document.documentId && (c.IsActive ?? true))
                  .sort((a, b) => {
                    const dateA = new Date(a.CreatedAt || '').getTime();
                    const dateB = new Date(b.CreatedAt || '').getTime();
                    return dateA - dateB;
                  })
                  .map((comment) => (
                    <CommentItem key={comment.CommentId}>
                      <CommentHeader>
                        <CommentAuthor>{
                          activeUser.find(u => u.UserId === comment.UserId)?.Name || 'Usuário'
                        }</CommentAuthor>
                        <CommentDate>{comment.CreatedAt ? new Date(comment.CreatedAt).toLocaleString('pt-BR') : ''}</CommentDate>
                      </CommentHeader>
                      <CommentText>{comment.Content}</CommentText>
                    </CommentItem>
                  ))
              )}
            </CommentsList>

            <CommentForm>
              <CommentTextarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Digite seu comentário..."
              />
              <Button onClick={handleAddComment}>
                Adicionar Comentário
              </Button>
            </CommentForm>
          </CommentsSection>
        </RightColumn>
      </DetailsContainer>
    </PageLayout>
  );
};

export default DocumentDetailsPage;