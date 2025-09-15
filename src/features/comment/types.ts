export interface Comment {
  CommentId?: number;
  Content: string;
  DocumentId: number;
  UserId: number;
  UserName?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  IsActive?: boolean;
}
