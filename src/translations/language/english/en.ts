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
    tasksBoardPage: "Tasks Board",
    tasksDashboard: "Tasks Dashboard",
    taskdashboard: "Tasks Dashboard",
    cascadeview: "Cascade View",
    taskboard: "Task Board",

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
    createError: "Error creating user",
    no_select: "Select a user",
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
    hide_group_users: "Hide Group Users",
    manage_folders: "Manage Folders",
    add_folder: "Add Folder",
    select_folder: "Select Folder",
    folders_in_group: "Folders in Group",
    no_folders_in_group: "No folders in group",
    hide_group_folders: "Hide Group Folders",
    manage_group_users: "Manage Group Users",
    group_user_management: "Group User Management",
    removeUserSuccess: "User removed from group successfully!",
    updateSuccess: "Group updated successfully!",
    updateStatusSuccess: "Group status changed successfully!",
    addUserSuccess: "User added to group successfully!",
    createSuccess: "Group created successfully!"
  },

  // Folders
  folders: {
    title: "List",
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
    name_placeholder: "Enter folder name",
    manage_folders: "Manage Folders",
    hide_group_folders: "Hide Group Folders",
    select_folder: "Select Folder",
    folders_in_group: "Folders in Group",
    no_folders_in_group: "No Folders in Group"

  },

  tags: {
    title: "Tags",
    noTags: "No tags added",
    inputPlaceholder: "Add tag...",
    loading: "Loading tags...",
    addSuccess: "Tag added successfully!",
    removeSuccess: "Tag removed successfully!",
    createNew: "Create new tag:",
    addDocumentSuccess: "Tag added to document successfully!",
    createSuccess: "Create Success",
    createAddSuccess: "Create Add Success"
  },

  // Tasks
  tasks: {
    title: "Task List",
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
    task_dashboard: "Task Dashboard",
    all_tasks: "All Tasks",
    upcoming_deadlines: "Upcoming Deadlines",
    task_statistics: "Task Statistics",
    completion_rate: "Completion Rate",
    progress_rate: "Progress Rate",
    pending_rate: "Pending Rate",
    total_tasks: "Total Tasks",
    completed_tasks: "Completed Tasks",
    in_progress_tasks: "In Progress Tasks",
    pending_tasks: "Pending Tasks",
    in_review_tasks: "In Review Tasks",
    no_upcoming_deadlines: "No upcoming deadlines",
    no_tasks_in_progress: "No tasks in progress",
    no_tasks_in_review: "No tasks in review",
    no_completed_tasks: "No completed tasks",
    empty_column: "This column is empty",

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
    creator: "Creator",
    tags: "Tags",
    no_content: "No content added",
    edit_content: "Edit Content",
    select_folder: "Select folder",
    template_placeholder: "Select template",
    apply_template: "Apply Template",
    template: "Template",
    template_applied_from: "Content applied from template",
    select_template: "Select template (optional)",
    template_applied: "Template applied successfully!",

    filters: {
      hide: "Hide",
      show: "Show",
      date_range: "Date Range",
      author: "Author",
      tag: "Tag",
      all_authors: "All authors",
      all_tags: "All tags",
      clear_filters: "Clear filters",
      advanced_filters: "Advanced filters"
    },

    tabs: {
      general: "General",
      my_documents: "My Documents",
      to_edit: "To Edit",
      validations: "Validations",
      general_alert_title: "All Documents",
      general_alert_description: "View all system documents and manage as needed.",
      my_documents_alert_title: "Your Documents",
      my_documents_alert_description: "Documents you created and can edit at any time.",
      to_edit_alert_title: "Documents to Edit",
      to_edit_alert_description: "Documents assigned to you for editing and review.",
      validations_alert_title: "Pending Validations",
      validations_alert_description: "Documents waiting for your validation as a reviewer.",
      search_my_documents: "Search my documents...",
      search_to_edit: "Search documents to edit...",
      search_validations: "Search validations...",
      no_documents_created_title: "No documents created",
      no_documents_created_description: "You haven't created any documents yet. Start by creating your first document.",
      no_documents_to_edit_title: "No documents to edit",
      no_documents_to_edit_description: "There are no documents assigned to you for editing at the moment.",
      no_validations_pending_title: "No pending validations",
      no_validations_pending_description: "All validations have been processed. Good job!"
    },

    view_document: "View Document",
    untitled_document: "Untitled Document",
    markdown_editor: "Markdown Editor",
    createSuccess: "Document created successfully!",
    updateSuccess: "Document updated successfully!",
    updateStatusSuccess: "Document status changed successfully!",
    deleteSuccess: "Document deleted successfully!",
    document_details: {
      title: "Document Details",
      back: "Back",
      generate_summary: "Generate Summary",
      save_changes: "Save Changes",
      created_by: "Created by",
      folder: "Folder",
      created_at: "Created at",
      updated_at: "Updated at",
      validation: {
        title: "Document Validation",
        pending: "Pending Validation",
        approve: "Approve",
        reject: "Reject",
        rejected: "Rejected",
        approved: "Approved",
        reject_reason: "Reason for rejection",
        validated_by: "Validated by",
        add_note: "Add a note about validation (optional for approval, mandatory for rejection)"
      },
      comments: {
        title: "Comments",
        placeholder: "Type your comment...",
        add_comment: "Add Comment",
        count: "Comments",
      }
    },
    messages: {
      success: {
        document_approved: "Document approved successfully!",
        document_rejected: "Document rejected successfully!",
        comment_added: "Comment added successfully!",
        document_saved: "Document saved successfully!"
      },
      error: {
        document_not_found: "Document not found",
        user_not_found: "User not found",
        folder_not_found: "Folder not found",
        empty_content: "Document content is empty",
        validation_failed: "Failed to validate document",
        comment_failed: "Failed to add comment",
      },
    }
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
    remembered_password: "Remembered your password?",
    request_new_code: "Request new code"
  },

  reset_password: {
    title: "Documentin",
    subtitle: "Reset your password",
    new_password_placeholder: "New password",
    confirm_password_placeholder: "Confirm new password",
    updating: "Updating...",
    update_password: "Update Password",
    back_to_login: "Back to Login",
    password_strength: {
      very_weak: "Very weak password",
      weak: "Weak password",
      moderate: "Moderate password",
      strong: "Strong password",
      very_strong: "Very strong password"
    },
    password_match: {
      match: "Passwords match",
      no_match: "Passwords don't match"
    }
  },



  // Dashboard
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome to Documentin",
    overview: "Overview",
    recent_activities: "Recent Activities",
    statistics: "Statistics",

    greeting: {
      good_morning: "Good morning",
      good_afternoon: "Good afternoon",
      good_evening: "Good evening"
    },

    stats: {
      total_users: "Total Users",
      documents: "Documents",
      completed_tasks: "Completed Tasks",
      vs_previous_month: "vs previous month",
      welcome_to_control_panel: "Welcome to your control panel"
    },

    profiles: {
      administrator: "Administrator",
      manager: "Manager",
      employee: "Employee",
      user: "User"
    }
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
    create_template: "Create Template",
    change_view: "Change View",
  },

  cascadeview: {
    title: "Cascade View",
    folder_structure: "Folder Structure",
    document_hierarchy: "Document Hierarchy",
    expand_all: "Expand All",
    collapse_all: "Collapse All",
    expand_folder: "Expand Folder",
    collapse_folder: "Collapse Folder",
    view_document: "View Document",
    edit_document: "Edit Document",
    no_folders: "No folders found",
    no_documents: "No documents in this folder",
    loading_structure: "Loading folder structure...",
    search_placeholder: "Search folders and documents...",
    folder_count: "folder(s)",
    document_count: "document(s)",
    total_items: "Total items",
    breadcrumb_home: "Home",
    breadcrumb_root: "Root",
    folder_actions: "Folder Actions",
    document_actions: "Document Actions",
    move_to_folder: "Move to Folder",
    create_subfolder: "Create Subfolder",
    upload_document: "Upload Document",
    tree_view: "Tree View",
    list_view: "List View",
    grid_view: "Grid View",
    show_hidden: "Show Hidden Items",
    hide_hidden: "Hide Hidden Items",
    filter_by_type: "Filter by Type",
    sort_by_name: "Sort by Name",
    sort_by_date: "Sort by Date",
    sort_by_size: "Sort by Size",
    empty_folder: "This folder is empty",
    permission_denied: "Permission Denied",
    access_restricted: "Access to this folder is restricted",
    filters: "Filters",
    new_folder: "New Folder",
    new_document: "New Document",
    quick_search: "Quick search...",
    status: "Status",
    show_inactive: "Show inactive",
    document_validation: "Document Validation",
    valid_documents: "Valid documents",
    pending_validation: "Pending validation",
    invalid_documents: "Invalid documents",
    active: "Active",
    inactive: "Inactive",
    valid: "Valid",
    invalid: "Invalid",
    pending: "Pending",
    items: "items",
    folders: "Folders",
    documents: "Documents",
    created_on: "Created on"
  },

  integrations: {
    title: "Integrations",
    openai: {
      title: "Configure OpenAI",
      subtitle: "Configure your OpenAI API Key for AI functionalities",
      card_title: "OpenAI Integration",
      card_description: "Configure your OpenAI API Key to enable AI functionalities in the system. Your keys are stored securely and encrypted.",
      api_key_label: "OpenAI API Key",
      api_key_placeholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      api_key_help: "Your OpenAI API Key (starts with \"sk-\"). You can find it at",
      api_key_help_link: "platform.openai.com/api-keys",
      clear_button: "Clear",
      configure_button: "Configure",
      configuring_button: "Configuring...",
      success_message: "OpenAI API Key configured successfully! Integration is active.",
      error_message: "Error configuring OpenAI API Key. Please verify the key is correct.",
      validation_error: "Please enter a valid API Key."
    }
  },
  ai: {
    summarySuccess: "Summary generated successfully!",
    configAddSuccess: "OpenAI configuration added successfully!",
    configUpdateSuccess: "OpenAI configuration updated successfully!"
  },

}

