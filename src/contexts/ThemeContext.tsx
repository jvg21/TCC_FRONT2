import React, { createContext, useContext, useState } from "react";
import { ThemeProvider } from "styled-components";
import { light, dark, type Theme } from "../styles/theme";

interface ThemeContextValue {
  themeName: "light" | "dark";
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<"light" | "dark">("light");
  const toggleTheme = () => setThemeName((t) => (t === "light" ? "dark" : "light"));
  const theme = themeName === "light" ? light : dark;
  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProviderWrapper");
  return ctx;
};
