import { useState, useMemo, useEffect } from "react";
import type { Group } from "./types";
import { t } from "i18next";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";

export const useGroup = () => {
  const [group, setGroup] = useState<Group[]>([]);
  const [query, setQuery] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const activeGroup = useMemo(() => {
    return group.filter((c) => c.IsActive);
  }, [group]);

  const deactiveGroup = useMemo(() => {
    return group.filter((c) => !c.IsActive);
  }, [group]);

  const transformPayloadToCamelCase = (payload: any) => {
    return {
      name: payload.Name,
      description: payload.Description,
      userId: payload.UserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: payload.IsActive ?? true
    };
  };

  const transformApiDataToPascalCase = (apiData: any[]): Group[] => {
    return apiData.map(item => ({
      GroupId: item.groupId,
      Name: item.name,
      Description: item.description,
      UserId: item.userId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    }));
  };

  const transformSingleApiData = (item: any): Group => {
    return {
      GroupId: item.groupId,
      Name: item.name,
      Description: item.description,
      UserId: item.userId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    };
  };

  const get = async () => {
    try {
      const response = await fetch(`${apiUrl}/Group/GetListGroup`, {
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

      const transformedGroups = transformApiDataToPascalCase(data.objeto);
      setGroup(transformedGroups);
      return data;
    } catch (err) {
      console.error("Erro ao buscar grupos:", err);
      throw err;
    }
  };

  const getById = async (groupId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Group/GetGroupById/${groupId}`, {
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
      console.error("Erro ao buscar grupo:", err);
      throw err;
    }
  };

  const create = async (payload: Omit<Group, "GroupId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "CompanyId">) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase(payload);

      console.log('Payload enviado:', camelCasePayload);

      const response = await fetch(`${apiUrl}/Group/AddGroup`, {
        method: 'POST',
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

      const newGroup: Group = transformSingleApiData(data.objeto);
      setGroup((s) => [newGroup, ...s]);
      notificationActions.showNotification(t('groups.createSuccess') || 'Grupo criado com sucesso!', 'success');

      return data;
    } catch (err) {
      console.error("Erro ao criar grupo:", err);
      throw err;
    }
  };

  const update = async (id: number, updates: Partial<Group>) => {
    try {
      const camelCasePayload = {
        groupId: id,
        ...transformPayloadToCamelCase(updates)
      };

      const response = await fetch(`${apiUrl}/Group/UpdateGroup`, {
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

      const updatedGroup: Group = transformSingleApiData(data.objeto);
      setGroup((s) => s.map((c) => c.GroupId === id ? updatedGroup : c));
      notificationActions.showNotification(t('groups.updateSuccess') || 'Grupo atualizado com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao atualizar grupo:", err);
      throw err;
    }
  };

  const softDelete = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/Group/ToggleStatusGroup/${id}`, {
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

      const updatedGroup: Group = transformSingleApiData(data.objeto);
      setGroup((s) => s.map((c) => c.GroupId === id ? updatedGroup : c));
      notificationActions.showNotification(t('groups.updateStatusSuccess') || 'Status do grupo alterado com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao alterar status do grupo:", err);
      throw err;
    }
  };

  // Adicionar após a função softDelete (linha ~165):

  const getUsersByGroup = async (groupId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Group/GetListUserByGroup/${groupId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      return transformApiDataToPascalCase(data.objeto);
    } catch (err) {
      console.error("Erro ao buscar usuários do grupo:", err);
      throw err;
    }
  };

  const addUserToGroup = async (userId: number, groupId: number) => {
    try {
      const response = await fetch(`${apiUrl}/User/AddUserXGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          groupId: groupId
        })
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      notificationActions.showNotification(t('groups.addUserSuccess'), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao adicionar usuário ao grupo:", err);
      throw err;
    }
  };

  const removeUserFromGroup = async (userId: number, groupId: number) => {
    try {
      const response = await fetch(`${apiUrl}/User/DeleteUserXGroup`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          groupId: groupId
        })
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      notificationActions.showNotification(t('groups.removeUserSuccess'), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao remover usuário do grupo:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    group,
    activeGroup,
    deactiveGroup,
    query,
    setQuery,
    get,
    getById,
    create,
    update,
    softDelete,
    addUserToGroup,
    removeUserFromGroup,
    getUsersByGroup
  } as const;
};