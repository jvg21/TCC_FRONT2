export interface TokenPayload {
  nameid: string; // id do usuário
  unique_name: string; // nome do usuário
  role: string; // profile do usuário (1, 2 ou 3)
  CompanyId: string; // ID da empresa
  nbf: number;
  exp: number;
  iat: number;
}