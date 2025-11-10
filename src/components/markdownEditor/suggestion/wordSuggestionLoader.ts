import type { i18n } from 'i18next';
import WordSuggestionSystem from './wordSuggestion';

// Mapeamento de códigos de idioma i18n para idiomas suportados pelo sistema
const languageMap: Record<string, string> = {
  'pt': 'pt',
  'pt-BR': 'pt',
  'en': 'en',
  'en-US': 'en',
  'es': 'es',
  'es-ES': 'es'
};

export class WordSuggestionLoader {
  private suggestionSystem: WordSuggestionSystem;
  private loadedLanguages: Set<string> = new Set();
  private i18nInstance: i18n;
  private baseModelPath: string;

  constructor(i18nInstance: i18n, baseModelPath: string = '/models') {
    this.suggestionSystem = new WordSuggestionSystem();
    this.i18nInstance = i18nInstance;
    this.baseModelPath = baseModelPath;
  }

  // Obtém o idioma atual 
  getCurrentLanguage(): string {
    const i18nLanguage = this.i18nInstance.language;
    return languageMap[i18nLanguage] || 'pt'; 
  }

  // Carrega o modelo para um idioma específico
  async loadModelForLanguage(language: string): Promise<boolean> {
    if (this.loadedLanguages.has(language)) {
      return true; // Já carregado
    }

    try {
      // Determinar o caminho do arquivo baseado no idioma
      let modelFileName;
      switch (language) {
        case 'pt':
          modelFileName = 'portuguese_model.json';
          break;
        case 'en':
          modelFileName = 'english_model.json';
          break;
        case 'es':
          modelFileName = 'spanish_model.json';
          break;
        default:
          throw new Error(`Idioma não suportado: ${language}`);
      }

      // Usar fetch para carregar o arquivo JSON
      const modelPath = `${this.baseModelPath}/${modelFileName}`;
      const response = await fetch(modelPath);

      if (!response.ok) {
        throw new Error(`Erro ao carregar modelo (status ${response.status}): ${modelPath}`);
      }

      const modelData = await response.json();
      this.suggestionSystem.importModel(language, JSON.stringify(modelData));
      this.loadedLanguages.add(language);

      console.log(`Modelo de sugestão para ${language} carregado com sucesso`);
      return true;
    } catch (error) {
      console.error(`Erro ao carregar modelo para ${language}:`, error);
      return false;
    }
  }

  // Carrega o modelo para o idioma atual
  async loadModelForCurrentLanguage(): Promise<boolean> {
    return this.loadModelForLanguage(this.getCurrentLanguage());
  }

  // Obtém o sistema de sugestão configurado
  getSuggestionSystem(): WordSuggestionSystem {
    return this.suggestionSystem;
  }

  suggest(prefix: string, context?: string, limit: number = 5): string[] {
    try {
      const currentLanguage = this.getCurrentLanguage();

      // Verificação de logs para depuração
      console.log(`Buscando sugestões para "${prefix}" (idioma: ${currentLanguage}, contexto: ${context || 'nenhum'})`);

      // Verificar se o idioma está carregado
      if (!this.loadedLanguages.has(currentLanguage)) {
        console.warn(`Modelo para idioma ${currentLanguage} não está carregado!`);
        return [];
      }

      // Obter sugestões
      const suggestions = this.suggestionSystem.suggest(prefix, currentLanguage, context, limit);

      // Log das sugestões encontradas
      console.log(`${suggestions.length} sugestões encontradas para "${prefix}"`);

      return suggestions;
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      return [];
    }
  }
}