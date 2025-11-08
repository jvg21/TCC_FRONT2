import React from "react";
import styled from "styled-components";
import { useThemeContext } from "../../context/ThemeContext";
import { Button } from "../common/Button";
import { LanguageSelector } from "../../context/LanguageContext";
import { useLogin } from "../../features/login/useLogin";
import { useNavigate } from "react-router-dom";


const Wrap = styled.header`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex; 
  align-items: center; 
  justify-content: flex-end;
  gap: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Header: React.FC = () => {
  const { toggleTheme, themeName } = useThemeContext();
  const { logout } = useLogin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true });
  }

  return (
    <Wrap>
      <ControlsGroup>
        {}
        <LanguageSelector
          variant="minimal"
          showFlag={true}
          showLabel={false}
        />

        {}
        <Button variant="ghost" onClick={toggleTheme}>
          {themeName === "light" ? "Dark" : "Light"} Mode
        </Button>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </ControlsGroup>
    </Wrap>
  );
};

export default Header;
