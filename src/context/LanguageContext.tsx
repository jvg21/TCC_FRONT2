import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../translations'; // Import direto do i18n

// Tipos de linguagens suportadas
export type SupportedLanguage = 'pt' | 'en' | 'es';

// Interface do contexto
interface LanguageContextValue {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => void;
  isChangingLanguage: boolean;
  availableLanguages: LanguageOption[];
  getLanguageLabel: (language: SupportedLanguage) => string;
  getLanguageFlag: (language: SupportedLanguage) => string;
  isI18nReady: boolean;
}

// Opção de linguagem
export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

// Linguagens disponíveis
const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    code: 'pt',
    label: 'Portuguese',
    nativeLabel: 'Português',
    flag: '🇧🇷'
  },
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    flag: '🇪🇸'
  }
];

// Chave para localStorage
const LANGUAGE_STORAGE_KEY = 'documentin_language';

// Criação do contexto
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

// Props do provider
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}

// Provider do contexto
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'pt' 
}) => {
  const { i18n: hookI18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(false);

  // Aguarda a inicialização do i18n
  useEffect(() => {
    const checkI18nReady = () => {
      if (i18n.isInitialized || (i18n.changeLanguage && typeof i18n.changeLanguage === 'function')) {
        setIsI18nReady(true);
        return true;
      }
      return false;
    };

    if (checkI18nReady()) {
      return;
    }

    // Se não estiver pronto, aguarda o evento de inicialização
    const handleInitialized = () => {
      setIsI18nReady(true);
    };

    if (i18n.on) {
      i18n.on('initialized', handleInitialized);
    }

    // Fallback: verifica periodicamente se está pronto
    const interval = setInterval(() => {
      if (checkI18nReady()) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      if (i18n.off) {
        i18n.off('initialized', handleInitialized);
      }
      clearInterval(interval);
    };
  }, []);

  // Inicializa a linguagem do localStorage ou padrão
  useEffect(() => {
    if (!isI18nReady) return;

    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
    
    if (savedLanguage && AVAILABLE_LANGUAGES.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      // Sincroniza com i18next se necessário
      if (i18n.language !== savedLanguage && i18n.changeLanguage) {
        i18n.changeLanguage(savedLanguage).catch(console.error);
      }
    } else {
      // Se não há linguagem salva, usa a detectada pelo i18next ou padrão
      const detectedLanguage = i18n.language as SupportedLanguage;
      const validLanguage = AVAILABLE_LANGUAGES.some(lang => lang.code === detectedLanguage) 
        ? detectedLanguage 
        : defaultLanguage;
      
      setCurrentLanguage(validLanguage);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, validLanguage);
      
      if (i18n.changeLanguage && validLanguage !== i18n.language) {
        i18n.changeLanguage(validLanguage).catch(console.error);
      }
    }
  }, [isI18nReady, defaultLanguage]);

  // Função para trocar idioma
  const changeLanguage = async (language: SupportedLanguage) => {
    if (language === currentLanguage || isChangingLanguage || !isI18nReady) return;

    setIsChangingLanguage(true);
    
    try {
      // Verifica se o i18n tem a função changeLanguage
      if (i18n.changeLanguage && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(language);
      } else {
        console.error('i18n.changeLanguage não está disponível');
        return;
      }
      
      // Atualiza o estado local
      setCurrentLanguage(language);
      
      // Salva no localStorage
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      
    } catch (error) {
      console.error('Erro ao trocar idioma:', error);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  // Função para obter o label da linguagem
  const getLanguageLabel = (language: SupportedLanguage): string => {
    const lang = AVAILABLE_LANGUAGES.find(l => l.code === language);
    return lang?.nativeLabel || language.toUpperCase();
  };

  // Função para obter a bandeira da linguagem
  const getLanguageFlag = (language: SupportedLanguage): string => {
    const lang = AVAILABLE_LANGUAGES.find(l => l.code === language);
    return lang?.flag || '🌐';
  };

  // Sincroniza mudanças do i18next com o contexto
  useEffect(() => {
    if (!isI18nReady) return;

    const handleLanguageChanged = (lng: string) => {
      const newLanguage = lng as SupportedLanguage;
      if (AVAILABLE_LANGUAGES.some(lang => lang.code === newLanguage) && newLanguage !== currentLanguage) {
        setCurrentLanguage(newLanguage);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      }
    };

    if (i18n.on) {
      i18n.on('languageChanged', handleLanguageChanged);
    }

    return () => {
      if (i18n.off) {
        i18n.off('languageChanged', handleLanguageChanged);
      }
    };
  }, [isI18nReady, currentLanguage]);

  const value: LanguageContextValue = {
    currentLanguage,
    changeLanguage,
    isChangingLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    getLanguageLabel,
    getLanguageFlag,
    isI18nReady
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para usar o contexto
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  
  return context;
};

// Hook customizado para traduções com tipagem
export const useTypedTranslation = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  return {
    t,
    i18n,
    currentLanguage,
    // Função auxiliar para traduções com fallback
    tWithFallback: (key: string, fallback: string = key) => {
      const translation = t(key);
      return translation !== key ? translation : fallback;
    }
  };
};

// Componente de seletor de idioma
export const LanguageSelector: React.FC<{
  variant?: 'dropdown' | 'buttons' | 'minimal';
  showFlag?: boolean;
  showLabel?: boolean;
  className?: string;
}> = ({ 
  variant = 'dropdown', 
  showFlag = true, 
  showLabel = true,
  className = ''
}) => {
  const { currentLanguage, changeLanguage, isChangingLanguage, availableLanguages, isI18nReady } = useLanguage();

  // Se o i18n não estiver pronto, mostra um indicador de carregamento simples
  if (!isI18nReady) {
    return (
      <div className={`language-selector-loading ${className}`} style={{ padding: '4px 8px' }}>
        <span>🌐</span>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`language-selector-minimal ${className}`}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            disabled={isChangingLanguage}
            className={`lang-btn ${currentLanguage === lang.code ? 'active' : ''}`}
            title={lang.nativeLabel}
            style={{
              padding: '4px 8px',
              margin: '0 2px',
              border: 'none',
              background: currentLanguage === lang.code ? '#007bff' : 'transparent',
              color: currentLanguage === lang.code ? 'white' : 'inherit',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showFlag && lang.flag} {showLabel && lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`language-selector-buttons ${className}`} style={{ display: 'flex', gap: '8px' }}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            disabled={isChangingLanguage}
            className={`lang-btn ${currentLanguage === lang.code ? 'active' : ''}`}
            style={{
              padding: '8px 12px',
              border: `1px solid ${currentLanguage === lang.code ? '#007bff' : '#ccc'}`,
              background: currentLanguage === lang.code ? '#007bff' : 'white',
              color: currentLanguage === lang.code ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {showFlag && <span>{lang.flag}</span>}
            {showLabel && <span>{lang.nativeLabel}</span>}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
      disabled={isChangingLanguage}
      className={`language-selector-dropdown ${className}`}
      style={{
        padding: '8px 12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        background: 'white',
        cursor: 'pointer'
      }}
    >
      {availableLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {showFlag ? `${lang.flag} ` : ''}{showLabel ? lang.nativeLabel : lang.code.toUpperCase()}
        </option>
      ))}
    </select>
  );
};