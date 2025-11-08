import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../translations'; 


export type SupportedLanguage = 'pt' | 'en' | 'es';


interface LanguageContextValue {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => void;
  isChangingLanguage: boolean;
  availableLanguages: LanguageOption[];
  getLanguageLabel: (language: SupportedLanguage) => string;
  getLanguageFlag: (language: SupportedLanguage) => string;
  isI18nReady: boolean;
}

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

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


const LANGUAGE_STORAGE_KEY = 'documentin_language';


const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);


interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}


export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'pt' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(false);

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

    const handleInitialized = () => {
      setIsI18nReady(true);
    };

    if (i18n.on) {
      i18n.on('initialized', handleInitialized);
    }

    
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

  
  useEffect(() => {
    if (!isI18nReady) return;

    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
    
    if (savedLanguage && AVAILABLE_LANGUAGES.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      if (i18n.language !== savedLanguage && i18n.changeLanguage) {
        i18n.changeLanguage(savedLanguage).catch(console.error);
      }
    } else {
      
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

  
  const changeLanguage = async (language: SupportedLanguage) => {
    if (language === currentLanguage || isChangingLanguage || !isI18nReady) return;

    setIsChangingLanguage(true);
    
    try {
      
      if (i18n.changeLanguage && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(language);
      } else {
        console.error('i18n.changeLanguage não está disponível');
        return;
      }
      
      
      setCurrentLanguage(language);
      
      
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      
    } catch (error) {
      console.error('Erro ao trocar idioma:', error);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  
  const getLanguageLabel = (language: SupportedLanguage): string => {
    const lang = AVAILABLE_LANGUAGES.find(l => l.code === language);
    return lang?.nativeLabel || language.toUpperCase();
  };

  
  const getLanguageFlag = (language: SupportedLanguage): string => {
    const lang = AVAILABLE_LANGUAGES.find(l => l.code === language);
    return lang?.flag || '🌐';
  };


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

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  
  return context;
};


export const useTypedTranslation = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  return {
    t,
    i18n,
    currentLanguage,
    
    tWithFallback: (key: string, fallback: string = key) => {
      const translation = t(key);
      return translation !== key ? translation : fallback;
    }
  };
};


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