import type { Company } from "./types";

export const mockCompanies: Company[] = [
  {
    CompanyId: "c1",
    Name: "Armtex Serviços",
    TaxId: "12.345.678/0001-99",
    Email: "contato@armtex.com",
    Phone: "+55 11 99999-0001",
    Adress: "Rua A, 123",
    IsActive: false,
    CreatedAt: new Date().toISOString()
  },
  {
    CompanyId: "c2",
    Name: "Exemplo LTDA",
    TaxId: "98.765.432/0001-55",
    Email: "hello@example.com",
    Phone: "+55 21 99999-2222",
    Adress: "Av. B, 456",
    IsActive: true,
    CreatedAt: new Date().toISOString()
  }
];
