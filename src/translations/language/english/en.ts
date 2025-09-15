export const enTranslations = {
  // Navigation
  navigation: {
    home: "Home",
    companies: "Companies",
    users: "Users",
    groups: "Groups",
    folders: "Folders",
    tasks: "Tasks",
    documents: "Documents",
    templates: "Templates",
    integrations: "Integrations",
    settings: "Settings",
    openai: "OpenAI",
    tasksdashboard: "TaskDashboard"
  },

  // General actions
  actions: {
    add: "Add",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    back: "Back",
    next: "Next",
    previous: "Previous",
    confirm: "Confirm",
    close: "Close",
    view: "View",
    export: "Export",
    import: "Import",
    activate: "Activate",
    deactivate: "Deactivate"
  },

  // Status
  status: {
    active: "Active",
    inactive: "Inactive",
    enabled: "Enabled",
    disabled: "Disabled",
    pending: "Pending",
    completed: "Completed",
    in_progress: "In Progress",
    cancelled: "Cancelled",
    all: "All"
  },

  // Companies
  companies: {
    title: "Companies",
    add_company: "Add Company",
    edit_company: "Edit Company",
    search_companies: "Search companies...",
    name: "Name",
    tax_id: "Tax ID",
    email: "Email",
    zipcode: "Zip Code",
    phone: "Phone",
    address: "Address",
    created_at: "Created at",
    updated_at: "Updated at",
    is_active: "Status",
    createSucess: "Company created successfully!",
    updateSucess: "Company updated successfully!",
    updateStatusSucess: "Company status changed successfully!"
  },

  // Users
  users: {
    title: "Users",
    add_user: "Add User",
    edit_user: "Edit User",
    search_users: "Search users...",
    name: "Name",
    email: "Email",
    profile: "Profile",
    phone: "Phone",
    company: "Company",
    created_at: "Created at",
    updated_at: "Updated at",
    is_active: "Status",
    last_login: "Last Login",
    password: "Password",
    passwordRequirements: "Password must have at least 6 characters, including uppercase, lowercase and number",
    createSucess: "User created successfully!",
    updateSucess: "User updated successfully!",
    createError: "Error creating user"
  },

  // Groups
  groups: {
    title: "Groups",
    add_group: "Add Group",
    edit_group: "Edit Group",
    search_groups: "Search groups...",
    name: "Name",
    description: "Description",
    user: "User",
    created_at: "Created at",
    updated_at: "Updated at",
    is_active: "Status",
    manage_users: "Manage Users",
    add_user: "Add User",
    select_user: "Select User",
    users_in_group: "Users in Group",
    no_users_in_group: "No users in group",
    hide_group_users: "Hide Group Users"
  },

  // Folders
  folders: {
    title: "Folders",
    add_folder: "Add Folder",
    edit_folder: "Edit Folder",
    search_folders: "Search folders...",
    name: "Name",
    parent_folder: "Parent Folder",
    user: "User",
    created_at: "Created at",
    updated_at: "Updated at",
    is_active: "Status",
    validator: "Validator",
    no_parent_folder: "No Parent Folder",
    select_validator: "Select Validator",
    name_placeholder: "Enter folder name"
  },

  // Tasks
  tasks: {
    title: "Tasks",
    add_task: "Add Task",
    edit_task: "Edit Task",
    search_tasks: "Search tasks...",
    title_field: "Title",
    description: "Description",
    due_date: "Due Date",
    priority: "Priority",
    status: "Status",
    assignee: "Assignee",
    user: "User",
    parent_task: "Parent Task",
    created_at: "Created at",
    updated_at: "Updated at",
    is_active: "Status",
    priority_high: "High",
    priority_medium: "Medium",
    priority_low: "Low",
    creator: "Creator",
    select_assignee: "Select Assignee",

    task_board: "Task Board",
    board_view: "Board View",
    list_view: "List View",
    no_tasks: "No tasks",
    no_assignee: "Unassigned",
    move_to: "Move to",
    drag_drop_hint: "Drag and drop to reorganize",
    column_empty: "This column is empty",
    add_task_to_column: "Add task to this column",
    task_count: "task(s)",
    view_task_details: "View task details",
    task_actions: "Task actions",
    
    createSuccess: "Task created successfully!",
    updateSuccess: "Task updated successfully!",
    updateStatusSuccess: "Task status changed successfully!",
    deleteSuccess: "Task deleted successfully!",
    moveSuccess: "Task moved successfully!",
  
    statusTask: {
      todo: "To Do",
      inprogress: "In Progress",
      inreview: "Under Review",
      done: "Completed",
      canceled: "Canceled"
    },
 
    priorityTask: {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent"
    }
  },

  // Documents
  documents: {
    title: "Documents",
    add_document: "Add Document",
    edit_document: "Edit Document",
    search_documents: "Search documents...",
    title_field: "Title",
    content: "Content",
    folder: "Folder",
    user: "User",
    created_at: "Created at",
    updated_at: "Updated at",
    is_active: "Status",
    creator: "Creator"

  },

  // Login
  login: {
    title: "Documentin",
    subtitle: "Sign in to your account",
    email_placeholder: "Enter your email",
    password_placeholder: "Enter your password",
    remember_me: "Remember me",
    forgot_password: "Forgot password?",
    login_button: "Sign In",
    logging_in: "Signing in...",
    light_mode: "Light Mode",
    dark_mode: "Dark Mode",
    is_active: "Status",
    logout: "Logout"
  },

  // Password recovery
  password_recovery: {
    title: "Documentin",
    subtitle: "Recover access to your account",
    email_placeholder: "Enter your email",
    send_button: "Send recovery link",
    sending: "Sending...",
    back_to_login: "Sign in",
    remembered_password: "Remembered your password?"
  },

  // Token reset
  token_reset: {
    title: "Documentin",
    subtitle: "Recover access to your account",
    token_placeholder: "Enter your token",
    send_button: "Send token",
    sending: "Sending...",
    back_to_login: "Sign in",
    remembered_password: "Remembered your password?"
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome to Documentin",
    overview: "Overview",
    recent_activities: "Recent Activities",
    statistics: "Statistics"
  },

  // Settings
  settings: {
    title: "Settings",
    account: "Account",
    account_description: "Your account information",
    appearance: "Appearance",
    appearance_description: "Customize system appearance",
    theme: "Theme",
    theme_description: "Choose between light or dark mode",
    language: "Language",
    language_description: "Select your preferred language",
    session: "Session",
    session_description: "Manage your system session",
    logout: "Sign Out",
    logout_description: "End your current session and return to login screen"
  },

  // User profiles
  profiles: {
    administrator: "Administrator",
    manager: "Manager",
    employee: "Employee"
  },

  // Profiles (used in enum)
  administrator: "Administrator",
  manager: "Manager",
  employee: "Employee",

  // Forms
  forms: {
    required_field: "Required field",
    invalid_email: "Invalid email",
    password_too_short: "Password too short",
    passwords_dont_match: "Passwords don't match",
    invalid_phone: "Invalid phone",
    invalid_tax_id: "Invalid Tax ID"
  },

  // Messages
  messages: {
    success: {
      created: "Created successfully!",
      updated: "Updated successfully!",
      deleted: "Deleted successfully!",
      saved: "Saved successfully!",
      login_success: "Login successful!"
    },
    error: {
      generic: "An error occurred. Please try again.",
      network: "Connection error. Check your internet.",
      unauthorized: "Unauthorized access.",
      not_found: "Item not found.",
      validation: "Invalid data. Check the fields.",
      login_failed: "Login failed. Check your credentials."
    },
    confirm: {
      delete: "Are you sure you want to delete this item?",
      unsaved_changes: "You have unsaved changes. Do you want to continue?"
    }
  },

  // Theme
  theme: {
    light: "Light",
    dark: "Dark",
    toggle_theme: "Toggle theme"
  },

  // Pagination
  pagination: {
    previous: "Previous",
    next: "Next",
    first: "First",
    last: "Last",
    page: "Page",
    of: "of",
    items_per_page: "Items per page",
    showing: "Showing",
    to: "to",
    entries: "entries"
  },

  // Loading
  loading: {
    please_wait: "Please wait...",
    loading: "Loading...",
    processing: "Processing..."
  },

  templates: {
    title: "Templates",
    add_template: "Add Template",
    edit_template: "Edit Template",
    search_templates: "Search templates...",
    name: "Name",
    content: "Content",
    created_at: "Created at",
    updated_at: "Updated at",
    is_active: "Status",
    no_templates: "No templates found",
    no_templates_description: "Create your first template to start standardizing your documents.",
    create_first_template: "Create First Template",
    createSuccess: "Template created successfully!",
    updateSuccess: "Template updated successfully!",
    updateStatusSuccess: "Template status changed successfully!",
    copySuccess: "Template copied successfully!",
    deleteSuccess: "Template deleted successfully!",
    copy: "Copy",
    preview: "Preview",
    create_template: "Create Template"
  }
};