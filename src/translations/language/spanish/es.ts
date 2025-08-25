export const esTranslations = {
  // Navegación
  navigation: {
    home: "Inicio",
    companies: "Empresas",
    users: "Usuarios",
    groups: "Grupos",
    folders: "Carpetas",
    tasks: "Tareas",
    documents: "Documentos",
    integrations: "Integraciones",
    settings: "Configuración",
    openai: "OpenAI"
  },

  // Acciones generales
  actions: {
    add: "Agregar",
    actions: "Acciones",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    search: "Buscar",
    filter: "Filtrar",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    confirm: "Confirmar",
    close: "Cerrar",
    view: "Ver",
    export: "Exportar",
    import: "Importar",
    activate: "Activar",
    deactivate: "Desactivar"
  },

  // Estados
  status: {
    active: "Activo",
    inactive: "Inactivo",
    enabled: "Habilitado",
    disabled: "Deshabilitado",
    pending: "Pendiente",
    completed: "Completado",
    in_progress: "En Progreso",
    cancelled: "Cancelado"
  },

  // Empresas
  companies: {
    title: "Empresas",
    add_company: "Agregar Empresa",
    edit_company: "Editar Empresa",
    search_companies: "Buscar empresas...",
    name: "Nombre",
    tax_id: "RUT/CUIT",
    email: "Correo",
    zipcode: "Código Postal",
    phone: "Teléfono",
    address: "Dirección",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado",
    createSucess: "¡Empresa creada exitosamente!",
    updateSucess: "¡Empresa actualizada exitosamente!",
    updateStatusSucess: "¡Estado de empresa cambiado exitosamente!"
  },

  // Usuarios
  users: {
    title: "Usuarios",
    add_user: "Agregar Usuario",
    edit_user: "Editar Usuario",
    search_users: "Buscar usuarios...",
    name: "Nombre",
    email: "Correo",
    profile: "Perfil",
    phone: "Teléfono",
    company: "Empresa",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado",
    last_login: "Último Acceso",
    password: "Contraseña",
    passwordRequirements: "La contraseña debe tener al menos 6 caracteres, incluyendo mayúscula, minúscula y número",
    createSucess: "¡Usuario creado exitosamente!",
    updateSucess: "¡Usuario actualizado exitosamente!",
    createError: "Error al crear usuario"
  },

  // Grupos
  groups: {
    title: "Grupos",
    add_group: "Agregar Grupo",
    edit_group: "Editar Grupo",
    search_groups: "Buscar grupos...",
    name: "Nombre",
    description: "Descripción",
    user: "Usuario",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado"
  },

  // Carpetas
  folders: {
    title: "Carpetas",
    add_folder: "Agregar Carpeta",
    edit_folder: "Editar Carpeta",
    search_folders: "Buscar carpetas...",
    name: "Nombre",
    parent_folder: "Carpeta Padre",
    user: "Usuario",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado"
  },

  // Tareas
  tasks: {
    title: "Tareas",
    add_task: "Agregar Tarea",
    edit_task: "Editar Tarea",
    search_tasks: "Buscar tareas...",
    title_field: "Título",
    description: "Descripción",
    due_date: "Fecha de Vencimiento",
    priority: "Prioridad",
    status: "Estado",
    assignee: "Responsable",
    user: "Usuario",
    parent_task: "Tarea Padre",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado",
    priority_high: "Alta",
    priority_medium: "Media",
    priority_low: "Baja"
  },

  // Documentos
  documents: {
    title: "Documentos",
    add_document: "Agregar Documento",
    edit_document: "Editar Documento",
    search_documents: "Buscar documentos...",
    title_field: "Título",
    content: "Contenido",
    folder: "Carpeta",
    user: "Usuario",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado"
  },

  // Login
  login: {
    title: "Documentin",
    subtitle: "Inicia sesión en tu cuenta",
    email_placeholder: "Ingresa tu correo",
    password_placeholder: "Ingresa tu contraseña",
    remember_me: "Recordarme",
    forgot_password: "¿Olvidaste la contraseña?",
    login_button: "Iniciar Sesión",
    logging_in: "Iniciando sesión...",
    light_mode: "Modo Claro",
    dark_mode: "Modo Oscuro",
    is_active: "Estado",
    logout: "Cerrar Sesión"
  },

  // Recuperación de contraseña
  password_recovery: {
    title: "Documentin",
    subtitle: "Recupera el acceso a tu cuenta",
    email_placeholder: "Ingresa tu correo",
    send_button: "Enviar enlace de recuperación",
    sending: "Enviando...",
    back_to_login: "Iniciar sesión",
    remembered_password: "¿Recordaste tu contraseña?"
  },

  // Reset de token
  token_reset: {
    title: "Documentin",
    subtitle: "Recupera el acceso a tu cuenta",
    token_placeholder: "Ingresa tu token",
    send_button: "Enviar token",
    sending: "Enviando...",
    back_to_login: "Iniciar sesión",
    remembered_password: "¿Recordaste tu contraseña?"
  },

  // Dashboard
  dashboard: {
    title: "Panel de Control",
    welcome: "Bienvenido a Documentin",
    overview: "Resumen",
    recent_activities: "Actividades Recientes",
    statistics: "Estadísticas"
  },

  // Configuraciones
  settings: {
    title: "Configuración",
    account: "Cuenta",
    account_description: "Información de tu cuenta",
    appearance: "Apariencia",
    appearance_description: "Personaliza la apariencia del sistema",
    theme: "Tema",
    theme_description: "Elige entre modo claro u oscuro",
    language: "Idioma",
    language_description: "Selecciona tu idioma preferido",
    session: "Sesión",
    session_description: "Administra tu sesión del sistema",
    logout: "Cerrar Sesión",
    logout_description: "Termina tu sesión actual y regresa a la pantalla de login"
  },

  // Perfiles de usuario
  profiles: {
    administrator: "Administrador",
    manager: "Gerente",
    employee: "Empleado"
  },

  // Perfiles (usado en enum)
  administrator: "Administrador",
  manager: "Gerente",
  employee: "Empleado",

  // Formularios
  forms: {
    required_field: "Campo obligatorio",
    invalid_email: "Correo inválido",
    password_too_short: "Contraseña muy corta",
    passwords_dont_match: "Las contraseñas no coinciden",
    invalid_phone: "Teléfono inválido",
    invalid_tax_id: "RUT/CUIT inválido"
  },

  // Mensajes
  messages: {
    success: {
      created: "¡Creado exitosamente!",
      updated: "¡Actualizado exitosamente!",
      deleted: "¡Eliminado exitosamente!",
      saved: "¡Guardado exitosamente!",
      login_success: "¡Inicio de sesión exitoso!"
    },
    error: {
      generic: "Ocurrió un error. Inténtalo de nuevo.",
      network: "Error de conexión. Verifica tu internet.",
      unauthorized: "Acceso no autorizado.",
      not_found: "Elemento no encontrado.",
      validation: "Datos inválidos. Verifica los campos.",
      login_failed: "Inicio de sesión falló. Verifica tus credenciales."
    },
    confirm: {
      delete: "¿Estás seguro de que quieres eliminar este elemento?",
      unsaved_changes: "Tienes cambios no guardados. ¿Quieres continuar?"
    }
  },

  // Tema
  theme: {
    light: "Claro",
    dark: "Oscuro",
    toggle_theme: "Cambiar tema"
  },

  // Paginación
  pagination: {
    previous: "Anterior",
    next: "Siguiente",
    first: "Primero",
    last: "Último",
    page: "Página",
    of: "de",
    items_per_page: "Elementos por página",
    showing: "Mostrando",
    to: "a",
    entries: "entradas"
  },

  // Carga
  loading: {
    please_wait: "Por favor espera...",
    loading: "Cargando...",
    processing: "Procesando..."
  }
};
