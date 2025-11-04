import { useState, useMemo, useEffect } from "react";
import type { User } from "./types";
import { t } from "i18next";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { useAuthContext } from "../../context/AuthContext";

export const useUser = () => {
  const [user, setUser] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const { user: compan } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const activeUser = useMemo(() => {
    return user.filter((c) => c.IsActive);
  }, [user]);

  const deactiveUser = useMemo(() => {
    return user.filter((c) => !c.IsActive);
  }, [user]);

  const transformPayloadToCamelCase = (payload: any) => {
    return {
      name: payload.Name,
      email: payload.Email?.toLowerCase(),
      phone: payload.Phone?.replace(/\D/g, ""),
      preferredLanguage: payload.PreferredLanguage || 1,
      preferredTheme: payload.PreferredTheme || 2,
      profile: payload.Profile,
      password: payload.Password,
      companyId: payload.CompanyId || compan?.CompanyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: payload.IsActive || true
    };
  };

  const transformApiDataToPascalCase = (apiData: any[]): User[] => {
    return apiData.map(item => ({
      UserId: item.userId,
      Name: item.name,
      Email: item.email,
      Phone: item.phone,
      Profile: item.profile,
      Password: item.password,

      CompanyId: item.companyId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    }));
  };

  const transformSingleApiData = (item: any): User => {
    return {
      UserId: item.userId,
      Name: item.name,
      Email: item.email,
      Phone: item.phone,
      Profile: item.profile,
      Password: item.password,
      CompanyId: item.companyId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
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
      console.error("Erro ao buscar usuários:", err);
      throw err;
    }
  };

  const getById = async (userId: number) => {
    try {
      const response = await fetch(`${apiUrl}/User/GetUserById/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(t(data.mensagem));
        throw new Error(t(data.mensagem));
      }

      return { ...data, objeto: transformSingleApiData(data.objeto) };
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      throw err;
    }
  };

  const create = async (payload: Omit<User, "UserId" | "CreatedAt" | "UpdatedAt" | "IsActive" >) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase(payload);

      console.log('Payload enviado:', camelCasePayload);

      const response = await fetch(`${apiUrl}/User/AddUser`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(camelCasePayload)
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(t(data.mensagem));
        throw new Error(t(data.mensagem));
      }

      const newUser: User = transformSingleApiData(data.objeto);
      setUser((s) => [newUser, ...s]);
      notificationActions.showNotification(t('users.createSuccess') || 'Usuário criado com sucesso!', 'success');

      return data;
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
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
        notificationActions.showError(t(data.mensagem));
        throw new Error(t(data.mensagem));
      }

      const updatedUser: User = transformSingleApiData(data.objeto);
      setUser((s) => s.map((c) => c.UserId === id ? updatedUser : c));
      notificationActions.showNotification(t('users.updateSuccess') || 'Usuário atualizado com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
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
        notificationActions.showError(t(data.mensagem));
        throw new Error(t(data.mensagem));
      }

      const updatedUser: User = transformSingleApiData(data.objeto);
      setUser((s) => s.map((c) => c.UserId === id ? updatedUser : c));
      notificationActions.showNotification(t('users.updateStatusSuccess') || 'Status do usuário alterado com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao alterar status do usuário:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    user,
    activeUser,
    deactiveUser,
    query,
    setQuery,
    get,
    getById,
    create,
    update,
    softDelete,
  } as const;
};