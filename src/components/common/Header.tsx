import React from "react";
import styled from "styled-components";
import { useThemeContext } from "../../contexts/ThemeContext";
import { Button } from "../common/Button";
import { LanguageSelector } from "../../context/LanguageContext";

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
  
  return (
    <Wrap>
      <ControlsGroup>
        {/* Seletor de Idioma */}
        <LanguageSelector 
          variant="minimal" 
          showFlag={true} 
          showLabel={false}
        />
        
        {/* Toggle de Tema */}
        <Button variant="ghost" onClick={toggleTheme}>
          {themeName === "light" ? "Dark" : "Light"} Mode
        </Button>
      </ControlsGroup>
    </Wrap>
  );
};

export default Header;
