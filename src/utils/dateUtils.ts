// src/utils/dateUtils.ts
import type { SupportedLanguage } from '../context/LanguageContext';

interface DateFormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  showTime?: boolean;
}

export const dateUtils = {
  // Mapeamento de linguagens para locales
  localeMap: {
    'pt': 'pt-BR',
    'en': 'en-US', 
    'es': 'es-ES'
  } as Record<SupportedLanguage, string>,

  // Formatar data baseado na linguagem do i18n
  formatDate: (
    dateString: string | null | undefined, 
    language: SupportedLanguage = 'pt',
    options: DateFormatOptions = { dateStyle: 'short' }
  ): string => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) return "-";

      const locale = dateUtils.localeMap[language] || 'pt-BR';
      
      // Configurações padrão de formatação
      const formatOptions: Intl.DateTimeFormatOptions = {};
      
      if (options.dateStyle) {
        formatOptions.dateStyle = options.dateStyle;
      } else {
        // Configuração manual se dateStyle não for suportado
        formatOptions.year = 'numeric';
        formatOptions.month = '2-digit';
        formatOptions.day = '2-digit';
      }
      
      if (options.showTime || options.timeStyle) {
        if (options.timeStyle) {
          formatOptions.timeStyle = options.timeStyle;
        } else {
          formatOptions.hour = '2-digit';
          formatOptions.minute = '2-digit';
        }
      }

      return new Intl.DateTimeFormat(locale, formatOptions).format(date);
    } catch (error) {
      console.warn('Erro ao formatar data:', error);
      return dateString;
    }
  },

  // Versões específicas para diferentes contextos
  formatDateShort: (dateString: string | null | undefined, language: SupportedLanguage = 'pt'): string => {
    return dateUtils.formatDate(dateString, language, { dateStyle: 'short' });
  },

  formatDateMedium: (dateString: string | null | undefined, language: SupportedLanguage = 'pt'): string => {
    return dateUtils.formatDate(dateString, language, { dateStyle: 'medium' });
  },

  formatDateTime: (dateString: string | null | undefined, language: SupportedLanguage = 'pt'): string => {
    return dateUtils.formatDate(dateString, language, { dateStyle: 'short', timeStyle: 'short' });
  },

  // Função para obter formato de data específico por linguagem (fallback)
  getDateFormat: (language: SupportedLanguage): string => {
    const formats = {
      'pt': 'dd/MM/yyyy',
      'en': 'MM/dd/yyyy',
      'es': 'dd/MM/yyyy'
    };
    return formats[language] || formats.pt;
  },

  // Função helper para verificar se uma string é uma data válida
  isValidDate: (dateString: string | null | undefined): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
};