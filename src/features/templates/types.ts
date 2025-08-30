// src/features/templates/types.ts
export interface Template {
  TemplateId: number;
  Name: string;
  Content: string;
  IsActive?: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface TemplateRequestDTO {
  templateId?: number;
  name: string;
  content: string;
}