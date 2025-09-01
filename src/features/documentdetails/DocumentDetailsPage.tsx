import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../user/useUser';
import { useFolder } from '../folder/useFolder';
import { useAuthContext } from '../../context/AuthContext';

import { FiArrowLeft, FiEdit, FiFolder, FiUser, FiCalendar } from 'react-icons/fi';
import { useTypedTranslation } from '../../context/LanguageContext';
import { useDocument } from '../document/useDocument';
import PageLayout from '../../components/common/PageLayout';
import { Button } from '../../components/common/Button';
import { MarkdownEditor } from '../../components/common/MarkdownEditor';

const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DocumentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  margin-bottom: 16px;
`;

const DocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
`;

const DocumentTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  flex: 1;
`;

const DocumentMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
`;

const MetaIcon = styled.div`
  color: #007bff;
`;

const MarkdownEditorContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  overflow: hidden;
  min-height: 70vh;
  
  /* Otimizações para evitar piscamento */
  * {
    transition: none !important;
    animation: none !important;
  }
`;

const ValidationSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  margin-bottom: 16px;
`;

const ValidationTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ValidationStatus = styled.div<{ status: 'pending' | 'approved' | 'rejected' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
  
  ${({ status }) => {
    switch (status) {
      case 'approved':
        return 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
      case 'rejected':
        return 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
      default:
        return 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;';
    }
  }}
`;

const ValidatorActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ValidatorNote = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const CommentsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
`;

const CommentsTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const CommentItem = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #007bff;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: #333;
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: #666;
`;

const CommentText = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.5;
`;

const CommentForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentTextarea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const EmptyComments = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
}

const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTypedTranslation();
  const { getById } = useDocument();
  const { activeUser } = useUser();
  const { activeFolder } = useFolder();
  const { user } = useAuthContext();
  
  const [document, setDocument] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [validatorNote, setValidatorNote] = useState('');
  const [validationStatus, setValidationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState('');

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) {
        setError('ID do documento não fornecido');
        setLoading(false);
        return;
      }

      try {
        const response = await getById(Number(id));
        if (response && !response.erro) {
          setDocument(response.objeto);
          setDocumentContent(response.objeto.content || '');
          setError(null);
        } else {
          setError('Documento não encontrado');
        }
      } catch (error) {
        console.error('Erro ao carregar documento:', error);
        setError('Erro ao carregar documento');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id, getById]);

  const handleContentChange = (newContent: string) => {
    setDocumentContent(newContent);
  };

  const handleSaveDocument = async () => {
    if (document && user) {
      try {
        // Aqui você chamaria a API para salvar o documento
        // await updateDocument(document.id, { content: documentContent });
        console.log('Documento salvo:', documentContent);
        
        // Adicionar comentário de edição
        const comment: Comment = {
          id: Date.now().toString(),
          text: `📝 Documento editado por ${user.Name}`,
          author: user.Name || 'Usuário',
          date: new Date().toLocaleString('pt-BR')
        };
        setComments([...comments, comment]);
      } catch (error) {
        console.error('Erro ao salvar documento:', error);
      }
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        author: user?.Name || 'Usuário Atual',
        date: new Date().toLocaleString('pt-BR')
      };
      
      setComments([...comments, comment]);
      setNewComment('');
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

  // Funções de validação
  const handleApprove = async () => {
    try {
      // Aqui você chamaria a API para aprovar o documento
      setValidationStatus('approved');
      
      // Adicionar comentário de aprovação se houver nota
      if (validatorNote.trim()) {
        const comment: Comment = {
          id: Date.now().toString(),
          text: `✅ Documento aprovado: ${validatorNote.trim()}`,
          author: user?.Name || 'Validador',
          date: new Date().toLocaleString('pt-BR')
        };
        setComments([...comments, comment]);
      }
      setValidatorNote('');
      
      // Aqui você pode adicionar notificação de sucesso
      console.log('Documento aprovado com sucesso!');
    } catch (error) {
      console.error('Erro ao aprovar documento:', error);
    }
  };

  const handleReject = async () => {
    if (!validatorNote.trim()) {
      alert('Por favor, adicione uma nota explicando o motivo da rejeição.');
      return;
    }
    
    try {
      // Aqui você chamaria a API para rejeitar o documento
      setValidationStatus('rejected');
      
      // Adicionar comentário de rejeição
      const comment: Comment = {
        id: Date.now().toString(),
        text: `❌ Documento rejeitado: ${validatorNote.trim()}`,
        author: user?.Name || 'Validador',
        date: new Date().toLocaleString('pt-BR')
      };
      setComments([...comments, comment]);
      setValidatorNote('');
      
      // Aqui você pode adicionar notificação de sucesso
      console.log('Documento rejeitado com sucesso!');
    } catch (error) {
      console.error('Erro ao rejeitar documento:', error);
    }
  };

  if (loading) {
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
              <DocumentTitle>{document.title || 'Documento sem título'}</DocumentTitle>
            </DocumentHeader>

            <DocumentMeta>
              <MetaItem>
                <MetaIcon><FiUser /></MetaIcon>
                <span>Criado por: {creator?.Name || 'Desconhecido'}</span>
              </MetaItem>
              <MetaItem>
                <MetaIcon><FiFolder /></MetaIcon>
                <span>Pasta: {folder?.Name || 'Sem pasta'}</span>
              </MetaItem>
              <MetaItem>
                <MetaIcon><FiCalendar /></MetaIcon>
                <span>Criado em: {new Date(document.createdAt).toLocaleString('pt-BR')}</span>
              </MetaItem>
              <MetaItem>
                <MetaIcon><FiCalendar /></MetaIcon>
                <span>Última modificação: {new Date(document.updatedAt).toLocaleString('pt-BR')}</span>
              </MetaItem>
            </DocumentMeta>
          </DocumentCard>

          <MarkdownEditorContainer>
            <MarkdownEditor
              label=""
              value={documentContent}
              onChange={handleContentChange}
              placeholder="Este documento não possui conteúdo..."
            />
          </MarkdownEditorContainer>
        </LeftColumn>

        <RightColumn>
          {isValidator() && (
            <ValidationSection>
              <ValidationTitle>
                🔍 Validação do Documento
              </ValidationTitle>
              
              <ValidationStatus status={validationStatus}>
                {validationStatus === 'approved' && '✅ Aprovado'}
                {validationStatus === 'rejected' && '❌ Rejeitado'}
                {validationStatus === 'pending' && '⏳ Pendente de validação'}
              </ValidationStatus>

              {validationStatus === 'pending' && (
                <ValidatorActions>
                  <ValidatorNote
                    value={validatorNote}
                    onChange={(e) => setValidatorNote(e.target.value)}
                    placeholder="Adicione uma nota sobre a validação (opcional para aprovação, obrigatória para rejeição)..."
                  />
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button 
                      onClick={handleApprove}
                      style={{ background: '#28a745', color: 'white', flex: 1 }}
                    >
                      ✅ Aprovar
                    </Button>
                    <Button 
                      onClick={handleReject}
                      style={{ background: '#dc3545', color: 'white', flex: 1 }}
                    >
                      ❌ Rejeitar
                    </Button>
                  </div>
                </ValidatorActions>
              )}

              {validationStatus !== 'pending' && (
                <div style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                  Documento já foi validado
                </div>
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
                  Nenhum comentário ainda
                </EmptyComments>
              ) : (
                comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <CommentHeader>
                      <CommentAuthor>{comment.author}</CommentAuthor>
                      <CommentDate>{comment.date}</CommentDate>
                    </CommentHeader>
                    <CommentText>{comment.text}</CommentText>
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
              <div style={{ alignSelf: 'flex-start' }}>
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Adicionar Comentário
                </Button>
              </div>
            </CommentForm>
          </CommentsSection>
        </RightColumn>
      </DetailsContainer>
    </PageLayout>
  );
};

export default DocumentDetailsPage;