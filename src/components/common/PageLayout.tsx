import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 80px 16px 16px 16px; 
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const PageActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

interface PageLayoutProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  actions, 
  children 
}) => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{title}</PageTitle>
        {actions && <PageActions>{actions}</PageActions>}
      </PageHeader>
      <PageContent>
        {children}
      </PageContent>
    </PageContainer>
  );
};

export default PageLayout;