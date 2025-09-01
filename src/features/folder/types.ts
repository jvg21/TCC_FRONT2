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