import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProviderWrapper } from "./contexts/ThemeContext";
import GlobalStyles from "./styles/GlobalStyles";
import { I18nProviderWrapper } from "./context/I18nProviderWrapper";
import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProviderWrapper fallback={<div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      🌐 Carregando...
    </div>}>
      <LanguageProvider defaultLanguage="pt">
        <ThemeProviderWrapper>
          <BrowserRouter>
            <GlobalStyles />
            <App />
          </BrowserRouter>
        </ThemeProviderWrapper>
      </LanguageProvider>
    </I18nProviderWrapper>
  </React.StrictMode>
);