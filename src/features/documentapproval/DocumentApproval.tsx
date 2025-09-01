import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiCheck, FiX, FiEye, FiClock } from 'react-icons/fi';

import { DocumentViewer } from '../document/DocumentViewer';
import { useModal } from '../../hooks/useModal';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

const ApprovalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DocumentCard = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const DocumentHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const DocumentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #666;
`;

const StatusBadge = styled.span<{ status: 'pending' | 'approved' | 'rejected' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return `
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        `;
      case 'approved':
        return `
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        `;
      case 'rejected':
        return `
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      default:
        return '';
    }
  }}
`;

const DocumentContent = styled.div`
  margin: 12px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #555;
  max-height: 100px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(transparent, #f8f9fa);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const CommentSection = styled.div`
  margin-top: 16px;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

interface DocumentForApproval {
  DocumentId: number;
  Title: string;
  Content: string;
  CreatedAt: string;
  CreatorName: string;
  Status: 'pending' | 'approved' | 'rejected';
  ApprovalComment?: string;
}

interface DocumentApprovalProps {
  document: DocumentForApproval;
  onApprove: (documentId: number, comment: string) => void;
  onReject: (documentId: number, comment: string) => void;
}

export const DocumentApproval: React.FC<DocumentApprovalProps> = ({
  document,
  onApprove,
  onReject
}) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
  const viewModal = useModal();

  const handleApprove = () => {
    if (pendingAction === 'approve') {
      onApprove(document.DocumentId, comment);
      setComment('');
      setPendingAction(null);
      setShowComment(false);
    } else {
      setPendingAction('approve');
      setShowComment(true);
    }
  };

  const handleReject = () => {
    if (pendingAction === 'reject') {
      onReject(document.DocumentId, comment);
      setComment('');
      setPendingAction(null);
      setShowComment(false);
    } else {
      setPendingAction('reject');
      setShowComment(true);
    }
  };

  const handleCancel = () => {
    setPendingAction(null);
    setShowComment(false);
    setComment('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FiCheck />;
      case 'rejected':
        return <FiX />;
      case 'pending':
      default:
        return <FiClock />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'pending':
      default:
        return 'Pendente';
    }
  };

  return (
    <>
      <DocumentCard>
        <DocumentHeader>
          <DocumentInfo>
            <DocumentTitle>{document.Title}</DocumentTitle>
            <DocumentMeta>
              <span><strong>Criado por:</strong> {document.CreatorName}</span>
              <span><strong>Data:</strong> {new Date(document.CreatedAt).toLocaleDateString('pt-BR')}</span>
              <StatusBadge status={document.Status}>
                {getStatusIcon(document.Status)}
                {getStatusText(document.Status)}
              </StatusBadge>
            </DocumentMeta>
          </DocumentInfo>
        </DocumentHeader>

        <DocumentContent>
          {document.Content?.substring(0, 200) || 'Sem conteúdo'}
          {document.Content?.length > 200 && '...'}
        </DocumentContent>

        {document.ApprovalComment && (
          <div style={{ marginTop: '12px', padding: '8px', background: '#e9ecef', borderRadius: '4px' }}>
            <strong>Comentário da aprovação:</strong> {document.ApprovalComment}
          </div>
        )}

        <ActionButtons>
          <Button
            variant="ghost"
            onClick={viewModal.open}
            title="Visualizar documento completo"
          >
            <FiEye /> Visualizar
          </Button>
          
          {document.Status === 'pending' && (
            <>
              <Button
                variant="primary"
                onClick={handleApprove}
                disabled={pendingAction === 'reject'}
              >
                <FiCheck /> {pendingAction === 'approve' ? 'Confirmar Aprovação' : 'Aprovar'}
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={pendingAction === 'approve'}
              >
                <FiX /> {pendingAction === 'reject' ? 'Confirmar Rejeição' : 'Rejeitar'}
              </Button>
            </>
          )}
          
          {pendingAction && (
            <Button variant="ghost" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
        </ActionButtons>

        {showComment && (
          <CommentSection>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Comentário {pendingAction === 'approve' ? 'da aprovação' : 'da rejeição'}:
            </label>
            <CommentTextarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Adicione um comentário explicando sua decisão..."
            />
          </CommentSection>
        )}
      </DocumentCard>

      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        title="Visualizar Documento"
      >
        <DocumentViewer
          title={document.Title}
          content={document.Content}
          onClose={viewModal.close}
        />
      </Modal>
    </>
  );
};