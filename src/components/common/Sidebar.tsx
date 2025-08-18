import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";


const Wrap = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  height: 100vh;
  border-right: 1px solid rgba(0,0,0,0.06);
`;

const Sidebar: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <Wrap>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link to="/">Home</Link>

        {
          user && user.Profile === 1 && (
            <Link to="/companies">Empresas</Link>

          )
        }
        {
          user && user.Profile <= 2 &&  user.Profile > 0 &&(
            <>
              <Link to="/user">Usuários</Link>
              <Link to="/group">Grupos</Link>
              <Link to="/folder">Pastas</Link>
            </>

          )
        }
        <Link to="/task">Tarefas</Link>
        <Link to="/document">Documentos</Link>

      </nav>
    </Wrap>
  );
};

export default Sidebar;
