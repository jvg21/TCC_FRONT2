import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { light, dark, type Theme } from "../styles/theme";

interface ThemeContextValue {
  themeName: "light" | "dark";
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [themeName, setThemeName] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as "light" | "dark") || "light";
  });

  const toggleTheme = () => {
    setThemeName((currentTheme) => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeName);
  }, [themeName]);

  const theme = themeName === "light" ? light : dark;
  
  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProviderWrapper")
  };
  return context;
};
