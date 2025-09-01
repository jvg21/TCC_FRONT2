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
