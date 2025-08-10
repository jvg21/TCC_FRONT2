import type { Company } from "./types";

export const mockCompanies: Company[] = [
  {
    id: "c1",
    name: "Armtex Serviços",
    cnpj: "12.345.678/0001-99",
    email: "contato@armtex.com",
    phone: "+55 11 99999-0001",
    address: "Rua A, 123",
    isDeleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "c2",
    name: "Exemplo LTDA",
    cnpj: "98.765.432/0001-55",
    email: "hello@example.com",
    phone: "+55 21 99999-2222",
    address: "Av. B, 456",
    isDeleted: true,
    createdAt: new Date().toISOString()
  }
];
