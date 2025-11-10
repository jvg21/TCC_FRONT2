# Documentin - Sistema de Gerenciamento de Documentos

![Documentin Logo](https://via.placeholder.com/150x50?text=Documentin)

## 📋 Sobre o Projeto

Documentin é um sistema de gerenciamento de documentos completo e moderno que permite a criação, organização, validação e compartilhamento de documentos com controle total sobre o fluxo de trabalho. O sistema oferece funcionalidades avançadas como visualização em cascata, validação por revisores, histórico de versões, integração com IA, e análises detalhadas.

## ✨ Funcionalidades Principais

- **Gerenciamento de Documentos**
  - Criação e edição de documentos com editor markdown
  - Importação/exportação em vários formatos (PDF, DOCX, MD)
  - Sistema de templates reutilizáveis
  - Validação de documentos com fluxos de aprovação

- **Organização**
  - Estrutura hierárquica de pastas
  - Visualização em cascata para documentos e pastas
  - Múltiplas visualizações (árvore, lista, grade)
  - Sistema de tags para categorização

- **Colaboração**
  - Gerenciamento de grupos e permissões
  - Sistema de comentários
  - Histórico de versões e controle de mudanças
  - Atribuição de tarefas relacionadas a documentos

- **Integração com IA**
  - Geração automática de resumos
  - Busca semântica de documentos similares
  - Integração com OpenAI

- **Análise e Relatórios**
  - Dashboard com métricas chave
  - Relatórios detalhados por período
  - Análises de uso do sistema
  - Estatísticas de validação e documentos

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React
  - TypeScript
  - Styled Components
  - i18n para internacionalização (Português, Inglês e Espanhol)

- **Recursos:**
  - Editor Markdown
  - Visualizações customizáveis
  - Integração OpenAI
  - Gráficos e estatísticas

## 🚀 Estrutura do Projeto

```
src/
├── features/
│   ├── document/         # Gerenciamento de documentos
│   ├── folder/           # Estrutura de pastas
│   ├── group/            # Gerenciamento de grupos
│   ├── task/             # Sistema de tarefas
│   ├── tag/              # Sistema de tags
│   ├── template/         # Templates de documentos
│   ├── login/            # Autenticação
│   └── reports/          # Relatórios e análises
├── translations/
│   ├── language/
│   │   ├── portuguese/   # Traduções em português
│   │   ├── english/      # Traduções em inglês
│   │   └── spanish/      # Traduções em espanhol
├── components/           # Componentes reutilizáveis
├── contexts/             # Contextos React
├── hooks/                # Hooks customizados
└── utils/                # Funções utilitárias
```


## 🌐 Internacionalização

O sistema está disponível em três idiomas:
- 🇧🇷 Português (Brasil)
- 🇺🇸 Inglês
- 🇪🇸 Espanhol

## 🔒 Autenticação e Segurança

- Sistema completo de login
- Recuperação de senha com tokens
- Permissões baseadas em grupos
- Validação de documentos por revisores designados

## 📊 Dashboard e Relatórios

- Métricas de documentos (ativos, validados, pendentes)
- Estatísticas de validação
- Análise de uso de IA
- Relatórios por período customizável

## 🔄 Fluxo de Trabalho de Documentos

1. Criação do documento (com possibilidade de usar templates)
2. Organização em pastas
3. Adição de tags para categorização
4. Envio para validação
5. Revisão e feedback
6. Aprovação ou rejeição com comentários
7. Versionamento automático

## 👥 Desenvolvedores

Para contribuir com o projeto ou entender melhor sua estrutura, consulte a documentação interna ou entre em contato com a equipe de desenvolvimento.

---

© 2025 Documentin - Todos os direitos reservados
