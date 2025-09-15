export interface Folder {
  FolderId: number;
  Name: string;
  ParentFolderId?: number | null;
  UserId?: number;
  ValidatorId?: number| null;
  IsActive?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
  Documents?: Document[];
}

// Types baseados nos DTOs da API
export interface FolderGroupRequest {
  FolderId: number;
  GroupId: number;
}

export interface FolderGroup {
  FolderGroupId: number;
  FolderId: number;
  GroupId: number;
  CreatedAt: string;
  UpdatedAt: string;
  IsActive: boolean;
  // Dados relacionados
  FolderName?: string;
  GroupName?: string;
}

export interface MoveFolderRequest {
  FolderId: number;
  ParentFolderId?: number | null;
}

export interface FolderHierarchy {
  FolderId: number;
  Name: string;
  ParentFolderId?: number | null;
  Children: FolderHierarchy[];
  Documents: any[];
  Level: number;
}

export interface FolderPermissions {
  CanRead: boolean;
  CanWrite: boolean;
  CanDelete: boolean;
  CanValidate: boolean;
  IsValidator: boolean;
  IsOwner: boolean;
}

export interface AccessibleFolder {
  FolderId: number;
  Name: string;
  ParentFolderId?: number | null;
  ValidatorId: number;
  ValidatorName: string;
  DocumentCount: number;
  PendingValidations: number;
  PermissionLevel: string; // "Read", "Write", "Admin"
}