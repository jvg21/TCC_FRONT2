export interface Tag {
  TagId: number;
  Name: string;
  UserId: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface DocumentXTag {
  TagId: number;
  DocumentId: number;
  UserId: number;
  CreatedAt: string;
}