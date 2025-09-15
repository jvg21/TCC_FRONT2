export const ptTranslations = {
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
    openai: "OpenAI"
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
    deactivate: "Desativar"
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
    createSucess: "Usuário criado com sucesso!",
    updateSucess: "Usuário atualizado com sucesso!",
    createError: "Erro ao criar usuário"
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
    group_user_management: "Gestão de Usuários do Grupo"
  },

  // Pastas
  folders: {
    title: "Pastas",
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


  },

  // Tarefas
  tasks: {
    title: "Tarefas",
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
    edit_document: "Editar Documento",
    search_documents: "Buscar documentos...",
    title_field: "Título",
    content: "Conteúdo",
    folder: "Pasta",
    user: "Usuário",
    created_at: "Criado em",
    updated_at: "Atualizado em",
    is_active: "Status",
    creator: "Criador"
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
    logout: "Sair"
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
    remembered_password: "Lembrou sua senha?"
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    welcome: "Bem-vindo ao Documentin",
    overview: "Visão Geral",
    recent_activities: "Atividades Recentes",
    statistics: "Estatísticas"
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
    create_template: "Criar Template"
  }
};
