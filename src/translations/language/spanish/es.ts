export const esTranslations = {
  invalidCredentials: "Credenciales inválidas",
  notFound: "No encontrado",
  // Navegación
  navigation: {
    home: "Inicio",
    companies: "Empresas",
    users: "Usuarios",
    groups: "Grupos",
    folders: "Carpetas",
    tasks: "Tareas",
    documents: "Documentos",
    templates: "Plantillas",
    integrations: "Integraciones",
    settings: "Configuración",
    openai: "OpenAI",
    tasksBoardPage: "Panel de Tareas",
    tasksDashboard: "Panel de Tareas",
    taskdashboard: "Panel de Tareas",
    cascadeview: "Vista en Cascada",
    taskboard: "Tablero de Tareas",
    reports: "Reportes",
    cancel: "Cancelar"
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
    deactivate: "Desactivar",
    find_similar: "Encontrar Similares",
    clear_results: "Limpiar Resultados",
    saving: "Guardando...",
    importing: "Importando...",
    copy: "Copiar"
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
    cancelled: "Cancelado",
    all: "Todos"
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
    createSuccess: "¡Usuario creado exitosamente!",
    updateSuccess: "¡Usuario actualizado exitosamente!",
    createError: "Error al crear usuario",
    no_select: "Seleccione un usuario",
    select_company: "Seleccione una empresa",
    updateStatusSuccess: "¡Estado del usuario cambiado con éxito!",
    select_company: "Seleccionar Empresa"
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
    is_active: "Estado",
    manage_users: "Gestionar Usuarios",
    add_user: "Agregar Usuario",
    select_user: "Seleccionar Usuario",
    users_in_group: "Usuarios en Grupo",
    no_users_in_group: "Ningún usuario en el grupo",
    hide_group_users: "Ocultar Usuarios del Grupo",
    manage_folders: "Gestionar Carpetas",
    add_folder: "Agregar Carpeta",
    select_folder: "Seleccionar Carpeta",
    folders_in_group: "Carpetas en Grupo",
    no_folders_in_group: "Ninguna carpeta en el grupo",
    hide_group_folders: "Ocultar Carpetas del Grupo",
    manage_group_users: "Gestionar Usuarios del Grupo",
    group_user_management: "Gestión de Usuarios del Grupo",
    removeUserSuccess: "¡Usuario removido del grupo con éxito!",
    updateSuccess: "¡Grupo actualizado con éxito!",
    updateStatusSuccess: "¡Estado del grupo cambiado con éxito!",
    addUserSuccess: "¡Usuario agregado al grupo con éxito!",
    createSuccess: "¡Grupo creado con éxito!",

  },

  // Carpetas
  folders: {
    title: "Lista",
    add_folder: "Agregar Carpeta",
    edit_folder: "Editar Carpeta",
    search_folders: "Buscar carpetas...",
    name: "Nombre",
    parent_folder: "Carpeta Padre",
    user: "Usuario",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado",
    validator: "Validador",
    no_parent_folder: "Sin carpeta principal",
    name_placeholder: "Ingrese el nombre de la carpeta",
    select_validator: "Seleccionar Validador",
    manage_folders: "Administrar Carpetas",
    select_folder: "Seleccionar Carpeta",
    folders_in_group: "Carpetas En El Grupo",
    no_folders_in_group: "No Hay Carpetas En El Grupo",
    hide_group_folders: "Ocultar Carpetas de Grupo",
    createSuccess: "¡Carpeta creada con éxito!",
    updateSuccess: "¡Carpeta actualizada con éxito!",
    updateStatusSuccess: "¡Estado de la carpeta cambiado con éxito!",
    groupAddedSuccess: "¡Carpeta agregada al grupo con éxito!",
    statusToggleSuccess: "¡Estado de la carpeta alternado con éxito!"
  },

  tags: {
    title: "Etiquetas",
    noTags: "Ninguna etiqueta agregada",
    inputPlaceholder: "Agregar etiqueta...",
    loading: "Cargando etiquetas...",
    addSuccess: "¡Etiqueta agregada con éxito!",
    removeSuccess: "¡Etiqueta eliminada con éxito!",
    createNew: "Crear nueva etiqueta:",
    addDocumentSuccess: "¡Etiqueta agregada al documento con éxito!",
    createSuccess: "Creado Exitosamente",
    createAddSuccess: "Etiqueta Creada Exitosamente",

  },

  // Tareas
  tasks: {
    title: "Lista de Tareas",
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
    priority_low: "Baja",
    creator: "Creador",
    select_assignee: "Seleccionar Cesionario",

    task_board: "Tablero de Tareas",
    board_view: "Vista de Tablero",
    list_view: "Vista de Lista",
    no_tasks: "Sin tareas",
    no_assignee: "Sin asignar",
    move_to: "Mover a",
    drag_drop_hint: "Arrastra y suelta para reorganizar",
    column_empty: "Esta columna está vacía",
    add_task_to_column: "Agregar tarea a esta columna",
    task_count: "tarea(s)",
    view_task_details: "Ver detalles de la tarea",
    task_actions: "Acciones de la tarea",

    createSuccess: "¡Tarea creada con éxito!",
    updateSuccess: "¡Tarea actualizada con éxito!",
    updateStatusSuccess: "¡Estado de la tarea cambiado con éxito!",
    deleteSuccess: "¡Tarea eliminada con éxito!",
    moveSuccess: "¡Tarea movida con éxito!",
    task_dashboard: "Dashboard de Tareas",
    all_tasks: "Todas las Tareas",
    upcoming_deadlines: "Próximos Vencimientos",
    task_statistics: "Estadísticas de Tareas",
    completion_rate: "Tasa de Finalización",
    progress_rate: "Tasa de Progreso",
    pending_rate: "Tasa Pendiente",
    total_tasks: "Total de Tareas",
    completed_tasks: "Tareas Completadas",
    in_progress_tasks: "Tareas en Progreso",
    pending_tasks: "Tareas Pendientes",
    in_review_tasks: "Tareas en Revisión",
    no_upcoming_deadlines: "No hay vencimientos próximos",
    no_tasks_in_progress: "No hay tareas en progreso",
    no_tasks_in_review: "No hay tareas en revisión",
    no_completed_tasks: "No hay tareas completadas",
    empty_column: "Esta columna está vacía",
    description_placeholder: "Describa la tarea...",

    statusTask: {
      todo: "To Do",
      inprogress: "En Curso",
      inreview: "Bajo Revisión",
      done: "Terminado",
      canceled: "Cancelado"
    },

    priorityTask: {
      low: "Bajo",
      medium: "Promedio",
      high: "Alto",
      urgent: "Urgente"
    }
  },

  // Documentos
  documents: {
    title: "Documentos",
    add_document: "Agregar Documento",
    edit_document: "Editar Documento",
    search_documents: "Buscar documentos...",
    semantic_search: "Búsqueda Semántica",
    semantic_search_description: "Encuentra documentos similares en contenido usando embeddings impulsados por IA.",
    search_by_meaning: "Buscar por significado...",
    title_field: "Título",
    content: "Contenido",
    folder: "Carpeta",
    user: "Usuario",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado",
    creator: "Creador",
    tags: "Etiquetas",
    no_content: "Sin contenido agregado",
    edit_content: "Editar Contenido",
    select_folder: "Seleccionar carpeta",
    template_placeholder: "Seleccionar plantilla",
    apply_template: "Aplicar Plantilla",
    template: "Plantilla",
    template_applied_from: "Contenido aplicado de la plantilla",
    select_template: "Seleccionar plantilla (opcional)",
    template_applied: "¡Plantilla aplicada con éxito!",
    add: "Agregar Documento",
    selectFolderPlaceholder: "Seleccione una carpeta para el documento",
    import: "Importar Documento",
    importSuccess: "¡Documento importado con éxito!",
    importError: "Error al importar documento",
    importDocument: "Importar Documento",
    selectFolder: "Seleccionar Carpeta",
    resetValidationSuccess: "¡Validación del documento restablecida con éxito!",
    validationUpdateSuccess: "¡Estado de validación del documento actualizado con éxito!",


    filters: {
      rag:{
        hide: "Ocultar RAG",
        show: "Mostrar RAG",
      },
      hide: "Ocultar",
      show: "Mostrar",
      date_range: "Rango de Fechas",
      author: "Autor",
      tag: "Etiqueta",
      all_authors: "Todos los autores",
      all_tags: "Todas las etiquetas",
      clear_filters: "Limpiar filtros",
      advanced_filters: "Filtros avanzados"
    },


    tabs: {
      general: "General",
      my_documents: "Mis Documentos",
      to_edit: "Para Editar",
      validations: "Validaciones",
      general_alert_title: "Todos los Documentos",
      general_alert_description: "Vea todos los documentos del sistema y administre según sea necesario.",
      my_documents_alert_title: "Sus Documentos",
      my_documents_alert_description: "Documentos que creó y puede editar en cualquier momento.",
      to_edit_alert_title: "Documentos para Editar",
      to_edit_alert_description: "Documentos asignados a usted para edición y revisión.",
      validations_alert_title: "Validaciones Pendientes",
      validations_alert_description: "Documentos esperando su validación como revisor.",
      search_my_documents: "Buscar mis documentos...",
      search_to_edit: "Buscar documentos para editar...",
      search_validations: "Buscar validaciones...",
      no_documents_created_title: "Ningún documento creado",
      no_documents_created_description: "Aún no ha creado ningún documento. Comience creando su primer documento.",
      no_documents_to_edit_title: "Ningún documento para editar",
      no_documents_to_edit_description: "No hay documentos asignados a usted para editar en este momento.",
      no_validations_pending_title: "Ninguna validación pendiente",
      no_validations_pending_description: "Todas las validaciones han sido procesadas. ¡Buen trabajo!"
    },

    view_document: "Ver Documento",
    untitled_document: "Documento sin título",
    markdown_editor: "Editor Markdown",
    createSuccess: "¡Documento creado con éxito!",
    updateSuccess: "¡Documento actualizado con éxito!",
    updateStatusSuccess: "¡Estado del documento cambiado con éxito!",
    deleteSuccess: "¡Documento eliminado con éxito!",

    document_details: {
      title: "Detalles del Documento",
      back: "Volver",
      generate_summary: "Generar Resumen",
      save_changes: "Guardar Cambios",
      created_by: "Creado por",
      folder: "Carpeta",
      created_at: "Creado en",
      updated_at: "Actualizado en",
      version_history: {
        button: "Versiones del Documento",
        today: "Hoy",
        current_version: "Versión Actual",
        title: "Historial de Versiones",
      },

      summary_types: {
        structured: "Resumen estándar",
        structured_desc: "Resumen completo y estructurado del documento",
        comparative: "Resumen en tópicos",
        comparative_desc: "Lista los puntos principales en formato de tópicos",
        analytical: "Resumen corto (TL;DR)",
        analytical_desc: "Versión resumida destacando solo lo esencial"
      },

      export: {
        button: "Exportar",
        export_pdf: "Exportar PDF",
        export_docx: "Exportar DOCX",
        export_md: "Exportar MD"
      },
      validation: {
        title: "Validación del Documento",
        pending: "Pendiente de Validación",
        approve: "Aprobar",
        reject: "Rechazar",
        rejected: "Rechazado",
        approved: "Aprobado",
        reject_reason: "Motivo del rechazo",
        validated_by: "Validado por",
        add_note: "Agregue una nota sobre la validación (opcional para aprobación, obligatoria para rechazo)",

      },

      comments: {
        title: "Comentarios",
        placeholder: "Escriba su comentario...",
        add_comment: "Agregar Comentario",
        count: "Comentarios",
        createSuccess: "¡Comentario agregado con éxito!"
      }
    },
    messages: {
      success: {
        document_approved: "¡Documento aprobado con éxito!",
        document_rejected: "¡Documento rechazado con éxito!",
        comment_added: "¡Comentario agregado con éxito!",
        document_saved: "¡Documento guardado con éxito!"
      },
      error: {
        document_not_found: "Documento no encontrado",
        user_not_found: "Usuario no encontrado",
        folder_not_found: "Carpeta no encontrada",
        empty_content: "El contenido del documento está vacío",
        validation_failed: "Error al validar documento",
        comment_failed: "Error al agregar comentario",
      },

    }
  },

  // Templates
  templates: {
    title: "Plantillas",
    add_template: "Nueva Plantilla",
    edit_template: "Editar Plantilla",
    search_templates: "Buscar plantillas...",
    name: "Nombre",
    content: "Contenido",
    created_at: "Creado en",
    updated_at: "Actualizado en",
    is_active: "Estado",
    no_templates: "No se encontraron plantillas",
    no_templates_description: "Crea tu primera plantilla para comenzar a estandarizar tus documentos.",
    create_first_template: "Crear Primera Plantilla",
    createSuccess: "¡Plantilla creada con éxito!",
    updateSuccess: "¡Plantilla actualizada con éxito!",
    updateStatusSuccess: "¡Estado de la plantilla cambiado con éxito!",
    copySuccess: "¡Plantilla copiada con éxito!",
    deleteSuccess: "¡Plantilla eliminada con éxito!",
    copy: "Copiar",
    preview: "Vista previa",
    create_template: "Crear Plantilla",
    change_view: "Cambiar Vista",
  },

  // Vista en Cascada
  cascadeview: {
    title: "Vista en Cascada",
    folder_structure: "Estructura de Carpetas",
    document_hierarchy: "Jerarquía de Documentos",
    expand_all: "Expandir Todas",
    collapse_all: "Contraer Todas",
    expand_folder: "Expandir Carpeta",
    collapse_folder: "Contraer Carpeta",
    view_document: "Ver Documento",
    edit_document: "Editar Documento",
    no_folders: "No se encontraron carpetas",
    no_documents: "No hay documentos en esta carpeta",
    loading_structure: "Cargando estructura de carpetas...",
    search_placeholder: "Buscar carpetas y documentos...",
    folder_count: "carpeta(s)",
    document_count: "documento(s)",
    total_items: "Total de elementos",
    breadcrumb_home: "Inicio",
    breadcrumb_root: "Raíz",
    folder_actions: "Acciones de Carpeta",
    document_actions: "Acciones de Documento",
    move_to_folder: "Mover a Carpeta",
    create_subfolder: "Crear Subcarpeta",
    upload_document: "Subir Documento",
    tree_view: "Vista de Árbol",
    list_view: "Vista de Lista",
    grid_view: "Vista de Cuadrícula",
    show_hidden: "Mostrar Elementos Ocultos",
    hide_hidden: "Ocultar Elementos Ocultos",
    filter_by_type: "Filtrar por Tipo",
    sort_by_name: "Ordenar por Nombre",
    sort_by_date: "Ordenar por Fecha",
    sort_by_size: "Ordenar por Tamaño",
    empty_folder: "Esta carpeta está vacía",
    permission_denied: "Permiso Denegado",
    access_restricted: "El acceso a esta carpeta está restringido",
    filters: "Filtros",
    new_folder: "Nueva Carpeta",
    new_document: "Nuevo Documento",
    quick_search: "Búsqueda rápida...",
    status: "Estado",
    show_inactive: "Mostrar inactivos",
    document_validation: "Validación de Documentos",
    valid_documents: "Documentos válidos",
    pending_validation: "Pendientes de validación",
    invalid_documents: "Documentos inválidos",
    active: "Activa",
    inactive: "Inactiva",
    valid: "Válido",
    invalid: "Inválido",
    pending: "Pendiente",
    items: "elementos",
    folders: "Carpetas",
    documents: "Documentos",
    created_on: "Creado en"
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
    logout: "Cerrar Sesión",
    success: "¡Cierre de sesión exitoso!",
    error: "Error de inicio de sesión. Verifica tus credenciales."
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
    remembered_password: "¿Recordaste tu contraseña?",
    request_new_code: "Solicitar nuevo código"
  },

  reset_password: {
    title: "Documentin",
    subtitle: "Restablece tu contraseña",
    new_password_placeholder: "Nueva contraseña",
    confirm_password_placeholder: "Confirmar nueva contraseña",
    updating: "Actualizando...",
    update_password: "Actualizar Contraseña",
    back_to_login: "Volver al Login",
    password_strength: {
      very_weak: "Contraseña muy débil",
      weak: "Contraseña débil",
      moderate: "Contraseña moderada",
      strong: "Contraseña fuerte",
      very_strong: "Contraseña muy fuerte"
    },
    password_match: {
      match: "Las contraseñas coinciden",
      no_match: "Las contraseñas no coinciden"
    }
  },




  // Notificações/Mensagens
  notifications: {
    success: {
      saved: "¡Guardado con éxito!",
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
    entries: "entradas",
    prev: "Anterior",
    next_page: "Siguiente",
    rows_per_page: "Filas por página"
  },

  // Carga
  loading: {
    please_wait: "Por favor espera...",
    loading: "Cargando...",
    processing: "Procesando..."
  },

  // Dashboard
  dashboard: {
    title: "Panel de Control",
    welcome: "Bienvenido a Documentin",
    overview: "Resumen",
    recent_activities: "Actividades Recientes",
    statistics: "Estadísticas",

    greeting: {
      good_morning: "Buenos días",
      good_afternoon: "Buenas tardes",
      good_evening: "Buenas noches"
    },

    stats: {
      total_users: "Total de Usuarios",
      documents: "Documentos",
      completed_tasks: "Tareas Completadas",
      vs_previous_month: "vs mes anterior",
      welcome_to_control_panel: "Bienvenido a su panel de control"
    },

    profiles: {
      administrator: "Administrador",
      manager: "Gerente",
      employee: "Empleado",
      user: "Usuario"
    }
  },

  // Configuraciones
  settings: {
    title: "Configuraciones",
    account: "Cuenta",
    account_description: "Información de su cuenta",
    appearance: "Apariencia",
    appearance_description: "Personalice la apariencia del sistema",
    theme: "Tema",
    theme_description: "Elija entre modo claro u oscuro",
    language: "Idioma",
    language_description: "Seleccione su idioma preferido",
    session: "Sesión",
    session_description: "Gestione su sesión en el sistema",
    logout: "Cerrar Sesión",
    logout_description: "Termina su sesión actual y regresa a la pantalla de inicio de sesión"
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
    invalid_email: "Email inválido",
    password_too_short: "Contraseña muy corta",
    passwords_dont_match: "Las contraseñas no coinciden",
    invalid_phone: "Teléfono inválido",
    invalid_tax_id: "RUT/CUIT inválido"
  },

  // Mensajes
  messages: {
    success: {
      created: "¡Creado con éxito!",
      updated: "¡Actualizado con éxito!",
      deleted: "¡Eliminado con éxito!",
      saved: "¡Guardado con éxito!",
      login_success: "¡Inicio de sesión exitoso!"
    },
    error: {
      generic: "Ha ocurrido un error. Inténtelo de nuevo.",
      network: "Error de conexión. Verifique su internet.",
      unauthorized: "Acceso no autorizado.",
      not_found: "Elemento no encontrado.",
      validation: "Datos inválidos. Verifique los campos.",
      login_failed: "Error en el inicio de sesión. Verifique sus credenciales."
    },
    confirm: {
      delete: "¿Está seguro de que desea eliminar este elemento?",
      unsaved_changes: "Tiene cambios no guardados. ¿Desea continuar?"
    }
  },

  integrations: {
    title: "Integraciones",
    openai: {
      title: "Configurar OpenAI",
      subtitle: "Configure su API Key de OpenAI para funcionalidades de IA",
      card_title: "Integración OpenAI",
      card_description: "Configure su API Key de OpenAI para habilitar funcionalidades de IA en el sistema. Sus claves se almacenan de forma segura y encriptada.",
      api_key_label: "OpenAI API Key",
      api_key_placeholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      api_key_help: "Su API Key de OpenAI (comienza con \"sk-\"). Puede encontrarla en",
      api_key_help_link: "platform.openai.com/api-keys",
      clear_button: "Limpiar",
      configure_button: "Configurar",
      configuring_button: "Configurando...",
      success_message: "¡API Key de OpenAI configurada exitosamente! La integración está activa.",
      error_message: "Error al configurar API Key de OpenAI. Verifique que la clave sea correcta.",
      validation_error: "Por favor, ingrese una API Key válida."
    }
  },

  ai: {
    summarySuccess: "¡Resumen generado exitosamente!",
    configAddSuccess: "¡Configuración OpenAI agregada exitosamente!",
    configUpdateSuccess: "¡Configuración OpenAI actualizada exitosamente!"
  },

  // Informes
  reports: {
    title: "Informes y Análisis",
    subtitle: "Visualice conocimientos y métricas del sistema Documentin",

    // Filtros
    filters: {
      period: "Período",
      all_periods: "Todos los períodos",
      today: "Hoy",
      last_week: "Última semana",
      last_month: "Último mes",
      last_quarter: "Último trimestre",
      last_year: "Último año",
      custom: "Personalizado",
      from: "Desde",
      to: "Hasta",
      apply_filter: "Aplicar Filtro"
    },

    // Tarjetas
    cards: {
      documents: "Documentos",
      validations: "Validaciones",
      versions: "Versiones",
      tags: "Etiquetas",
      tasks: "Tareas",
      groups: "Grupos",
      ai: "IA",
      active: "activos",
      validated: "validados",
      approval_rate: "Tasa de aprobación",
      complete_history: "Historial completo de ediciones",
      active_system: "Sistema de categorización activo",
      completed: "completadas",
      overdue: "atrasadas",
      total_members: "miembros en total",
      processed_requests: "Solicitudes procesadas"
    },

    // Gráficos
    charts: {
      validation_distribution: "Distribución de Validaciones",
      document_evolution: "Evolución de Documentos",
      approved: "Aprobadas",
      rejected: "Rechazadas",
      returned: "Devueltas",
      pending: "Pendientes"
    },

    // Secciones Detalladas
    sections: {
      detailed_analysis: "Análisis Detallado de Documentos",
      validation_report: "Informe de Validaciones",
      version_control: "Control de Versiones",
      tags_analysis: "Análisis de Etiquetas",
      tasks_analysis: "Análisis de Tareas",
      groups_analysis: "Análisis de Grupos",
      ai_usage: "Análisis de Uso de IA",
      export_report: "Exportar Informe",

      documents_created_period: "Documentos Creados por Período",
      total_documents: "Total de Documentos",
      active_documents: "Documentos Activos",
      validated_documents: "Documentos Validados",
      awaiting_validation: "Esperando Validación",

      total_validations: "Total de Validaciones",
      approval_rate: "Tasa de Aprobación",
      average_time: "Tiempo Promedio",
      top_validators: "Principales Validadores",
      validator: "Validador",
      validations: "Validaciones",
      participation: "Participación",
      status_distribution: "Distribución de Estado",

      total_versions: "Total de Versiones",
      most_edited: "Documentos Más Editados",
      document: "Documento",
      versions: "Versiones",
      activity: "Actividad",

      total_tags: "Total de Etiquetas",
      tag_cloud: "Nube de Etiquetas",

      total_tasks: "Total de Tareas",
      completion_rate: "Tasa de Finalización",
      overdue_tasks: "Tareas Atrasadas",
      priority_distribution: "Distribución por Prioridad",
      high_priority: "Alta Prioridad",
      medium_priority: "Prioridad Media",
      low_priority: "Baja Prioridad",

      total_groups: "Total de Grupos",
      total_members: "Total de Miembros",
      average_per_group: "Promedio por Grupo",
      most_populous: "Grupos Más Poblados",
      group: "Grupo",
      members: "Miembros",
      distribution: "Distribución",

      total_requests: "Total de Solicitudes",
      tokens_used: "Tokens Utilizados",
      average_per_request: "Promedio por Solicitud",
      estimated_cost: "Costo Estimado",
      top_users: "Principales Usuarios por Solicitudes",
      user: "Usuario",
      requests: "Solicitudes",
      usage: "Uso"
    }
  },
  logout:{
    success: "¡Cierre de sesión exitoso!"
  },
   markdown_editor:{
    upload_error: "Error al subir la imagen",
    placeholder: "Escribe aquí tu contenido en Markdown..."
  }
};
