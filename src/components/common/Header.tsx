import React from "react";
import styled from "styled-components";
import { useThemeContext } from "../../contexts/ThemeContext";
import { Button } from "../common/Button";

const Wrap = styled.header`
  padding: ${({ theme }) => theme.spacing.md};
  display:flex; align-items:center; justify-content:flex-end;
  border-bottom: 1px solid rgba(0,0,0,0.06);
`;

const Header: React.FC = () => {
  const { toggleTheme, themeName } = useThemeContext();
  return (
    <Wrap>
      <Button variant="ghost" onClick={toggleTheme}>
        {themeName === "light" ? "Dark" : "Light"} Mode
      </Button>
    </Wrap>
  );
};

export default Header;
