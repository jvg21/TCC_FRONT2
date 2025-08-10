import { useState, useMemo } from "react";
import { mockCompanies } from "./companies.data";
import type { Company } from "./types";

/**
 * Hook de feature que encapsula toda a lógica (estado, filtros, CRUD).
 * Retorna somente apis tipadas para uso pela UI.
 */
export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>(() => [...mockCompanies]);
  const [query, setQuery] = useState("");

  const activeCompanies = useMemo(() => {
    return companies.filter((c) => !c.isDeleted && c.name.toLowerCase().includes(query.toLowerCase()));
  }, [companies, query]);

  const create = (payload: Omit<Company, "id" | "createdAt" | "updatedAt" | "isDeleted">) => {
    const newCompany: Company = {
      ...payload,
      id: '1',
      createdAt: new Date().toISOString(),
      isDeleted: false
    };
    setCompanies((s) => [newCompany, ...s]);
    return newCompany;
  };

  const update = (id: string, updates: Partial<Company>) => {
    setCompanies((s) => s.map((c) => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const softDelete = (id: string) => {
    setCompanies((s) => s.map((c) => c.id === id ? { ...c, isDeleted: true } : c));
  };

  const restore = (id: string) => {
    setCompanies((s) => s.map((c) => c.id === id ? { ...c, isDeleted: false } : c));
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
