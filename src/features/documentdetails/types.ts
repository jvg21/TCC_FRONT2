export interface Comment {
  CommentId: number;
  Content: string;
  DocumentId: number;
  UserId: number;
  CreatedAt: string;
  UpdatedAt: string;
  isActive: boolean;
}