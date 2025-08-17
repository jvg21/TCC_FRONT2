export interface Company {
  CompanyId: number;
  Name: string;
  TaxId?: string;
  Email?: string;
  Phone?: string;
  Adress?: string;
  CreatedAt: string;
  UpdatedAt?: string;
  ZipCode?: string;
  IsActive?:boolean;
}
