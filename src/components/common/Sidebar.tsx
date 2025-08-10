import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrap = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  height: 100vh;
  border-right: 1px solid rgba(0,0,0,0.06);
`;

const Sidebar: React.FC = () => {
  return (
    <Wrap>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link to="/">Home</Link>
        <Link to="/companies">Empresas</Link>
      </nav>
    </Wrap>
  );
};

export default Sidebar;
