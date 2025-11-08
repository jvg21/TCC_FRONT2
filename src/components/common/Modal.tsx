import React from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  
  padding: 16px;
  overflow: auto;
`;

const Container = styled.div`
  width: 720px;
  max-width: calc(100% - 32px);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);

  
  display: flex;
  flex-direction: column;
  max-height: 92vh;  
  min-height: 0;     
  overflow: hidden;  

  
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: 0;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};

  
  flex: 1 1 auto;
  min-height: 0;       
  overflow-y: auto;    
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export const Modal: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <Backdrop onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        {title && (
          <Header>
            <h3 style={{ margin: 0 }}>{title}</h3>
          </Header>
        )}
        <Body>
          {children}
        </Body>
      </Container>
    </Backdrop>
  );
};

