export interface Company {
  CompanyId: string;
  Name: string;
  TaxId?: string;
  Email?: string;
  Phone?: string;
  Adress?: string;
  CreatedAt: string;
  UpdatedAt?: string;
  IsActive?:boolean;
}
