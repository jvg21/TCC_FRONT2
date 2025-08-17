import styled from "styled-components";
import { useThemeContext } from "../../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";


const ThemeToggle = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;


export const ThemeSelector = () => {
    const { toggleTheme, themeName } = useThemeContext();
    return (
        <ThemeToggle onClick={toggleTheme} type="button">
            {themeName === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
        </ThemeToggle>
    )

}