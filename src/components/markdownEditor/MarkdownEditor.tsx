// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import mermaid from '@bytemd/plugin-mermaid';
import math from '@bytemd/plugin-math';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import 'bytemd/dist/index.css';
import 'highlight.js/styles/default.css';
import 'katex/dist/katex.css';
import 'medium-zoom/dist/style.css';
import { getCookie } from '../../utils/Cookies';
import { WordSuggestionLoader } from './suggestion/wordSuggestionLoader';
import { suggestionPlugin } from './suggestion/suggestionsPlugin';
import { t } from 'i18next';

// Importando componentes de sugestão


const EditorContainer = styled.div`
  .bytemd {
    height: 400px;
  }
  
  .bytemd-toolbar {
    border-bottom: 1px solid #e9ecef;
    background: #f8f9fa;
  }
  
  .bytemd-editor {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .bytemd-preview {
    padding: 16px;
    background: #fafafa;
  }

  /* Correção z-index para fullscreen */
  .bytemd-fullscreen {
    z-index: 1100 !important;
  }
  
  .bytemd-fullscreen .bytemd {
    z-index: 1100 !important;
  }
  
  &:has(.bytemd-fullscreen) {
    z-index: 1100 !important;
    position: relative;
  }

  /* Estilos para diagramas Mermaid */
  .mermaid {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    border: 1px solid #e9ecef;
  }

  /* Estilos para fórmulas matemáticas */
  .katex-display {
    margin: 16px 0;
    text-align: center;
  }

  .katex {
    font-size: 1.1em;
  }

  /* Estilos para imagens com zoom */
  .medium-zoom-image {
    cursor: zoom-in;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .medium-zoom-image:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }
  
  /* Estilos para sugestões */
  .bytemd-suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .bytemd-suggestion-item:hover {
    background-color: #f5f5f5;
  }
  
  .bytemd-suggestion-item.active {
    background-color: #e6f7ff;
  }
  
  .bytemd-suggestions {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    font-size: 14px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('Image', file);

    try {
      const token = getCookie('authToken') || "";
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/Supabase/UploadImage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(t('markdown_editor.upload_error') || 'Erro no upload da imagem');
      }

      const result = await response.json();
      return result.objeto?.url || '';
    } catch (error) {
      console.error('Erro no upload:', error);
      return '';
    }
  });

  return Promise.all(uploadPromises);
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder
}) => {
  const { t, i18n } = useTranslation();
  const [suggestionLoader, setSuggestionLoader] = useState<WordSuggestionLoader | null>(null);
  const [pluginsLoaded, setPluginsLoaded] = useState(false);
  const [editorPlugins, setEditorPlugins] = useState<any[]>([]);

  // Configuração inicial de plugins básicos
  useEffect(() => {
    const basePlugins = [
      gfm(),
      highlight(),
      mermaid(),
      math(),
      mediumZoom(),
      {
        name: 'upload-images',
        actions: [
          {
            title: 'Upload de Imagem',
            icon: '🖼️',
            handler: {
              type: 'action',
              click: (ctx: any) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;

                input.onchange = async (e: any) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  const startPos = ctx.editor.getCursor();

                  const loadingText = files.length === 1
                    ? '![Carregando imagem...]()'
                    : files.map((_, i) => `![Carregando imagem ${i + 1}...]()`).join('\n');

                  ctx.editor.replaceRange(loadingText, startPos);

                  try {
                    const urls = await uploadImages(files as File[]);
                    const imageMarkdown = urls
                      .filter(url => url)
                      .map((url, i) => `![Imagem ${i + 1}](${url})`)
                      .join('\n');

                    const endPos = {
                      line: startPos.line + (loadingText.split('\n').length - 1),
                      ch: startPos.line + loadingText.split('\n').length - 1 === startPos.line
                        ? startPos.ch + loadingText.length
                        : loadingText.split('\n').pop()?.length || 0
                    };

                    ctx.editor.replaceRange(imageMarkdown, startPos, endPos);
                  } catch (error) {
                    console.error('Erro no upload:', error);

                    const endPos = {
                      line: startPos.line + (loadingText.split('\n').length - 1),
                      ch: startPos.line + loadingText.split('\n').length - 1 === startPos.line
                        ? startPos.ch + loadingText.length
                        : loadingText.split('\n').pop()?.length || 0
                    };
                    ctx.editor.replaceRange('<!-- Erro no upload das imagens -->', startPos, endPos);
                  }
                };

                input.click();
              }
            }
          }
        ]
      }
    ];

    setEditorPlugins(basePlugins);
  }, []);

  // Inicializa o sistema de sugestão e carrega o modelo para o idioma atual
  // Modificações no MarkdownEditor.tsx (apenas parte relevante)
  useEffect(() => {
    const initSuggestionSystem = async () => {
      try {
        // Criar instância do carregador de sugestões com o caminho correto para os modelos
        const loader = new WordSuggestionLoader(i18n, '/models');

        // Carregar o modelo para o idioma atual
        const success = await loader.loadModelForCurrentLanguage();

        if (success) {
          console.log(`Sistema de sugestão inicializado para ${loader.getCurrentLanguage()}`);
          console.log('Estatísticas do modelo:', loader.getSuggestionSystem().getModelStats(loader.getCurrentLanguage()));

          // Teste rápido de sugestões
          const testSuggestions = loader.suggest('t', 'is', 5);
          console.log('Teste de sugestões para "t" após "is":', testSuggestions);

          setSuggestionLoader(loader);

          // Adicionar plugin de sugestão aos plugins existentes
          setEditorPlugins(prevPlugins => [
            ...prevPlugins,
            suggestionPlugin({
              suggestionLoader: loader,
              maxSuggestions: 5,
              minChars: 2
            })
          ]);

          setPluginsLoaded(true);
        } else {
          console.warn('Não foi possível carregar o modelo de sugestão para o idioma atual');
        }
      } catch (error) {
        console.error('Erro ao inicializar sistema de sugestão:', error);
      }
    };

    // Chamar apenas se os plugins base já estiverem configurados
    if (editorPlugins.length > 0 && !pluginsLoaded) {
      initSuggestionSystem();
    }
  }, [i18n, editorPlugins, pluginsLoaded]);

  //  useEffect(() => {
  //    // Teste manual para verificar se as sugestões funcionam
  //    if (suggestionLoader) {
  //      const testWords = ['t', 'th', 'a', 'be', 'is'];
       
  //      console.log('------ TESTE DE SUGESTÕES ------');
  //      testWords.forEach(word => {
  //        const sugs = suggestionLoader.suggest(word);
  //        console.log(`Sugestões para "${word}":`, sugs);
  //      });
  //    }
  //  }, [suggestionLoader]);

  // Atualiza o modelo quando o idioma da aplicação muda
  useEffect(() => {
    if (suggestionLoader) {
      const updateLanguageModel = async () => {
        const currentLanguage = suggestionLoader.getCurrentLanguage();
        console.log(`Atualizando modelo para idioma: ${currentLanguage}`);
        await suggestionLoader.loadModelForLanguage(currentLanguage);
      };

      updateLanguageModel();
    }
  }, [i18n.language, suggestionLoader]);

  return (
    <div>
      {label && <Label>{label} {required && '*'}</Label>}
      <EditorContainer>
        <Editor
          value={value}
          onChange={onChange}
          plugins={editorPlugins}
          placeholder={placeholder || t("markdown_editor.placeholder")}
          uploadImages={uploadImages}
        />
      </EditorContainer>
    </div>
  );
};