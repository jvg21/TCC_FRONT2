import { useState, useMemo } from "react";
import { mockCompanies } from "./companies.data";
import type { Company } from "./types";


export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>(() => [...mockCompanies]);
  const [query, setQuery] = useState("");

  const activeCompanies = useMemo(() => {
    return companies.filter((c) => !c.IsActive && c.Name.toLowerCase().includes(query.toLowerCase()));
  }, [companies, query]);

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
    softDelete,
    restore
  } as const;
};
