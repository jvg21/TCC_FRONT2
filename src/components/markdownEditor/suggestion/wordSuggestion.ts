/**
 * Sistema de Sugestão de Palavras
 * 
 * Um sistema simples que implementa sugestões de palavras baseado em:
 * - Contagem de frequências individuais de palavras
 * - Análise básica de contexto (pares de palavras)
 * - Compatível com português, inglês e espanhol
 */

interface WordFrequency {
  [word: string]: number; 
}

interface WordPairFrequency {
  [firstWord: string]: {
    [secondWord: string]: number;  
  }
}

interface LanguageModel {
  wordFrequencies: WordFrequency;       // Frequências individuais de palavras
  wordPairFrequencies: WordPairFrequency; // Frequências de pares de palavras (contexto)
  totalWords: number;                   // Total de palavras 
}

// Interface para resultado de sugestão com score
interface SuggestionResult {
  word: string;
  score: number;
}

// Interface para entrada de cache
interface CacheEntry {
  timestamp: number;
  results: string[];
}

/**
 * Classe principal do sistema de sugestão de palavras
 */
class WordSuggestionSystem {
  private models: { [language: string]: LanguageModel };
  private supportedLanguages: string[] = ["pt", "en", "es"];
  private cache: {
    [key: string]: CacheEntry; 
  };
  private cacheTTL: number = 60 * 1000; 
  private maxCacheSize: number = 1000;  

  /**
   * Inicializa o sistema de sugestão de palavras
   */
  constructor() {
    this.models = {};
    this.cache = {};

    this.supportedLanguages.forEach(lang => {
      this.models[lang] = {
        wordFrequencies: {},
        wordPairFrequencies: {},
        totalWords: 0
      };
    });
  }

  /**
   * Normaliza o texto removendo caracteres especiais e padronizando
   */
  private normalizeText(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\sáàâãéèêíìóòôõúùüçñ]/g, ' ') 
      .replace(/\s+/g, ' ')                       
      .trim();
  }

  /**
   * Tokeniza o texto em palavras individuais
   */
  private tokenize(text: string): string[] {
    const normalizedText = this.normalizeText(text);
    return normalizedText.split(' ').filter(word => word.length > 0);
  }

  /**
   * Treina o modelo com um texto para um determinado idioma
   */
  train(text: string, language: string): void {
    if (!this.supportedLanguages.includes(language)) {
      throw new Error(`Idioma não suportado: ${language}. Use um dos seguintes: ${this.supportedLanguages.join(', ')}`);
    }

    const tokens = this.tokenize(text);
    if (tokens.length === 0) return;

    const model = this.models[language];

    model.totalWords += tokens.length;

    for (const word of tokens) {
      if (!model.wordFrequencies[word]) {
        model.wordFrequencies[word] = 0;
      }
      model.wordFrequencies[word]++;
    }

    for (let i = 0; i < tokens.length - 1; i++) {
      const currentWord = tokens[i];
      const nextWord = tokens[i + 1];

      if (!model.wordPairFrequencies[currentWord]) {
        model.wordPairFrequencies[currentWord] = {};
      }

      if (!model.wordPairFrequencies[currentWord][nextWord]) {
        model.wordPairFrequencies[currentWord][nextWord] = 0;
      }

      model.wordPairFrequencies[currentWord][nextWord]++;
    }

    this.clearCache();
  }

  /**
   * Treina o modelo com um lote de textos
   */
  trainBatch(texts: string[], language: string): void {
    for (const text of texts) {
      this.train(text, language);
    }
  }

  /**
   * Retorna estatísticas do modelo para um idioma
   */
  getModelStats(language: string): { wordCount: number, uniqueWords: number, uniquePairs: number } {
    if (!this.supportedLanguages.includes(language)) {
      throw new Error(`Idioma não suportado: ${language}`);
    }

    const model = this.models[language];

    let uniquePairs = 0;
    Object.keys(model.wordPairFrequencies).forEach(word => {
      uniquePairs += Object.keys(model.wordPairFrequencies[word]).length;
    });

    return {
      wordCount: model.totalWords,
      uniqueWords: Object.keys(model.wordFrequencies).length,
      uniquePairs: uniquePairs
    };
  }

  /**
   * Retorna sugestões de palavras baseadas em prefixo e contexto opcional
   */
  suggest(prefix: string, language: string, context?: string, limit: number = 5): string[] {
    if (!this.supportedLanguages.includes(language)) {
      throw new Error(`Idioma não suportado: ${language}`);
    }

    // Normalizar entradas para evitar problemas de case e espaços
    prefix = prefix.toLowerCase().trim();
    context = context ? context.toLowerCase().trim() : '';

    // Verificar cache
    const cacheKey = `${language}:${prefix}:${context}`;
    const cachedResult = this.getFromCache(cacheKey);
    if (cachedResult) {
      if (limit <= cachedResult.length) {
        return cachedResult.slice(0, limit);
      }
    }

    const model = this.models[language];

    // Se o modelo não foi treinado, retornar array vazio
    if (model.totalWords === 0) {
      return [];
    }

    let suggestions: SuggestionResult[] = [];

    const isShortPrefix = prefix.length <= 1;
    const prefixLimit = isShortPrefix ? Math.min(limit * 10, 200) : undefined;

    // Obter sugestões baseadas em prefixo
    const prefixSuggestions = this.getPrefixSuggestions(prefix, language, prefixLimit);
    suggestions = [...prefixSuggestions];

    if (context) {
      const contextSuggestions = this.getContextSuggestions(context, language);


      const suggestionMap = new Map<string, SuggestionResult>();


      for (const suggestion of suggestions) {
        suggestionMap.set(suggestion.word, suggestion);
      }

      for (const suggestion of contextSuggestions) {
        if (suggestionMap.has(suggestion.word)) {
          const existingSuggestion = suggestionMap.get(suggestion.word)!;
          existingSuggestion.score += suggestion.score * 10;
        } else if (suggestion.word.startsWith(prefix)) {
          suggestion.score *= 10; 
          suggestionMap.set(suggestion.word, suggestion);
        }
      }

      suggestions = Array.from(suggestionMap.values());
      
    }

    suggestions.sort((a, b) => b.score - a.score);
    const results = suggestions.slice(0, limit).map(s => s.word);

    this.addToCache(cacheKey, results);

    return results;
  }

  /**
   */
  private getPrefixSuggestions(prefix: string, language: string, limit?: number): SuggestionResult[] {
    const model = this.models[language];
    const suggestions: SuggestionResult[] = [];

    if (prefix.length <= 1 && limit) {
      const words = Object.keys(model.wordFrequencies)
        .filter(word => word.startsWith(prefix))
        .sort((a, b) => model.wordFrequencies[b] - model.wordFrequencies[a])
        .slice(0, limit);

      for (const word of words) {
        suggestions.push({
          word,
          score: model.wordFrequencies[word]
        });
      }
    } else {
      for (const word in model.wordFrequencies) {
        if (word.startsWith(prefix)) {
          suggestions.push({
            word,
            score: model.wordFrequencies[word]
          });
        }
      }
    }

    return suggestions;
  }

  /**
   * Retorna sugestões baseadas em contexto
   */
  private getContextSuggestions(context: string, language: string): SuggestionResult[] {
    const model = this.models[language];
    const suggestions: SuggestionResult[] = [];
    const contextWord = this.normalizeText(context).trim();

    if (model.wordPairFrequencies[contextWord]) {
      const nextWords = model.wordPairFrequencies[contextWord];

      for (const word in nextWords) {
        suggestions.push({
          word,
          score: nextWords[word]
        });
      }
    }

    return suggestions;
  }

  /**
   * Obtém uma entrada do cache
   */
  private getFromCache(key: string): string[] | null {
    const entry = this.cache[key];

    if (entry) {
      const now = Date.now();

      if (now - entry.timestamp < this.cacheTTL) {
        return entry.results;
      } else {
        delete this.cache[key];
      }
    }

    return null;
  }

  /**
   * Adiciona uma entrada ao cache
   */
  private addToCache(key: string, results: string[]): void {
    const cacheSize = Object.keys(this.cache).length;

    if (cacheSize >= this.maxCacheSize) {
      this.pruneCache();
    }

    this.cache[key] = {
      timestamp: Date.now(),
      results
    };
  }

  /**
   * Remove entradas antigas do cache quando atinge o tamanho máximo
   */
  private pruneCache(): void {
    const now = Date.now();
    const cacheEntries = Object.entries(this.cache);

    cacheEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remover 25% das entradas mais antigas
    const pruneCount = Math.ceil(cacheEntries.length * 0.25);
    for (let i = 0; i < pruneCount; i++) {
      delete this.cache[cacheEntries[i][0]];
    }
  }

  /**
   * Limpa todo o cache manualmente
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Serializa o modelo para JSON (para salvar/persistir)
   */
  exportModel(language: string): string {
    if (!this.supportedLanguages.includes(language)) {
      throw new Error(`Idioma não suportado: ${language}`);
    }

    return JSON.stringify(this.models[language]);
  }

  /**
   * Carrega um modelo a partir de JSON
   */
  importModel(language: string, jsonModel: string): void {
    if (!this.supportedLanguages.includes(language)) {
      throw new Error(`Idioma não suportado: ${language}`);
    }

    try {
      const model = JSON.parse(jsonModel) as LanguageModel;
      this.models[language] = model;
      this.clearCache(); // Invalidar cache ao carregar novo modelo
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`Erro ao importar modelo: ${message}`);
    }
  }
}

export default WordSuggestionSystem;