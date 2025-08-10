import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Root = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
`;

const Content = styled.main`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
`;

const TitleBar = styled.div`
  display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;
`;

const Title = styled.h2` margin:0; `;

const PageLayout: React.FC<{ title?: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ title, children, actions }) => {
  return (
    <Root>
      <Sidebar />
      <div>
        <Header />
        <Content>
          {title && <TitleBar><Title>{title}</Title><div>{actions}</div></TitleBar>}
          {children}
        </Content>
      </div>
    </Root>
  );
};

export default PageLayout;
