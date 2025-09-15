import { useState, useEffect, useMemo } from "react";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { useAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import type { AccessibleFolder, FolderGroup, FolderGroupRequest, FolderHierarchy, FolderPermissions, MoveFolderRequest } from "./types";



export const useFolderManagement = () => {
  const [folderGroups, setFolderGroups] = useState<FolderGroup[]>([]);
  const [folderHierarchy, setFolderHierarchy] = useState<FolderHierarchy[]>([]);
  const [accessibleFolders, setAccessibleFolders] = useState<AccessibleFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useAuthContext();
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  // Filtros em memória
  const activeFolderGroups = useMemo(() => {
    return folderGroups.filter((fg) => fg.IsActive);
  }, [folderGroups]);

  const deactiveFolderGroups = useMemo(() => {
    return folderGroups.filter((fg) => !fg.IsActive);
  }, [folderGroups]);

  // Filtrar pastas acessíveis por query
  const filteredAccessibleFolders = useMemo(() => {
    if (!query) return accessibleFolders;
    const searchQuery = query.toLowerCase();
    return accessibleFolders.filter(folder => 
      folder.Name.toLowerCase().includes(searchQuery) ||
      folder.ValidatorName.toLowerCase().includes(searchQuery)
    );
  }, [accessibleFolders, query]);

  // Transformar dados da API
  const transformFolderGroupData = (apiData: any[]): FolderGroup[] => {
    return apiData.map(item => ({
      FolderGroupId: item.folderGroupId || item.FolderGroupId,
      FolderId: item.folderId || item.FolderId,
      GroupId: item.groupId || item.GroupId,
      CreatedAt: item.createdAt || item.CreatedAt,
      UpdatedAt: item.updatedAt || item.UpdatedAt,
      IsActive: item.isActive ?? item.IsActive ?? true,
      FolderName: item.folderName || item.FolderName,
      GroupName: item.groupName || item.GroupName
    }));
  };

  const transformSingleFolderGroupData = (item: any): FolderGroup => {
    return {
      FolderGroupId: item.folderGroupId || item.FolderGroupId,
      FolderId: item.folderId || item.FolderId,
      GroupId: item.groupId || item.GroupId,
      CreatedAt: item.createdAt || item.CreatedAt,
      UpdatedAt: item.updatedAt || item.UpdatedAt,
      IsActive: item.isActive ?? item.IsActive ?? true,
      FolderName: item.folderName || item.FolderName,
      GroupName: item.groupName || item.GroupName
    };
  };

  const transformHierarchyData = (apiData: any[]): FolderHierarchy[] => {
    return apiData.map(item => ({
      FolderId: item.folderId || item.FolderId,
      Name: item.name || item.Name,
      ParentFolderId: item.parentFolderId || item.ParentFolderId,
      Children: item.children ? transformHierarchyData(item.children) : [],
      Documents: item.documents || item.Documents || [],
      Level: item.level || item.Level || 0
    }));
  };

  const transformAccessibleFolderData = (apiData: any[]): AccessibleFolder[] => {
    return apiData.map(item => ({
      FolderId: item.folderId || item.FolderId,
      Name: item.name || item.Name,
      ParentFolderId: item.parentFolderId || item.ParentFolderId,
      ValidatorId: item.validatorId || item.ValidatorId,
      ValidatorName: item.validatorName || item.ValidatorName,
      DocumentCount: item.documentCount || item.DocumentCount || 0,
      PendingValidations: item.pendingValidations || item.PendingValidations || 0,
      PermissionLevel: item.permissionLevel || item.PermissionLevel || "Read"
    }));
  };

  // Buscar associações pasta-grupo por pasta
  const getFolderGroupsByFolderId = async (folderId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Folder/GetFolderGroupsByFolderId/${folderId}`, {
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

      return transformFolderGroupData(data.objeto || []);
    } catch (err) {
      console.error("Erro ao buscar grupos da pasta:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar associações pasta-grupo por grupo
  const getFolderGroupsByGroupId = async (groupId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Folder/GetFolderGroupsByGroupId/${groupId}`, {
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

      return transformFolderGroupData(data.objeto || []);
    } catch (err) {
      console.error("Erro ao buscar pastas do grupo:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar todas as associações pasta-grupo
  const getAllFolderGroups = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Folder/GetAllFolderGroups`, {
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

      const transformedData = transformFolderGroupData(data.objeto || []);
      setFolderGroups(transformedData);
      return transformedData;
    } catch (err) {
      console.error("Erro ao buscar associações pasta-grupo:", err);
      setFolderGroups([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Adicionar grupo à pasta
  const addGroupToFolder = async (folderId: number, groupId: number) => {
    setLoading(true);
    try {
      const payload: FolderGroupRequest = {
        FolderId: folderId,
        GroupId: groupId
      };

      const response = await fetch(`${apiUrl}/Folder/AddGroupToFolder`, {
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

      const newFolderGroup = transformSingleFolderGroupData(data.objeto);
      setFolderGroups((prev) => [...prev, newFolderGroup]);
      notificationActions.showNotification(t('folderManagement.groupAddedSuccess') || 'Grupo adicionado à pasta com sucesso!', 'success');
      return newFolderGroup;
    } catch (err) {
      console.error("Erro ao adicionar grupo à pasta:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remover grupo da pasta
  const removeGroupFromFolder = async (folderGroupId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Folder/RemoveGroupFromFolder/${folderGroupId}`, {
        method: "DELETE",
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

      setFolderGroups((prev) => prev.filter(fg => fg.FolderGroupId !== folderGroupId));
      notificationActions.showNotification(t('folderManagement.groupRemovedSuccess') || 'Grupo removido da pasta com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao remover grupo da pasta:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar associação pasta-grupo (toggle status)
  const toggleFolderGroupStatus = async (folderGroupId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Folder/ToggleFolderGroupStatus/${folderGroupId}`, {
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

      const updatedFolderGroup = transformSingleFolderGroupData(data.objeto);
      setFolderGroups((prev) => prev.map(fg => 
        fg.FolderGroupId === folderGroupId ? updatedFolderGroup : fg
      ));
      notificationActions.showNotification(t('folderManagement.statusUpdatedSuccess') || 'Status da associação atualizado com sucesso!', 'success');
      return updatedFolderGroup;
    } catch (err) {
      console.error("Erro ao atualizar status da associação:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mover pasta para novo pai
  const moveFolder = async (folderId: number, newParentFolderId: number | null) => {
    setLoading(true);
    try {
      const payload: MoveFolderRequest = {
        FolderId: folderId,
        ParentFolderId: newParentFolderId
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

      notificationActions.showNotification(t('folderManagement.folderMovedSuccess') || 'Pasta movida com sucesso!', 'success');
      
      // Recarregar hierarquia após mover
      await getFolderHierarchy();
      
      return data;
    } catch (err) {
      console.error("Erro ao mover pasta:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar hierarquia completa de pastas
  const getFolderHierarchy = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Folder/GetFolderHierarchy`, {
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

      const hierarchyData = transformHierarchyData(data.objeto || []);
      setFolderHierarchy(hierarchyData);
      return hierarchyData;
    } catch (err) {
      console.error("Erro ao buscar hierarquia de pastas:", err);
      setFolderHierarchy([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verificar permissões do usuário na pasta
  const checkFolderPermissions = async (folderId: number): Promise<FolderPermissions> => {
    try {
      const response = await fetch(`${apiUrl}/Folder/CheckFolderPermissions/${folderId}`, {
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

      return {
        CanRead: data.objeto.canRead ?? true,
        CanWrite: data.objeto.canWrite ?? false,
        CanDelete: data.objeto.canDelete ?? false,
        CanValidate: data.objeto.canValidate ?? false,
        IsValidator: data.objeto.isValidator ?? false,
        IsOwner: data.objeto.isOwner ?? false
      };
    } catch (err) {
      console.error("Erro ao verificar permissões da pasta:", err);
      throw err;
    }
  };

  // Buscar pastas acessíveis pelo usuário
  const getAccessibleFolders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Folder/GetAccessibleFolders`, {
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

      const accessibleData = transformAccessibleFolderData(data.objeto || []);
      setAccessibleFolders(accessibleData);
      return accessibleData;
    } catch (err) {
      console.error("Erro ao buscar pastas acessíveis:", err);
      setAccessibleFolders([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar pasta por ID com permissões
  const getFolderWithPermissions = async (folderId: number) => {
    try {
      const [folderResponse, permissionsResponse] = await Promise.all([
        fetch(`${apiUrl}/Folder/GetFolderById/${folderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
        checkFolderPermissions(folderId)
      ]);

      const folderData: ApiResponse = await folderResponse.json();

      if (folderData.erro) {
        notificationActions.showError(folderData.mensagem);
        throw new Error(folderData.mensagem);
      }

      return {
        folder: folderData.objeto,
        permissions: permissionsResponse
      };
    } catch (err) {
      console.error("Erro ao buscar pasta com permissões:", err);
      throw err;
    }
  };

  // Buscar grupos disponíveis para uma pasta
  const getAvailableGroupsForFolder = async (folderId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Folder/GetAvailableGroupsForFolder/${folderId}`, {
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

      return data.objeto || [];
    } catch (err) {
      console.error("Erro ao buscar grupos disponíveis:", err);
      throw err;
    }
  };

  // Recarregar todos os dados
  const refreshAll = async () => {
    try {
      await Promise.all([
        getAllFolderGroups(),
        getFolderHierarchy(),
        getAccessibleFolders()
      ]);
    } catch (err) {
      console.error("Erro ao recarregar dados:", err);
    }
  };

  // Carregar dados ao inicializar
  useEffect(() => {
    if (token) {
      refreshAll();
    }
  }, [token]);

  return {
    folderGroups,
    activeFolderGroups,
    deactiveFolderGroups,
    folderHierarchy,
    accessibleFolders,
    filteredAccessibleFolders,
    loading,
    query,
    setQuery,
    // Métodos de associação pasta-grupo
    getFolderGroupsByFolderId,
    getFolderGroupsByGroupId,
    getAllFolderGroups,
    addGroupToFolder,
    removeGroupFromFolder,
    toggleFolderGroupStatus,
    // Métodos de hierarquia e movimento
    moveFolder,
    getFolderHierarchy,
    // Métodos de permissões e acesso
    checkFolderPermissions,
    getAccessibleFolders,
    getFolderWithPermissions,
    getAvailableGroupsForFolder,
    // Utilitários
    refreshAll,
  } as const;
};