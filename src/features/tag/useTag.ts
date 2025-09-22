import { useState, useMemo, useEffect } from "react";
import type { Tag, DocumentXTag } from "./types";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { useAuthContext } from "../../context/AuthContext";
import { t } from "i18next";

export const useTag = () => {
  const [tag, setTag] = useState<Tag[]>([]);
  const [query, setQuery] = useState("");
  const { user: company } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const activeTag = useMemo(() => {
    return tag.filter((t) => t.IsActive);
  }, [tag]);

  const deactiveTag = useMemo(() => {
    return tag.filter((t) => !t.IsActive);
  }, [tag]);

  const transformPayloadToCamelCase = (payload: any) => {
    return {
      tagId: payload.TagId,
      name: payload.Name,
      userId: payload.UserId || company?.UserId,
      isActive: payload.IsActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const transformApiDataToPascalCase = (apiData: any[]): Tag[] => {
    return apiData.map(item => ({
      TagId: item.tagId,
      Name: item.name,
      UserId: item.userId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    }));
  };

  const transformSingleApiData = (item: any): Tag => {
    return {
      TagId: item.tagId,
      Name: item.name,
      UserId: item.userId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    };
  };

  const get = async () => {
    try {
      const response = await fetch(`${apiUrl}/Tag/GetListTag`, {
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

      const transformedTags = transformApiDataToPascalCase(data.objeto);
      setTag(transformedTags);
      return data;
    } catch (err) {
      console.error("Erro ao buscar tags:", err);
      throw err;
    }
  };

  const getById = async (tagId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Tag/GetTagById/${tagId}`, {
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
      console.error("Erro ao buscar tag:", err);
      throw err;
    }
  };

  const create = async (payload: Omit<Tag, "TagId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "UserId">) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase(payload);

      console.log('Payload enviado:', camelCasePayload);

      const response = await fetch(`${apiUrl}/Tag/AddTag`, {
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

      const newTag: Tag = transformSingleApiData(data.objeto);
      setTag((s) => [newTag, ...s]);
      notificationActions.showNotification(t('tags.createSuccess') || 'Tag criada com sucesso!', 'success');

      return data;
    } catch (err) {
      console.error("Erro ao criar tag:", err);
      throw err;
    }
  };

  const update = async (id: number, updates: Partial<Tag>) => {
    try {
      const camelCasePayload = {
        tagId: id,
        ...transformPayloadToCamelCase(updates)
      };

      const response = await fetch(`${apiUrl}/Tag/UpdateTag`, {
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

      const updatedTag: Tag = transformSingleApiData(data.objeto);
      setTag((s) => s.map((t) => t.TagId === id ? updatedTag : t));
      notificationActions.showNotification(t('tags.updateSuccess') || 'Tag atualizada com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao atualizar tag:", err);
      throw err;
    }
  };

  const softDelete = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/Tag/ToogleStatusTag/${id}`, {
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

      const updatedTag: Tag = transformSingleApiData(data.objeto);
      setTag((s) => s.map((t) => t.TagId === id ? updatedTag : t));
      notificationActions.showNotification(t('tags.updateStatusSuccess') || 'Status da tag alterado com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao alterar status da tag:", err);
      throw err;
    }
  };

  const getDocumentsByTag = async (tagId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Tag/GetDocumentXTagByTagId?idTag=${tagId}`, {
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
      console.error("Erro ao buscar documentos da tag:", err);
      throw err;
    }
  };

  const getTagsByDocument = async (documentId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Tag/GetDocumentXTagByDocumentId?documentId=${documentId}`, {
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
      console.error("Erro ao buscar tags do documento:", err);
      throw err;
    }
  };

  const addDocumentToTag = async (documentId: number, tagId: number) => {
    try {
      const payload = {
        documentId,
        tagId
      };

      const response = await fetch(`${apiUrl}/Tag/AddDocumentXTag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      notificationActions.showNotification(t('tags.addDocumentSuccess') || 'Documento vinculado à tag com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao adicionar documento à tag:", err);
      throw err;
    }
  };

  const removeDocumentFromTag = async (documentId: number, tagId: number) => {
    try {
      const payload = {
        documentId,
        tagId
      };

      const response = await fetch(`${apiUrl}/Tag/DeleteDocumentXTag`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      notificationActions.showNotification(t('tags.removeDocumentSuccess') || 'Documento removido da tag com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao remover documento da tag:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    tag,
    activeTag,
    deactiveTag,
    query,
    setQuery,
    get,
    getById,
    create,
    update,
    softDelete,
    getDocumentsByTag,
    getTagsByDocument,
    addDocumentToTag,
    removeDocumentFromTag,
  } as const;
};