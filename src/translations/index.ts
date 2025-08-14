// src/translations/index.ts - Versão robusta e segura
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslations } from './language/english/en';
import { ptTranslations } from './language/portuguese/pt';
import { esTranslations } from './language/spanish/es';

// Carrega idioma do localStorage de forma segura
const getSavedLanguage = (): string => {
  try {
    return localStorage.getItem('documentin_language') || 'pt';
  } catch (error) {
    console.warn('Erro ao acessar localStorage:', error);
    return 'pt';
  }
};

const resources = {
  en: {
    translation: enTranslations
  },
  pt: {
    translation: ptTranslations
  },
  es: {
    translation: esTranslations
  }
};

// Configuração do i18next
const i18nConfig = {
  resources,
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'translation',
  ns: ['translation'],
  debug: process.env.NODE_ENV === 'development',
  react: {
    useSuspense: false, // Importante para evitar problemas de inicialização
  },
};

// Inicializa i18next de forma assíncrona
const initI18n = async () => {
  try {
    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init(i18nConfig);
    }
  } catch (error) {
    console.error('Erro ao inicializar i18n:', error);
    // Fallback: inicialização simples
    try {
      await i18n.use(initReactI18next).init({
        ...i18nConfig,
        lng: 'pt',
      });
    } catch (fallbackError) {
      console.error('Erro no fallback do i18n:', fallbackError);
    }
  }
};

// Listener para salvar mudanças de idioma
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('documentin_language', lng);
  } catch (error) {
    console.warn('Erro ao salvar idioma no localStorage:', error);
  }
});

// Inicializa imediatamente
initI18n();

// Exporta uma versão que garante inicialização
export const ensureI18nReady = async (): Promise<typeof i18n> => {
  if (i18n.isInitialized) {
    return i18n;
  }
  
  await initI18n();
  return i18n;
};

export default i18n;