import type { BytemdPlugin } from 'bytemd';
import { WordSuggestionLoader } from './wordSuggestionLoader';

export interface SuggestionsPluginOptions {
  suggestionLoader: WordSuggestionLoader;
  maxSuggestions?: number;
  minChars?: number;
}

export function suggestionPlugin(options: SuggestionsPluginOptions): BytemdPlugin {
  const {
    suggestionLoader,
    maxSuggestions = 5,
    minChars = 2
  } = options;

  let suggestionElement: HTMLElement | null = null;
  let selectedIndex = -1;
  let currentSuggestions: string[] = [];
  let currentEditor: any = null;
  let currentCursorPos: any = null;

  // Criar o elemento de sugestões como um singleton
  const getSuggestionElement = () => {
    if (suggestionElement) return suggestionElement;
    
    suggestionElement = document.createElement('div');
    suggestionElement.className = 'bytemd-suggestions';
    suggestionElement.style.position = 'fixed';
    suggestionElement.style.zIndex = '9999';
    suggestionElement.style.backgroundColor = 'white';
    suggestionElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    suggestionElement.style.border = '1px solid #ddd';
    suggestionElement.style.borderRadius = '4px';
    suggestionElement.style.padding = '4px 0';
    suggestionElement.style.display = 'none';
    suggestionElement.style.maxHeight = '200px';
    suggestionElement.style.overflowY = 'auto';
    suggestionElement.style.minWidth = '200px';
    suggestionElement.style.fontSize = '14px';
    
    document.body.appendChild(suggestionElement);
    console.log('Elemento de sugestões criado e adicionado ao DOM');
    return suggestionElement;
  };

  // Mostrar sugestões
  const showSuggestions = (suggestions: string[], editor: any, pos: any) => {
    if (suggestions.length === 0) {
      hideSuggestions();
      return;
    }

    currentEditor = editor;
    currentCursorPos = pos;
    currentSuggestions = suggestions;
    selectedIndex = -1;

    const element = getSuggestionElement();
    element.innerHTML = '';

    // Adicionar cabeçalho para debug
    const header = document.createElement('div');
    header.style.padding = '4px 8px';
    header.style.fontSize = '12px';
    header.style.fontWeight = 'bold';
    header.style.color = '#666';
    header.style.borderBottom = '1px solid #eee';
    header.textContent = `${suggestions.length} sugestões`;
    element.appendChild(header);

    // Criar itens de sugestão
    suggestions.forEach((suggestion, index) => {
      const item = document.createElement('div');
      item.className = 'bytemd-suggestion-item';
      item.textContent = suggestion;
      item.style.padding = '8px 12px';
      item.style.cursor = 'pointer';
      item.style.color = '#333';

      item.addEventListener('mouseenter', () => {
        selectedIndex = index;
        updateSelectedItem();
      });

      item.addEventListener('click', () => {
        applySuggestion(suggestion);
      });

      element.appendChild(item);
    });

    // Posicionar o elemento
    const coords = editor.cursorCoords(pos, 'window');
    element.style.top = `${coords.bottom + 5}px`;
    element.style.left = `${coords.left}px`;
    element.style.display = 'block';

    console.log(`Menu de sugestões exibido com ${suggestions.length} itens`);
  };

  // Atualizar o item selecionado
  const updateSelectedItem = () => {
    if (!suggestionElement) return;

    const items = suggestionElement.querySelectorAll('.bytemd-suggestion-item');
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('active');
        (item as HTMLElement).style.backgroundColor = '#e6f7ff';
      } else {
        item.classList.remove('active');
        (item as HTMLElement).style.backgroundColor = 'transparent';
      }
    });

    // Rolar para o item selecionado
    if (selectedIndex >= 0) {
      const selectedItem = items[selectedIndex] as HTMLElement;
      selectedItem.scrollIntoView({ block: 'nearest' });
    }
  };

  // Aplicar a sugestão selecionada
  const applySuggestion = (suggestion: string) => {
    if (!currentEditor || !currentCursorPos) return;

    const editor = currentEditor;
    const pos = currentCursorPos;
    const line = editor.getLine(pos.line);
    
    // Encontrar o início da palavra atual
    let startCh = pos.ch;
    while (startCh > 0 && !/\s/.test(line.charAt(startCh - 1))) {
      startCh--;
    }

    // Substituir a palavra pelo texto sugerido
    editor.replaceRange(
      suggestion + ' ', 
      { line: pos.line, ch: startCh }, 
      pos
    );

    hideSuggestions();
    console.log(`Sugestão aplicada: "${suggestion}"`);
  };

  // Esconder o menu de sugestões
  const hideSuggestions = () => {
    if (suggestionElement) {
      suggestionElement.style.display = 'none';
    }
    currentSuggestions = [];
    selectedIndex = -1;
  };

  // Processar a entrada do usuário para mostrar sugestões
  const processInput = (editor: any, forced = false) => {
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    
    // Encontrar palavra sendo digitada
    let startCh = cursor.ch;
    while (startCh > 0 && !/\s/.test(line.charAt(startCh - 1))) {
      startCh--;
    }
    
    const currentWord = line.substring(startCh, cursor.ch);
    
    // Se a palavra é muito curta e não foi forçado, esconder sugestões
    if (currentWord.length < minChars && !forced) {
      hideSuggestions();
      return;
    }

    // Encontrar palavra anterior para contexto
    let contextWord = '';
    let contextEndCh = startCh - 1;
    
    while (contextEndCh > 0 && /\s/.test(line.charAt(contextEndCh))) {
      contextEndCh--;
    }
    
    if (contextEndCh >= 0) {
      let contextStartCh = contextEndCh;
      while (contextStartCh > 0 && !/\s/.test(line.charAt(contextStartCh - 1))) {
        contextStartCh--;
      }
      
      contextWord = line.substring(contextStartCh, contextEndCh + 1);
    }

    console.log(`Buscando sugestões para: "${currentWord}" (contexto: "${contextWord}")`);
    
    // Obter sugestões
    const suggestions = suggestionLoader.suggest(currentWord, contextWord, maxSuggestions);
    
    if (suggestions.length > 0) {
      showSuggestions(suggestions, editor, cursor);
    } else {
      hideSuggestions();
    }
  };

  // Adicionando handler global para eventos de teclado
  const setupGlobalKeyboardHandler = () => {
    const handler = (e: KeyboardEvent) => {
      if (!currentEditor) return;
      
      // Se o menu de sugestões está visível
      if (suggestionElement && suggestionElement.style.display === 'block') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % currentSuggestions.length;
          updateSelectedItem();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
          updateSelectedItem();
        } else if (e.key === 'Tab' || e.key === 'Enter') {
          if (selectedIndex >= 0) {
            e.preventDefault();
            applySuggestion(currentSuggestions[selectedIndex]);
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          hideSuggestions();
        }
      }
      
      // Atalho Ctrl+Space para mostrar sugestões
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        processInput(currentEditor, true);
      }
    };
    
    document.addEventListener('keydown', handler);
    
    return () => {
      document.removeEventListener('keydown', handler);
    };
  };

  return {
    // Usar recursivePostProcessors para processar o conteúdo durante a edição
    editorEffect: (ctx) => {
      console.log('Plugin de sugestões registrado');
      
      // Acessar o editor de forma mais segura
      const editor = ctx.editor;
      currentEditor = editor;
      
      if (!editor) {
        console.error('Editor não encontrado no contexto');
        return;
      }
      
      // Configurar listener para cliques fora
      const clickOutsideHandler = (e: MouseEvent) => {
        if (suggestionElement && !suggestionElement.contains(e.target as Node)) {
          setTimeout(hideSuggestions, 50);
        }
      };
      
      document.addEventListener('mousedown', clickOutsideHandler);
      
      // Usar a DOM API para capturar todos os eventos de teclado
      const cleanupKeyboardHandler = setupGlobalKeyboardHandler();
      
      // Monitorar mudanças de conteúdo
      const contentChangeHandler = (change: any) => {
        // Verificar se foi uma inserção de texto pelo usuário
        if (change.origin === '+input') {
          setTimeout(() => processInput(editor), 10);
        }
      };
      
      try {
        // Tentar registrar o event listener usando a API do editor
        if (editor.on) {
          editor.on('change', contentChangeHandler);
        } else {
          console.warn('Editor não possui método "on", usando abordagem alternativa');
          
          // Abordagem alternativa: monitorar o elemento do editor
          const editorElement = document.querySelector('.bytemd-editor');
          if (editorElement) {
            const observer = new MutationObserver(() => {
              setTimeout(() => processInput(editor), 10);
            });
            
            observer.observe(editorElement, {
              childList: true,
              subtree: true,
              characterData: true
            });
            
            // Limpeza para o observer
            return () => {
              observer.disconnect();
              document.removeEventListener('mousedown', clickOutsideHandler);
              cleanupKeyboardHandler();
              
              if (suggestionElement && suggestionElement.parentNode) {
                suggestionElement.parentNode.removeChild(suggestionElement);
                suggestionElement = null;
              }
            };
          }
        }
      } catch (err) {
        console.error('Erro ao configurar listeners de eventos:', err);
      }
      
      // Função de limpeza
      return () => {
        document.removeEventListener('mousedown', clickOutsideHandler);
        cleanupKeyboardHandler();
        
        if (editor.off) {
          try {
            editor.off('change', contentChangeHandler);
          } catch (err) {
            console.warn('Erro ao remover event listener do editor:', err);
          }
        }
        
        if (suggestionElement && suggestionElement.parentNode) {
          suggestionElement.parentNode.removeChild(suggestionElement);
          suggestionElement = null;
        }
      };
    }
  };
}