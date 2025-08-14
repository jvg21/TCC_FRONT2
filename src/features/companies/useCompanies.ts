import { useState, useMemo } from "react";
import { mockCompanies } from "./companies.data";
import type { Company } from "./types";

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState("");
  const API_URL = "https://localhost:7198";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJndWlsaGVybWUiLCJyb2xlIjoiMSIsIkNvbXBhbnlJZCI6IjEiLCJHcm91cHNJZHMiOiIiLCJGb2xkZXJzSWRzIjoiIiwibmJmIjoxNzU1MTI0MTAwLCJleHAiOjE3NTUxNTI5MDAsImlhdCI6MTc1NTEyNDEwMH0.S6_eh51hHNgzUmWYtJLo83L1IRSjeyBKEh1CoaB8ud0"

  const activeCompanies = useMemo(() => {
    return companies.filter((c) => !c.IsActive && c.Name.toLowerCase().includes(query.toLowerCase()));
  }, [companies, query]);


  const get = async () => { 
    try {
      const response = await fetch(`${API_URL}/Company/GetListCompanies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.erro) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
  
      const data: Company[] = await response.objeto.json();
      setCompanies(data); 
      return data; 
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      throw err; 
    }
  }

    
  


  const create = (payload: Omit<Company, "CompanyId" | "CreatedAt" | "UpdatedAt" | "IsActive">) => {
    const newCompany: Company = {
      ...payload,
      CompanyId: '1',
      CreatedAt: new Date().toISOString(),
      IsActive: false
    };
    setCompanies((s) => [newCompany, ...s]);
    return newCompany;
  };

  const update = (id: string, updates: Partial<Company>) => {
    setCompanies((s) => s.map((c) => c.CompanyId === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const softDelete = (id: string) => {
    setCompanies((s) => s.map((c) => c.CompanyId === id ? { ...c, isDeleted: true } : c));
  };

  const restore = (id: string) => {
    setCompanies((s) => s.map((c) => c.CompanyId === id ? { ...c, isDeleted: false } : c));
  };

  return {
    companies,
    activeCompanies,
    query,
    setQuery,
    create,
    update,
    get,
    softDelete,
    restore
  } as const;
};
