import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../user/useUser';
import { useFolder } from '../folder/useFolder';
import { useAuthContext } from '../../context/AuthContext';
import { FiArrowLeft, FiEdit, FiFolder, FiUser, FiCalendar, FiTag, FiX, FiMessageSquare } from 'react-icons/fi';
import { useTypedTranslation } from '../../context/LanguageContext';
import { useDocument } from '../document/useDocument';
import { useComment } from '../comment/useComment';
import { useTag } from '../tag/useTag';
import PageLayout from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { MarkdownEditor } from '../../components/markdownEditor/MarkdownEditor';
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
  ValidatorNote,
  TagsSection,
  TagsTitle,
  TagsList,
  TagItem,
  TagRemoveButton,
  TagForm,
  TagSelect,
  EmptyTags
} from '../../components/common/Components';
import { useAI } from '../ai/useAI';

const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTypedTranslation();
  const { GetDocumentValidationById, update, updateValidationStatus } = useDocument();
  const { activeUser } = useUser();
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

  // Estados para gerenciamento de tags
  const { 
    activeTag, 
    getTagsByDocument, 
    addDocumentToTag, 
    removeDocumentFromTag 
  } = useTag();

  const [documentTags, setDocumentTags] = useState<any[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const [loadingTags, setLoadingTags] = useState(false);

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
          setError('ID do documento não fornecido');
          setLoading(false);
        }
        return;
      }
      hasLoadedRef.current = true;
      try {
        const response = await GetDocumentValidationById(Number(id));
        if (response && !response.erro) {
          setDocument(response.objeto.document);
          setDocumentContent(response.objeto.document.content || '');
          setValidationStatus(response.objeto.status ?? response.objeto.document.isValid);
          
          // Carregar tags do documento
          await loadDocumentTags();
        } else {
          setError('Erro ao carregar documento');
        }
      } catch (err) {
        setError('Erro ao carregar documento');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  // Carregar comentários quando o documento for carregado
  useEffect(() => {
    if (document?.documentId) {
      getCommentsByDocumentId(document.documentId);
    }
  }, [document?.documentId]);

  // Carregar tags do documento
  const loadDocumentTags = async () => {
    if (!id) return;
    
    setLoadingTags(true);
    try {
      const response = await getTagsByDocument(Number(id));
      if (response && !response.erro) {
        setDocumentTags(response.objeto || []);
      }
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    } finally {
      setLoadingTags(false);
    }
  };

  // Adicionar tag ao documento
  const handleAddTag = async () => {
    if (!selectedTagId || !document) return;
    
    try {
      await addDocumentToTag(document.documentId, Number(selectedTagId));
      await loadDocumentTags();
      setSelectedTagId('');
      notificationActions.showNotification('Tag adicionada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar tag:', error);
    }
  };

  // Remover tag do documento
  const handleRemoveTag = async (tagId: number) => {
    if (!document) return;
    
    try {
      await removeDocumentFromTag(document.documentId, tagId);
      await loadDocumentTags();
      notificationActions.showNotification('Tag removida com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao remover tag:', error);
    }
  };

  // Filtrar tags disponíveis (excluir as já adicionadas)
  const availableTags = activeTag.filter(
    tag => !documentTags.some(dt => dt.tagId === tag.TagId)
  );

  const handleBack = () => {
    navigate('/documents');
  };

  const handleSaveDocument = async () => {
    if (!document) return;

    try {
      await update(document.documentId, {
        ...document,
        content: documentContent,
      });
      notificationActions.showNotification('Documento atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      notificationActions.showError('Erro ao salvar documento');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !document) return;

    try {
      await createComment({
        Content: newComment,
        DocumentId: document.documentId,
        UserId: user!.UserId,
      });
      setNewComment('');
      notificationActions.showNotification('Comentário adicionado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleValidation = async (isValid: boolean) => {
    if (!document) return;

    try {
      setValidationStatus(isValid);
      await updateValidationStatus(document.documentId, isValid);

      if (isValid) {
        await createComment({
          Content: `✅ Documento aprovado por ${user?.Name}${validatorNote ? `: ${validatorNote}` : ''}`,
          DocumentId: document.documentId,
          UserId: user!.UserId
        });
      } else {
        await createComment({
          Content: `❌ Documento rejeitado por ${user?.Name}: ${validatorNote}`,
          DocumentId: document.documentId,
          UserId: user!.UserId
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
      generateSummary(Number(id));
      setSummary(summary);
    } else {
      notificationActions.showError('O conteúdo do documento está vazio.');
    }
  };

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
                    {document.createdAt 
                      ? new Date(document.createdAt).toLocaleDateString('pt-BR')
                      : '-'}
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
                    {document.updatedAt 
                      ? new Date(document.updatedAt).toLocaleDateString('pt-BR')
                      : '-'}
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
            <ValidationTitle>Status de Validação</ValidationTitle>
            <ValidationStatus>
              <StatusBadge 
                status={
                  validationStatus === null ? 'pending' 
                  : validationStatus ? 'approved' 
                  : 'rejected'
                }
              >
                {validationStatus === null ? '⏳ Pendente' 
                 : validationStatus ? '✅ Aprovado' 
                 : '❌ Rejeitado'}
              </StatusBadge>
            </ValidationStatus>

            {validationStatus === null && (
              <ValidatorActions>
                <ValidatorNote
                  placeholder="Adicione uma observação (opcional)..."
                  value={validatorNote}
                  onChange={(e) => setValidatorNote(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    onClick={() => handleValidation(true)}
                    style={{ flex: 1, background: '#28a745' }}
                  >
                    ✅ Aprovar
                  </Button>
                  <Button 
                    onClick={() => handleValidation(false)}
                    style={{ flex: 1, background: '#dc3545' }}
                  >
                    ❌ Rejeitar
                  </Button>
                </div>
              </ValidatorActions>
            )}
          </ValidationSection>

          {/* Seção de Tags */}
          <TagsSection>
            <TagsTitle>
              <FiTag />
              Tags do Documento
            </TagsTitle>

            <TagsList>
              {loadingTags ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '20px', color: '#666' }}>
                  Carregando tags...
                </div>
              ) : documentTags.length === 0 ? (
                <EmptyTags>
                  Nenhuma tag adicionada ainda. Adicione tags para organizar melhor este documento!
                </EmptyTags>
              ) : (
                documentTags.map((tag) => (
                  <TagItem key={tag.tagId}>
                    {tag.name}
                    <TagRemoveButton
                      onClick={() => handleRemoveTag(tag.tagId)}
                      title="Remover tag"
                    >
                      <FiX />
                    </TagRemoveButton>
                  </TagItem>
                ))
              )}
            </TagsList>

            <TagForm>
              <TagSelect
                value={selectedTagId}
                onChange={(e) => setSelectedTagId(e.target.value)}
                disabled={availableTags.length === 0}
              >
                <option value="">
                  {availableTags.length === 0 
                    ? 'Todas as tags já foram adicionadas' 
                    : 'Selecione uma tag...'}
                </option>
                {availableTags.map((tag) => (
                  <option key={tag.TagId} value={tag.TagId}>
                    {tag.Name}
                  </option>
                ))}
              </TagSelect>
              <Button 
                onClick={handleAddTag}
                disabled={!selectedTagId || availableTags.length === 0}
              >
                Adicionar Tag
              </Button>
            </TagForm>
          </TagsSection>

          {/* Seção de Comentários */}
          <CommentsSection>
            <CommentsTitle>
              <FiMessageSquare />
              Comentários
            </CommentsTitle>

            <CommentsList>
              {!comments || comments.length === 0 ? (
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
                        <CommentAuthor>
                          {activeUser.find(u => u.UserId === comment.UserId)?.Name || 'Usuário'}
                        </CommentAuthor>
                        <CommentDate>
                          {comment.CreatedAt 
                            ? new Date(comment.CreatedAt).toLocaleString('pt-BR') 
                            : ''}
                        </CommentDate>
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