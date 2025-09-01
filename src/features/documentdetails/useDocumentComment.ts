import { useState, useMemo, useEffect } from "react";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { t } from "i18next";
import { useAuthContext } from "../../context/AuthContext";
import type { Comment } from "./types";


export const useDocumentComment = () => {
  const [documentComment, setDocumentComment] = useState<Comment[]>([]);
  const [query, setQuery] = useState("");
  const { user } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";


  const activeDocumentComment = useMemo(() => {
    return documentComment;
  }, [document]);

  const transformPayloadToCamelCase = (payload: any) => {
    return {
      title: payload.Title,
      content: payload.Content,
      folderId: payload.FolderId || null,
      userId: user?.UserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
  };

  const transformApiDataToPascalCase = (apiData: any[]): Document[] => {
    return apiData.map(item => ({
      DocumentId: item.documentId,
      Title: item.title,
      Content: item.content,
      FolderId: item.folderId,
      UserId: item.userId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    }));
  };

  const transformSingleApiData = (item: any): Document => {
    return {
      DocumentId: item.documentId,
      Title: item.title,
      Content: item.content,
      FolderId: item.folderId,
      UserId: item.userId,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    };
  };


  const get = async () => {
    try {
      const response = await fetch(`${apiUrl}/Document/GetListDocument`, {
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

      const transformedDocuments = transformApiDataToPascalCase(data.objeto);
      setDocument(transformedDocuments);
      return data;
    } catch (err) {
      console.error("Erro ao buscar documentos:", err);
      throw err;
    }

  };
  const getById = async (documentId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Document/GetDocumentById/${documentId}`, {
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
      console.error("Erro ao buscar documento:", err);
      throw err;
    }
  };

  const create = async (payload: Omit<Document, "CreatedAt" | "UpdatedAt" | "IsActive" | "UserId">) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase(payload);
      // console.log('Payload enviado:', camelCasePayload);

      const response = await fetch(`${apiUrl}/Document/AddDocument`, {
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

      const newDocument: Document = transformSingleApiData(data.objeto);
      setDocument((s) => [newDocument, ...s]);
      notificationActions.showNotification(t('documents.createSuccess'), 'success');

      return data;
    } catch (err) {
      console.error("Erro ao criar documento:", err);
      throw err;
    }
  };

  const update = async (id: number, updates: Partial<Document>) => {
    try {
      const camelCasePayload = {
        documentId: id,
        ...transformPayloadToCamelCase(updates)
      };

      const response = await fetch(`${apiUrl}/Document/UpdateDocument`, {
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

      const updatedDocument: Document = transformSingleApiData(data.objeto);

      setDocument((s) => s.map((c) => c.DocumentId === id ? updatedDocument : c));
      notificationActions.showNotification(t('documents.updateSuccess'), 'success');
      return data;

    } catch (err) {
      console.error("Erro ao atualizar documento:", err);
      throw err;
    }
  };


  const softDelete = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/Document/ToggleStatusDocument/${id}`, {
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

      const updatedDocument: Document = transformSingleApiData(data.objeto);
      setDocument((s) => s.map((c) => c.DocumentId === id ? updatedDocument : c));

      notificationActions.showNotification(t('documents.updateStatusSuccess'), 'success');

      return data;
    } catch (err) {
      console.error("Erro ao alterar status do documento:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    document,
    activeDocumentComment,
    query,
    setQuery,
    create,
    update,
    softDelete,
    getById,
  } as const;
};