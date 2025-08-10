export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
  isDeleted?: boolean; // optional, used for soft-delete
  createdAt: string;
  updatedAt?: string;
}
