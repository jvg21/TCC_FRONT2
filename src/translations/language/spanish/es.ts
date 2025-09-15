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
    templates: "Plantillas",
    integrations: "Integraciones",
    settings: "Configuración",
    openai: "OpenAI",
    tasksBoardPage: "Panel de Tareas",
    tasksDashboard: "Panel de Tareas",
    cascadeview: "Vista en Cascada"
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
    hide_group_folders: "Ocultar Carpetas del Grupo"
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
    is_active: "Estado",
    validator: "Validador",
    no_parent_folder: "Sin carpeta principal",
    name_placeholder: "Ingrese el nombre de la carpeta",
    select_validator: "Seleccionar Validador"
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
    },

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
      create_template: "Crear Plantilla"
    },

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

      // Textos específicos do código
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
    }
  }
};
