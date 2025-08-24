import { useState, useMemo, useEffect } from "react";
import type { Company } from "./types";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { t } from "i18next";

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const activeCompanies = useMemo(() => {
    return companies.filter((c) => c.IsActive);
  }, [companies]);

  const deactiveCompanies = useMemo(() => {
    return companies.filter((c) => !c.IsActive);
  }, [companies, query]);

  const transformPayloadToCamelCase = (payload: any) => ({
    name: payload.Name,
    taxId: payload.TaxId,
    phone: payload.Phone,
    email: payload.Email,
    adress: payload.Adress,
    zipCode: payload.ZipCode,
    isActive: payload.IsActive || true
  });
  
  const transformApiDataToPascalCase = (apiData: any[]): Company[] => {
    return apiData.map(item => ({
      CompanyId: item.companyId,
      Name: item.name,
      TaxId: item.taxId,
      Phone: item.phone,
      Email: item.email,
      Adress: item.adress,
      ZipCode: item.zipCode,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    }));
  };
  const transformSingleApiData = (item: any): Company => ({
    CompanyId: item.companyId,
    Name: item.name,
    TaxId: item.taxId,
    Phone: item.phone,
    Email: item.email,
    Adress: item.adress,
    ZipCode: item.zipCode,
    IsActive: item.isActive,
    CreatedAt: item.createdAt,
    UpdatedAt: item.updatedAt
  });

  const get = async () => {
    try {
      const response = await fetch(`${apiUrl}/Company/GetListCompanies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const transformedCompanies = transformApiDataToPascalCase(data.objeto);
      setCompanies(transformedCompanies);
      return data;
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      throw err;
    }
  };

  const getById = async (companyId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Company/GetCompaniesById/${companyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      return { ...data, objeto: transformSingleApiData(data.objeto) };
    } catch (err) {
      console.error("Erro ao buscar empresa:", err);
      throw err;
    }
  };



  const create = async (payload: Omit<Company, "CompanyId" | "CreatedAt" | "UpdatedAt" | "IsActive">) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase(payload);

      camelCasePayload.email = camelCasePayload.email.toLowerCase();
      camelCasePayload.phone = camelCasePayload.phone.replace(/\D/g, "");

      console.log(camelCasePayload)

      const response = await fetch(`${apiUrl}/Company/AddCompany`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(camelCasePayload)
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const newCompany: Company = transformSingleApiData(data.objeto);
      setCompanies((s) => [newCompany, ...s]);
      notificationActions.showNotification(t('companies.createSucess'), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao criar empresa:", err);
      throw err;
    }
  };

  const update = async (id: number, updates: Partial<Company>) => {
    try {
      const camelCasePayload = {
        companyId: id,
        ...transformPayloadToCamelCase(updates)
      };

      camelCasePayload.email = camelCasePayload.email.toLowerCase();
      camelCasePayload.phone = camelCasePayload.phone.replace(/\D/g, "");

      const response = await fetch(`${apiUrl}/Company/UpdateCompany`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(camelCasePayload)
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const updatedCompany: Company = transformSingleApiData(data.objeto);
      setCompanies((s) => s.map((c) => c.CompanyId === id ? updatedCompany : c));
      notificationActions.showNotification(t('companies.updateSucess'), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao atualizar empresa:", err);
      throw err;
    }
  };

  const softDelete = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/Company/ToggleStatusCompany/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const updatedCompany: Company = transformSingleApiData(data.objeto);
      setCompanies((s) => s.map((c) => c.CompanyId === id ? updatedCompany : c));
      notificationActions.showNotification(t('companies.updateStatusSucess'), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao alterar status da empresa:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    companies,
    activeCompanies,
    deactiveCompanies,
    query,
    setQuery,
    create,
    update,
    get,
    getById,
    softDelete
  } as const;
};