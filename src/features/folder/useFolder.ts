import { useState, useMemo, useEffect } from "react";
import type { Folder } from "./types";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { t } from "i18next";
import { useAuthContext } from "../../context/AuthContext";

export const useFolder = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [query, setQuery] = useState("");
  const { user } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const activeFolder = useMemo(() => {
    return folders.filter((f) => f.IsActive);
  }, [folders]);

  const deactiveFolder = useMemo(() => {
    return folders.filter((f) => !f.IsActive);
  }, [folders]);

  const transformApiDataToPascalCase = (apiData: any[]): Folder[] => {
    return apiData.map(item => ({
      FolderId: item.folderId,
      Name: item.name,
      ParentFolderId: item.parentFolderId,
      UserId: item.userId,
      ValidatorId: item.validatorId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt,
      Documents: item.documents || []
    }));
  };

  const get = async () => {
    try {
      const response = await fetch(`${apiUrl}/Folder/GetListFolder`, {
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
      const transformedFolders = transformApiDataToPascalCase(data.objeto);
      setFolders(transformedFolders);
      return data;
    } catch (err) {
      console.error("Erro ao buscar pastas:", err);
      throw err;
    }
  };

  const transformSingleApiData = (item: any): Folder => ({
    FolderId: item.folderId,
    Name: item.name,
    ParentFolderId: item.parentFolderId,
    UserId: item.userId,
    ValidatorId: item.validatorId,
    IsActive: item.isActive,
    CreatedAt: item.createdAt,
    UpdatedAt: item.updatedAt,
    Documents: item.documents || []
  });

  const transformPayloadToCamelCase = (payload: Partial<Folder>) => ({
    name: payload.Name,
    parentFolderId: payload.ParentFolderId || null,
    validatorId: payload.ValidatorId,
    userId: user?.UserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: payload.IsActive || true
  });
  const create = async (payload: Omit<Folder, "FolderId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "UserId" | "Documents">) => {
    try {
      console.log(payload)
      const camelCasePayload = transformPayloadToCamelCase(payload);

      console.log("Dados enviados para criar pasta:", camelCasePayload);

      const response = await fetch(`${apiUrl}/Folder/AddFolder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(camelCasePayload),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const newFolder: Folder = transformSingleApiData(data.objeto);
      setFolders((f) => [newFolder, ...f]);
      notificationActions.showNotification(t("folders.createSuccess"), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao criar pasta:", err);
      throw err;
    }
  };
  const update = async (id: number, payload: Partial<Folder>) => {
    try {
      const camelCasePayload = {
        folderId: id,
        ...transformPayloadToCamelCase(payload)
      };

      const response = await fetch(`${apiUrl}/Folder/UpdateFolder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(camelCasePayload),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const updatedFolder: Folder = transformSingleApiData(data.objeto);
      setFolders((f) => f.map((f) => f.FolderId === id ? updatedFolder : f));
      notificationActions.showNotification(t("folders.updateSuccess"), 'success');
      return data
    } catch (err) {
      console.error("Erro ao atualizar pasta:", err);
      throw err;
    }
  };
  const softDelete = async (folderId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Folder/ToogleStatusFolder/${folderId}`, {
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

      notificationActions.showNotification(t("folders.statusToggleSuccess"), 'success');
      await get();
      return { ...data, objeto: transformSingleApiData(data.objeto) };
    } catch (err) {
      console.error("Erro ao alterar status da pasta:", err);
      throw err;
    }
  };

  const moveFolder = async (folderId: number, newParentFolderId: number | null) => {
    try {
      const payload = {
        folderId: folderId,
        parentFolderId: newParentFolderId
      };

      const response = await fetch(`${apiUrl}/Folder/MoveFolder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      notificationActions.showNotification(t("folders.moveSuccess"), 'success');
      await get();
      return { ...data, objeto: transformSingleApiData(data.objeto) };
    } catch (err) {
      console.error("Erro ao mover pasta:", err);
      throw err;
    }
  };

  
  const addFolderXGroup = async (folderId: number, groupId: number) => {
    try {
      const payload = {
        folderId: folderId,
        groupId: groupId
      };

      const response = await fetch(`${apiUrl}/Folder/AddFolderXGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      notificationActions.showNotification(t("folders.groupAddedSuccess"), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao adicionar grupo à pasta:", err);
      throw err;
    }
  };

  const deleteFolderXGroup = async (folderId: number, groupId: number) => {
    try {
      const payload = {
        folderId: folderId,
        groupId: groupId
      };

      const response = await fetch(`${apiUrl}/Folder/DeleteFolderXGroup`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      notificationActions.showNotification(t("folders.groupRemovedSuccess"), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao remover grupo da pasta:", err);
      throw err;
    }
  };

  const getListFolderXGroupByFolder = async (folderId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Folder/GetListFolderXGroupByFolder/${folderId}`, {
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

      return data;
    } catch (err) {
      console.error("Erro ao buscar grupos da pasta:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    folders,
    activeFolder,
    deactiveFolder,
    query,
    setQuery,
    get,
    create,
    update,
    softDelete,
    moveFolder,
    addFolderXGroup,
    deleteFolderXGroup,
    getListFolderXGroupByFolder
  };
};