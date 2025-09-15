// src/features/templates/types.ts
export interface Template {
  TemplateId: number;
  Name: string;
  Content: string;
  IsActive?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
}

