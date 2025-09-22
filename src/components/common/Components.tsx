import styled from "styled-components";

export const DetailsContainer = styled.div`
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

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DocumentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  margin-bottom: 16px;
`;

export const DocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
`;

export const DocumentTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  flex: 1;
`;

export const DocumentMeta = styled.div`
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

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

export const MetaIcon = styled.div`
  color: #007bff;
  display: flex;
  align-items: center;
`;

export const MetaValue = styled.span`
  color: #333;
  font-weight: 500;
`;

export const DocumentContent = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 16px;
`;

export const ValidationSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  margin-bottom: 16px;
`;

export const ValidationTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ValidationStatus = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

export const StatusBadge = styled.span<{ status: 'pending' | 'approved' | 'rejected' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
  
  ${({ status }) => {
    switch (status) {
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
        return `
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        `;
    }
  }}
`;

export const ValidatorActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ValidatorNote = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

export const CommentsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
`;

export const CommentsTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const CommentItem = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #007bff;
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const CommentAuthor = styled.span`
  font-weight: 600;
  color: #333;
`;

export const CommentDate = styled.span`
  font-size: 12px;
  color: #666;
`;

export const CommentText = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.5;
`;

export const CommentForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CommentTextarea = styled.textarea`
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

export const EmptyComments = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #666;
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

export const TemplatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.colors.background};
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.muted};
    
  &:hover {
    color: ${({ $active, theme }) => 
      $active ? 'white' : theme.colors.text};
  }
`;

export const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const TemplateCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary}40;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    min-height: 160px;
  }
`;

export const TemplateIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
  }
`;

export const TemplateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const TemplatePreview = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  
  @media (max-width: 768px) {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
`;

export const TemplateActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${TemplateCard}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    opacity: 1;
  }
`;

export const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.edit {
    background: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary}25;
    }
  }
  
  &.copy {
    background: rgba(34, 197, 94, 0.15);
    color: rgb(34, 197, 94);
    
    &:hover {
      background: rgba(34, 197, 94, 0.25);
    }
  }
  
  &.delete {
    background: ${({ theme }) => theme.colors.danger}15;
    color: ${({ theme }) => theme.colors.danger};
    
    &:hover {
      background: ${({ theme }) => theme.colors.danger}25;
    }
  }
`;

export const CreateTemplateCard = styled.div`
  background: transparent;
  border: 2px dashed rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 24px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.muted};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}60;
    background: ${({ theme }) => theme.colors.primary}05;
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    min-height: 160px;
  }
`;

export const CreateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  
  ${CreateTemplateCard}:hover & {
    background: ${({ theme }) => theme.colors.primary}25;
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

export const CreateText = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  grid-column: 1 / -1;
  
  @media (max-width: 768px) {
    padding: 48px 16px;
  }
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.primary}10;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const EmptyDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 24px 0;
  max-width: 400px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
// Adicionar após os componentes de Comments

export const TagsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
`;

export const TagsTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  min-height: 40px;
`;

export const TagItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e7f3ff;
  color: #0066cc;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #b3d9ff;
`;

export const TagRemoveButton = styled.button`
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 16px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #004499;
  }
`;

export const TagForm = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const TagSelect = styled.select`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const EmptyTags = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
`;

// Substituir TagSelect por:

export const TagInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

export const TagInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

export const TagSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

export const TagSuggestionItem = styled.div<{ $isCreate?: boolean }>`
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 14px;
  
  ${({ $isCreate }) => $isCreate && `
    color: #007bff;
    font-weight: 500;
    border-top: 1px solid #eee;
  `}
  
  &:hover {
    background: #f8f9fa;
  }
`;

export const TagSuggestionEmpty = styled.div`
  padding: 10px 12px;
  color: #666;
  font-size: 14px;
  font-style: italic;
  text-align: center;
`;