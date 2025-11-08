export interface TokenPayload {
  nameid: string; 
  unique_name: string; 
  role: string; 
  CompanyId: string; 
  nbf: number;
  exp: number;
  iat: number;
}