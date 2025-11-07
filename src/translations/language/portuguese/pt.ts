export const ptTranslations = {
  date_format: "dd/MM/yyyy",
  locale_date_string: "pt-BR",
  
  invalidCredentials: "Credenciais inválidas",
  notFound: "Não encontrado",
  // Navegação
  navigation: {
    home: "Início",
    companies: "Empresas",
    users: "Usuários",
    groups: "Grupos",
    folders: "Pastas",
    tasks: "Tarefas",
    documents: "Documentos",
    templates: "Templates",
    integrations: "Integrações",
    settings: "Configurações",
    openai: "OpenAI",
    tasksBoardPage: "Painel de Tarefas",
    tasksDashboard: "Dashboard de Tarefas",
    taskdashboard: "Dashboard de Tarefas",
    cascadeview: "Visualização em Cascata",
    taskboard: "Quadro de Tarefas",
    reports: "Relatórios",
    cancel: "Cancelar",
  },

  // Ações gerais
  actions: {
    add: "Adicionar",
    actions: "Ações",
    edit: "Editar",
    delete: "Excluir",
    save: "Salvar",
    cancel: "Cancelar",
    search: "Buscar",
    filter: "Filtrar",
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    confirm: "Confirmar",
    close: "Fechar",
    view: "Visualizar",
    export: "Exportar",
    import: "Importar",
    activate: "Ativar",
    deactivate: "Desativar",
    find_similar: "Encontrar Similares",
    clear_results: "Limpar Resultados",
    saving: "Salvando...",
    importing: "Importando...",
    copy: "Copiar"
  },

  // Estados
  status: {
    active: "Ativo",
    inactive: "Inativo",
    enabled: "Ativado",
    disabled: "Desativado",
    pending: "Pendente",
    completed: "Concluído",
    in_progress: "Em Progresso",
    cancelled: "Cancelado",
    all: "Todos"
  },

  // Empresas
  companies: {
    title: "Empresas",
    add_company: "Adicionar Empresa",
    edit_company: "Editar Empresa",
    search_companies: "Buscar empresas...",
    name: "Nome",
    tax_id: "CNPJ",
    email: "E-mail",
    zipcode: "CEP",
    phone: "Telefone",
    address: "Endereço",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    is_active: "Status",
    createSucess: "Empresa criada com sucesso!",
    updateSucess: "Empresa atualizada com sucesso!",
    updateStatusSucess: "Status da empresa alterado com sucesso!"
  },

  // Usuários
  users: {
    title: "Usuários",
    add_user: "Adicionar Usuário",
    edit_user: "Editar Usuário",
    search_users: "Buscar usuários...",
    name: "Nome",
    email: "E-mail",
    profile: "Perfil",
    phone: "Telefone",
    company: "Empresa",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    is_active: "Status",
    last_login: "Último Login",
    password: "Senha",
    passwordRequirements: "A senha deve ter pelo menos 6 caracteres, incluindo maiúscula, minúscula e número",
    createSuccess: "Usuário criado com sucesso!",
    updateSuccess: "Usuário atualizado com sucesso!",
    createError: "Erro ao criar usuário",
    no_select: "Selecione um usuário",
    updateStatusSuccess: "Status do usuário alterado com sucesso!",
    select_company: "Selecionar Empresa"
  },

  // Grupos
  groups: {
    title: "Grupos",
    add_group: "Adicionar Grupo",
    edit_group: "Editar Grupo",
    search_groups: "Buscar grupos...",
    name: "Nome",
    description: "Descrição",
    user: "Usuário",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    is_active: "Status",
    manage_users: "Gerenciar Usuários",
    add_user: "Adicionar Usuário",
    select_user: "Selecionar Usuário",
    users_in_group: "Usuários no Grupo",
    no_users_in_group: "Nenhum usuário no grupo",
    hide_group_users: "Ocultar Usuários do Grupo",
    manage_group_users: "Gerenciar Usuários do Grupo",
    group_user_management: "Gestão de Usuários do Grupo",
    manage_folders: "Gerenciar Pastas",
    add_folder: "Adicionar Pasta",
    select_folder: "Selecionar Pasta",
    folders_in_group: "Pastas no Grupo",
    no_folders_in_group: "Nenhuma pasta no grupo",
    hide_group_folders: "Ocultar Pastas do Grupo",
    removeUserSuccess: "Usuário removido do grupo com sucesso!",
    updateSuccess: "Grupo atualizado com sucesso!",
    updateStatusSuccess: "Status do grupo alterado com sucesso!",
    addUserSuccess: "Usuário adicionado ao grupo com sucesso!",
    createSuccess: "Grupo criado com sucesso!"
  },

  // Pastas
  folders: {
    title: "Lista",
    add_folder: "Adicionar Pasta",
    edit_folder: "Editar Pasta",
    search_folders: "Buscar pastas...",
    name: "Nome",
    parent_folder: "Pasta Pai",
    user: "Usuário",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    is_active: "Status",
    validator: "Validador",
    name_placeholder: "Digite o nome da pasta",
    no_parent_folder: "Sem Pasta Pai",
    select_validator: "Selecionar Validador",
    manage_folders: "Gerenciar Pastas",
    hide_group_folders: "Ocultar Pastas do Grupo",
    select_folder: "Selecionar Pastas",
    folders_in_group: "Pastas em Grupo",
    no_folders_in_group: "Nenhuma Pasta no Grupo",
    createSuccess: "Pasta criada com sucesso!",
    updateSuccess: "Pasta atualizada com sucesso!",
    groupAddedSuccess: "Pasta adicionada ao grupo com sucesso!",
    statusToggleSuccess: "Status da pasta alterado com sucesso!"


  },

  tags: {
    title: "Tags",
    noTags: "Nenhuma tag adicionada",
    inputPlaceholder: "Adicionar tag...",
    loading: "Carregando tags...",
    addSuccess: "Tag adicionada com sucesso!",
    removeSuccess: "Tag removida com sucesso!",
    createNew: "Criar nova tag:",
    addDocumentSuccess: "Tag adicionada ao documento com sucesso!",
    createSuccess: "Criado com Sucesso",
    createAddSuccess: "Tag Criada com Sucesso"
  },

  // Tarefas
  tasks: {
    title: "Lista de Tarefas",
    add_task: "Adicionar Tarefa",
    edit_task: "Editar Tarefa",
    search_tasks: "Buscar tarefas...",
    title_field: "Título",
    description: "Descrição",
    due_date: "Data de Vencimento",
    priority: "Prioridade",
    status: "Status",
    assignee: "Responsável",
    user: "Usuário",
    parent_task: "Tarefa Pai",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    is_active: "Status",
    priority_high: "Alta",
    priority_medium: "Média",
    priority_low: "Baixa",
    creator: "Criador",
    select_assignee: "Selecionar Funcionário",

    task_board: "Quadro de Tarefas",
    board_view: "Visualização em Quadro",
    list_view: "Visualização em Lista",
    no_tasks: "Nenhuma tarefa",
    no_assignee: "Não atribuído",
    move_to: "Mover para",
    drag_drop_hint: "Arraste e solte para reorganizar",
    column_empty: "Esta coluna está vazia",
    add_task_to_column: "Adicionar tarefa a esta coluna",
    task_count: "tarefa(s)",
    view_task_details: "Ver detalhes da tarefa",
    task_actions: "Ações da tarefa",
    createSuccess: "Tarefa criada com sucesso!",
    updateSuccess: "Tarefa atualizada com sucesso!",
    updateStatusSuccess: "Status da tarefa alterado com sucesso!",
    deleteSuccess: "Tarefa removida com sucesso!",
    moveSuccess: "Tarefa movida com sucesso!",
    task_dashboard: "Dashboard de Tarefas",
    all_tasks: "Todas as Tarefas",
    upcoming_deadlines: "Próximos Prazos",
    task_statistics: "Estatísticas de Tarefas",
    completion_rate: "Taxa de Conclusão",
    progress_rate: "Taxa de Progresso",
    pending_rate: "Taxa Pendente",
    total_tasks: "Total de Tarefas",
    completed_tasks: "Tarefas Concluídas",
    in_progress_tasks: "Tarefas em Progresso",
    pending_tasks: "Tarefas Pendentes",
    in_review_tasks: "Tarefas em Revisão",
    no_upcoming_deadlines: "Não há prazos próximos",
    no_tasks_in_progress: "Nenhuma tarefa em progresso",
    no_tasks_in_review: "Nenhuma tarefa em revisão",
    no_completed_tasks: "Nenhuma tarefa concluída",
    empty_column: "Esta coluna está vazia",
    description_placeholder: "Descreva a tarefa...",

    statusTask: {
      todo: "A Fazer",
      inprogress: "Em Progresso",
      inreview: "Em Revisão",
      done: "Concluído",
      canceled: "Cancelado"
    },

    priorityTask: {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      urgent: "Urgente"
    }

  },

  // Documentos
  documents: {
    title: "Documentos",
    add_document: "Adicionar Documento",
    semantic_search: "Busca Semântica",
    semantic_search_description: "Encontre documentos semelhantes em conteúdo usando embeddings com tecnologia de IA.",
    search_by_meaning: "Buscar por significado...",
    edit_document: "Editar Documento",
    search_documents: "Buscar documentos...",
    title_field: "Título",
    content: "Conteúdo",
    folder: "Pasta",
    user: "Usuário",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    is_active: "Status",
    creator: "Criador",
    tags: "Tags",
    no_content: "Nenhum conteúdo adicionado",
    edit_content: "Editar Conteúdo",
    select_folder: "Selecionar pasta",
    template_placeholder: "Selecionar template",
    apply_template: "Aplicar Template",
    template: "Template",
    template_applied_from: "Conteúdo aplicado do template",
    select_template: "Selecionar template (opcional)",
    template_applied: "Template aplicado com sucesso!",
    click_to_view : "Clique para visualizar",
    similarity : "Similaridade",
    no_similar_documents : "Nenhum documento similar encontrado",
    found : "encontrado",
    similar_documents : "documentos similares",
    error_during_search : "Erro durante a busca",
    loading : "Carregando...",
    add: "Adicionar Documento",
    selectFolderPlaceholder: "Selecione uma pasta para o documento",
    import: "Importar Documento",
    importSuccess: "Documento importado com sucesso!",
    importError: "Erro ao importar documento",
    importDocument: "Importar Documento",
    selectFolder: "Selecionar Pasta",
    resetValidationSuccess: "Validação do documento restabelecida com sucesso!",
    validationUpdateSuccess: "Estado de validação do documento atualizado com sucesso!",

    filters: {
      rag:{
        hide: "Ocultar RAG",
        show: "Mostrar RAG",
      },
      hide: "Ocultar",
      show: "Mostrar",
      date_range: "Período",
      author: "Autor",
      tag: "Tag",
      all_authors: "Todos os autores",
      all_tags: "Todas as tags",
      clear_filters: "Limpar filtros",
      advanced_filters: "Filtros avançados"
    },


    tabs: {
      general: "Geral",
      my_documents: "Meus Documentos",
      to_edit: "Para Editar",
      validations: "Validações",
      general_alert_title: "Todos os Documentos",
      general_alert_description: "Visualize todos os documentos do sistema e gerencie conforme necessário.",
      my_documents_alert_title: "Seus Documentos",
      my_documents_alert_description: "Documentos que você criou e pode editar a qualquer momento.",
      to_edit_alert_title: "Documentos para Edição",
      to_edit_alert_description: "Documentos atribuídos a você para edição e revisão.",

      validations_alert_title: "Validações Pendentes",
      validations_alert_description: "Documentos aguardando sua validação como revisor.",


      search_my_documents: "Buscar meus documentos...",
      search_to_edit: "Buscar documentos para editar...",
      search_validations: "Buscar validações...",


      no_documents_created_title: "Nenhum documento criado",
      no_documents_created_description: "Você ainda não criou nenhum documento. Comece criando seu primeiro documento.",

      no_documents_to_edit_title: "Nenhum documento para editar",
      no_documents_to_edit_description: "Não há documentos atribuídos a você para edição no momento.",

      no_validations_pending_title: "Nenhuma validação pendente",
      no_validations_pending_description: "Todas as validações foram processadas. Bom trabalho!"
    },
    view_document: "Visualizar Documento",
    untitled_document: "Documento sem título",
    markdown_editor: "Editor Markdown",
    createSuccess: "Documento criado com sucesso!",
    updateSuccess: "Documento atualizado com sucesso!",
    updateStatusSuccess: "Status do documento alterado com sucesso!",
    deleteSuccess: "Documento excluído com sucesso!",

    document_details: {
      title: "Detalhes do Documento",
      back: "Voltar",
      generate_summary: "Gerar Resumo",
      save_changes: "Salvar Alterações",
      created_by: "Criado por",
      folder: "Pasta",
      created_at: "Criado em",
      updated_at: "Atualizado em",
      generating_summary : "Gerando resumo...",
      
      

      
      summary_types: {
        structured: "Resumo padrão",
        structured_desc: "Resumo completo e estruturado do documento",
        comparative: "Resumo em tópicos",
        comparative_desc: "Lista os pontos principais em formato de tópicos",
        analytical: "Resumo curto (TL;DR)",
        analytical_desc: "Versão resumida destacando apenas o essencial",
        
      },

      version_history: {
        button: "Versões do Documento",
        today: "Hoje",
        current_version: "Versão Atual",
        title: "Histórico de Versões",
        no_versions : "Nenhuma versão disponível",
      },

      export: {
        button: "Exportar",
        export_pdf: "Exportar PDF",
        export_docx: "Exportar DOCX",
        export_md: "Exportar MD",
      },
      validation: {
        title: "Validação do Documento",
        pending: "Pendente de Validação",
        approve: "Aprovar",
        reject: "Rejeitar",
        rejected: "Rejeitado",
        approved: "Aprovado",
        reject_reason: "Motivo da rejeição",
        validated_by: "Validado por",
        add_note: "Adicione uma nota sobre a validação (opcional para aprovação, obrigatória para rejeição)"
      },
      comments: {
        title: "Comentários",
        placeholder: "Digite seu comentário...",
        add_comment: "Adicionar Comentário",
        count: "Comentários",
        createSuccess: "Comentário adicionado com sucesso!"
      }
    },
    messages: {
      success: {
        document_approved: "Documento aprovado com sucesso!",
        document_rejected: "Documento rejeitado com sucesso!",
        comment_added: "Comentário adicionado com sucesso!",
        document_saved: "Documento salvo com sucesso!"
      },
      error: {
        document_not_found: "Documento não encontrado",
        user_not_found: "Usuário não encontrado",
        folder_not_found: "Pasta não encontrada",
        empty_content: "O conteúdo do documento está vazio",
        validation_failed: "Erro ao validar documento",
        comment_failed: "Erro ao adicionar comentário",
      },
    }
  },

  // Login
  login: {
    title: "Documentin",
    subtitle: "Faça login em sua conta",
    email_placeholder: "Digite seu e-mail",
    password_placeholder: "Digite sua senha",
    remember_me: "Lembrar de mim",
    forgot_password: "Esqueceu a senha?",
    login_button: "Entrar",
    logging_in: "Entrando...",
    light_mode: "Modo Claro",
    dark_mode: "Modo Escuro",
    is_active: "Status",
    logout: "Sair",
    success: "Login realizado com sucesso!",
    error: "Login falhou. Verifique suas credenciais."
  },

  // Recuperação de senha
  password_recovery: {
    title: "Documentin",
    subtitle: "Recupere o acesso à sua conta",
    email_placeholder: "Digite seu e-mail",
    send_button: "Enviar link de recuperação",
    sending: "Enviando...",
    back_to_login: "Fazer login",
    remembered_password: "Lembrou sua senha?"
  },

  // Reset de token
  token_reset: {
    title: "Documentin",
    subtitle: "Recupere o acesso à sua conta",
    token_placeholder: "Digite seu token",
    send_button: "Enviar token",
    sending: "Enviando...",
    back_to_login: "Fazer login",
    remembered_password: "Lembrou sua senha?",
    request_new_code: "Solicitar novo código",
  },

  reset_password: {
    title: "Documentin",
    subtitle: "Redefina sua senha",
    new_password_placeholder: "Nova senha",
    confirm_password_placeholder: "Confirmar nova senha",
    updating: "Atualizando...",
    update_password: "Atualizar Senha",
    back_to_login: "Voltar ao Login",
    password_strength: {
      very_weak: "Senha muito fraca",
      weak: "Senha fraca",
      moderate: "Senha moderada",
      strong: "Senha forte",
      very_strong: "Senha muito forte"
    },
    password_match: {
      match: "Senhas conferem",
      no_match: "Senhas não conferem"
    }
  },


  // Dashboard
  dashboard: {
    title: "Dashboard",
    welcome: "Bem-vindo ao Documentin",
    overview: "Visão Geral",
    recent_activities: "Atividades Recentes",
    statistics: "Estatísticas",

    greeting: {
      good_morning: "Bom dia",
      good_afternoon: "Boa tarde",
      good_evening: "Boa noite"
    },

    stats: {
      total_users: "Total de Usuários",
      documents: "Documentos",
      completed_tasks: "Tarefas Concluídas",
      vs_previous_month: "vs mês anterior",
      welcome_to_control_panel: "Bem-vindo ao seu painel de controle"
    },

    profiles: {
      administrator: "Administrador",
      manager: "Gerente",
      employee: "Funcionário",
      user: "Usuário"
    }
  },

  // Configurações
  settings: {
    title: "Configurações",
    account: "Conta",
    account_description: "Informações da sua conta",
    appearance: "Aparência",
    appearance_description: "Personalize a aparência do sistema",
    theme: "Tema",
    theme_description: "Escolha entre modo claro ou escuro",
    language: "Idioma",
    language_description: "Selecione seu idioma preferido",
    session: "Sessão",
    session_description: "Gerencie sua sessão no sistema",
    logout: "Sair do Sistema",
    logout_description: "Encerra sua sessão atual e retorna à tela de login"
  },

  // Perfis de usuário
  profiles: {
    administrator: "Administrador",
    manager: "Gerente",
    employee: "Funcionário"
  },

  // Perfis (usado no enum)
  administrator: "Administrador",
  manager: "Gerente",
  employee: "Funcionário",

  // Formulários
  forms: {
    required_field: "Campo obrigatório",
    invalid_email: "E-mail inválido",
    password_too_short: "Senha muito curta",
    passwords_dont_match: "Senhas não conferem",
    invalid_phone: "Telefone inválido",
    invalid_tax_id: "CNPJ inválido"
  },

  // Mensagens
  messages: {
    success: {
      created: "Criado com sucesso!",
      updated: "Atualizado com sucesso!",
      deleted: "Excluído com sucesso!",
      saved: "Salvo com sucesso!",
      login_success: "Login realizado com sucesso!"
    },
    error: {
      generic: "Ocorreu um erro. Tente novamente.",
      network: "Erro de conexão. Verifique sua internet.",
      unauthorized: "Acesso não autorizado.",
      not_found: "Item não encontrado.",
      validation: "Dados inválidos. Verifique os campos.",
      login_failed: "Login falhou. Verifique suas credenciais."
    },
    confirm: {
      delete: "Tem certeza que deseja excluir este item?",
      unsaved_changes: "Você tem alterações não salvas. Deseja continuar?"
    }
  },

  // Tema
  theme: {
    light: "Claro",
    dark: "Escuro",
    toggle_theme: "Alternar tema"
  },

  // Paginação
  pagination: {
    previous: "Anterior",
    next: "Próximo",
    first: "Primeiro",
    last: "Último",
    page: "Página",
    of: "de",
    items_per_page: "Itens por página",
    showing: "Mostrando",
    to: "a",
    entries: "entradas"
  },

  // Loading
  loading: {
    please_wait: "Por favor, aguarde...",
    loading: "Carregando...",
    processing: "Processando..."
  },

  templates: {
    title: "Templates",
    add_template: "Novo Template",
    edit_template: "Editar Template",
    search_templates: "Buscar templates...",
    name: "Nome",
    content: "Conteúdo",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    is_active: "Status",
    no_templates: "Nenhum template encontrado",
    no_templates_description: "Crie seu primeiro template para começar a padronizar seus documentos.",
    create_first_template: "Criar Primeiro Template",
    createSuccess: "Template criado com sucesso!",
    updateSuccess: "Template atualizado com sucesso!",
    updateStatusSuccess: "Status do template alterado com sucesso!",
    copySuccess: "Template copiado com sucesso!",
    deleteSuccess: "Template excluído com sucesso!",
    copy: "Copiar",
    preview: "Visualizar",
    create_template: "Criar Template",
    change_view: "Alterar Visualização",

  },


  cascadeview: {
    title: "Visualização em Cascata",
    folder_structure: "Estrutura de Pastas",
    document_hierarchy: "Hierarquia de Documentos",
    expand_all: "Expandir Todas",
    collapse_all: "Recolher Todas",
    expand_folder: "Expandir Pasta",
    collapse_folder: "Recolher Pasta",
    view_document: "Visualizar Documento",
    edit_document: "Editar Documento",
    no_folders: "Nenhuma pasta encontrada",
    no_documents: "Nenhum documento nesta pasta",
    loading_structure: "Carregando estrutura de pastas...",
    search_placeholder: "Buscar pastas e documentos...",
    folder_count: "pasta(s)",
    document_count: "documento(s)",
    total_items: "Total de itens",
    breadcrumb_home: "Início",
    breadcrumb_root: "Raiz",
    folder_actions: "Ações da Pasta",
    document_actions: "Ações do Documento",
    move_to_folder: "Mover para Pasta",
    create_subfolder: "Criar Subpasta",
    upload_document: "Enviar Documento",
    tree_view: "Visualização em Árvore",
    list_view: "Visualização em Lista",
    grid_view: "Visualização em Grade",
    show_hidden: "Mostrar Itens Ocultos",
    hide_hidden: "Ocultar Itens Ocultos",
    filter_by_type: "Filtrar por Tipo",
    sort_by_name: "Ordenar por Nome",
    sort_by_date: "Ordenar por Data",
    sort_by_size: "Ordenar por Tamanho",
    empty_folder: "Esta pasta está vazia",
    permission_denied: "Permissão Negada",
    access_restricted: "Acesso a esta pasta é restrito",
    filters: "Filtros",
    new_folder: "Nova Pasta",
    new_document: "Novo Documento",
    quick_search: "Busca rápida...",
    status: "Status",
    show_inactive: "Mostrar inativos",
    document_validation: "Validação de Documentos",
    valid_documents: "Documentos válidos",
    pending_validation: "Pendentes de validação",
    invalid_documents: "Documentos inválidos",
    active: "Ativa",
    inactive: "Inativa",
    valid: "Válido",
    invalid: "Inválido",
    pending: "Pendente",
    items: "itens",
    folders: "Pastas",
    documents: "Documentos",
    created_on: "Criado em"
  },

  integrations: {
    title: "Integrações",
    openai: {
      title: "Configurar OpenAI",
      subtitle: "Configure sua API Key da OpenAI para funcionalidades de IA",
      card_title: "Integração OpenAI",
      card_description: "Configure sua API Key da OpenAI para habilitar funcionalidades de IA no sistema. Suas chaves são armazenadas de forma segura e criptografada.",
      api_key_label: "OpenAI API Key",
      api_key_placeholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      api_key_help: "Sua API Key da OpenAI (começa com \"sk-\"). Você pode encontrá-la em",
      api_key_help_link: "platform.openai.com/api-keys",
      clear_button: "Limpar",
      configure_button: "Configurar",
      configuring_button: "Configurando...",
      success_message: "API Key da OpenAI configurada com sucesso! A integração está ativa.",
      error_message: "Erro ao configurar API Key da OpenAI. Verifique se a chave está correta.",
      validation_error: "Por favor, insira uma API Key válida."
    }
  },
  ai: {
    summarySuccess: "Resumo gerado com sucesso!",
    configAddSuccess: "Configuração OpenAI adicionada com sucesso!",
    configUpdateSuccess: "Configuração OpenAI atualizada com sucesso!"
  },

  // Relatórios
  reports: {
    title: "Relatórios e Análises",
    subtitle: "Visualize insights e métricas do sistema Documentin",

    // Filtros
    filters: {
      period: "Período",
      all_periods: "Todos os períodos",
      today: "Hoje",
      last_week: "Última semana",
      last_month: "Último mês",
      last_quarter: "Último trimestre",
      last_year: "Último ano",
      custom: "Personalizado",
      from: "De",
      to: "Até",
      apply_filter: "Aplicar Filtro"
    },

    // Cards
    cards: {
      documents: "Documentos",
      validations: "Validações",
      versions: "Versões",
      tags: "Tags",
      tasks: "Tarefas",
      groups: "Grupos",
      ai: "IA",
      active: "ativos",
      validated: "validados",
      approval_rate: "Taxa de aprovação",
      complete_history: "Histórico completo de edições",
      active_system: "Sistema de categorização ativo",
      completed: "concluídas",
      overdue: "atrasadas",
      total_members: "membros no total",
      processed_requests: "Requisições processadas"
    },

    // Gráficos
    charts: {
      validation_distribution: "Distribuição de Validações",
      document_evolution: "Evolução de Documentos",
      approved: "Aprovadas",
      rejected: "Rejeitadas",
      returned: "Devolvidas",
      pending: "Pendentes"
    },

    // Seções Detalhadas
    sections: {
      detailed_analysis: "Análise Detalhada de Documentos",
      validation_report: "Relatório de Validações",
      version_control: "Controle de Versões",
      tags_analysis: "Análise de Tags",
      tasks_analysis: "Análise de Tarefas",
      groups_analysis: "Análise de Grupos",
      ai_usage: "Análise de Uso de IA",
      export_report: "Exportar Relatório",
      document_stats: "Estatísticas de Documentos",
      pending_documents: "Documentos Pendentes",
      documents_by_period: "Documentos por Período",
      validation_stats: "Estatísticas de Validações",
      version_stats: "Estatísticas de Versões",
      tag_stats: "Estatísticas de Tags",
      task_stats: "Estatísticas de Tarefas",
      group_stats: "Estatísticas de Grupos",
      ai_stats: "Estatísticas de IA",
      approved_documents: "Documentos Aprovados",
      rejected_documents: "Documentos Rejeitados",
      returned_for_revision: "Documentos Devolvidos para Revisão",
      documents_validated: "Documentos Validados",
      contribution: "Contribuição por Validador",
      version_history: "Histórico de Versões de Documentos",
      most_edited_documents: "Documentos Mais Editados",
      version_count: "Número de Versões",
      relative: "Relativo",
      avg_members_per_group: "Média de Membros por Grupo",
      largest_groups: "Grupos com Mais Membros",
      relative_size: "Tamanho Relativo",
      

      documents_created_period: "Documentos Criados por Período",
      total_documents: "Total de Documentos",
      active_documents: "Documentos Ativos",
      validated_documents: "Documentos Validados",
      awaiting_validation: "Aguardando Validação",

      total_validations: "Total de Validações",
      approval_rate: "Taxa de Aprovação",
      average_time: "Tempo Médio",
      top_validators: "Top Validadores",
      validator: "Validador",
      validations: "Validações",
      participation: "Participação",
      status_distribution: "Distribuição de Status",

      total_versions: "Total de Versões",
      most_edited: "Documentos Mais Editados",
      document: "Documento",
      versions: "Versões",
      activity: "Atividade",

      total_tags: "Total de Tags",
      tag_cloud: "Nuvem de Tags",

      total_tasks: "Total de Tarefas",
      completion_rate: "Taxa de Conclusão",
      overdue_tasks: "Tarefas Atrasadas",
      priority_distribution: "Distribuição por Prioridade",
      high_priority: "Alta Prioridade",
      medium_priority: "Média Prioridade",
      low_priority: "Baixa Prioridade",

      total_groups: "Total de Grupos",
      total_members: "Total de Membros",
      average_per_group: "Média por Grupo",
      most_populous: "Grupos Mais Populosos",
      group: "Grupo",
      members: "Membros",
      distribution: "Distribuição",

      total_requests: "Total de Requisições",
      tokens_used: "Tokens Utilizados",
      average_per_request: "Média por Requisição",
      estimated_cost: "Custo Estimado",
      top_users: "Usuários com Mais Requisições",
      user: "Usuário",
      requests: "Requisições",
      usage: "Uso"
    }


  },
  logout:{
    success: "Logout realizado com sucesso!"
  },
   markdown_editor:{
    upload_error: "Erro ao enviar imagem",
    placeholder: "Escreva seu conteúdo aqui..."
  },

  workspace:{
    title: "Áreas de Trabalho",
  }
};
