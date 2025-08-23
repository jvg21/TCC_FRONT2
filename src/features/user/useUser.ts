import { useState, useMemo, useEffect } from "react";
import type { User } from "./types";
import { t } from "i18next";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { profile } from "console";

export const useUser = () => {
  const [user, setUser] = useState<User[]>(() => []);
  const [query, setQuery] = useState("");


  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const activeUser = useMemo(() => {
    return user.filter((c) => c.IsActive);
  }, [user]);

  const deactiveUser = useMemo(() => {
    return user.filter((c) => !c.IsActive);
  }, [user, query]);


  export interface User {
    UserId: number;
    Name: string;
    Email: string;
    Profile: number;
    Phone?: string;
    Password?:string;
    CompanyId?: number;
    CreatedAt?: string;
    UpdatedAt?: string;
    IsActive?: boolean;
  }
  
 
  const transformPayloadToCamelCase = (payload: any) => {
    return {
      name: payload.Name,
      email: payload.Email,
      phone: payload.Phone,
      profile: payload.Profile,
      password: payload.Password,
      companyId: payload.CompanyId
    };
  };

  const transformApiDataToPascalCase = (apiData: any[]): User[] => {
    return apiData.map(item => ({
      UserId: item.userId,
      Name: item.name,
      Email: item.email,
      Phone: item.phone,
      Adress: item.adress,
      Profile: item.profile,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt,
      PreferredLanguage: item.preferredLanguage,
      PreferredTheme: item.preferredTheme,
      Password: item.password,
      LastLoginAt: item.lastLoginAt,
      CompanyId: item.companyId
    }));
  }

  const transformSingleApiData = (item: any): User => {
    return {
      UserId: item.userId,
      Name: item.name,
      Email: item.email,
      Phone: item.phone,
      Profile: item.profile,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt,
      CompanyId: item.companyId
    };
  };

  const get = async () => {
    try {
      const response = await fetch(`${apiUrl}/User/GetListUser`, {
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

      const transformedUsers = transformApiDataToPascalCase(data.objeto);
      setUser(transformedUsers);
      return data;
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      throw err;
    }
  }

  const create = async (payload: Omit<User, "CreatedAt" | "UpdatedAt" | "IsActive" | "PreferredLanguage" | "PreferredTheme" | "LastLoginAt" | "CompanyId">) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase(payload)
      const response = await fetch(`${apiUrl}/User/AddUser`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(camelCasePayload)
      })

      const data: ApiResponse = await response.json();
      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const newUser = transformApiDataToPascalCase([data.objeto]);
      setUser((s) => [...s, ...newUser]);
      notificationActions.showNotification(t('user.createSucess'), 'success');

      return data;
    } catch (err) {
      console.error(t('user.createError'), err);
      throw err;
    }
  };

  const update = async (id: number, updates: Partial<User>) => {
    try {
      const camelCasePayload = {
        userId: id,
        ...transformPayloadToCamelCase(updates)
      };

      const response = await fetch(`${apiUrl}/User/UpdateUser`, {
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

      const updatedUser: User = transformSingleApiData(data.objeto);
      setUser((s) => s.map((c) => c.UserId === id ? updatedUser : c));
      notificationActions.showNotification(t('user.updateSucess'), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao atualizar empresa:", err);
      throw err;
    }
  };

  const softDelete = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/User/ToggleStatusUser/${id}`, {
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

       const updatedUser: User = transformSingleApiData(data.objeto);
      setUser((s) => s.map((c) => c.UserId === id ? updatedUser : c));
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
    user,
    get,
    activeUser,
    query,
    setQuery,
    create,
    update,
    softDelete,
  } as const;
};
