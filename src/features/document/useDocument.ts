import { useState, useMemo, useEffect } from "react";
import type { Document } from "./types";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { t } from "i18next";
import { useAuthContext } from "../../context/AuthContext";


export const useDocument = () => {
  const [document, setDocument] = useState<Document[]>([]);
  const [userValidatorDocuments, setUserValidatorDocuments] = useState<Document[]>([]);
  const [userDocuments, setUserDocuments] = useState<Document[]>([]);
  const [query, setQuery] = useState("");
  const { user } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";


  const activeDocument = useMemo(() => {
    return document.filter((c) => c.IsActive);
  }, [document]);

  const deactiveDocument = useMemo(() => {
    return document.filter((c) => !c.IsActive);
  }, [document, query]);




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
  const GetDocumentValidationById = async (documentId: number) => {
    try {
      const response = await fetch(`${apiUrl}/DocumentValidation/GetDocumentValidationById/${documentId}`, {
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
      const response = await fetch(`${apiUrl}/Document/ToogleStatusDocument/${id}`, {
        
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


  const getValidationsByDocumentId = async (documentId: number) => {
    try {
      const response = await fetch(`${apiUrl}/DocumentValidation/GetDocumentValidationById/${documentId}`, {
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
      console.error("Erro ao buscar validações:", err);
      throw err;
    }
  };

  const getDocumentValidatorByValidator = async () => {
    try {
      const response = await fetch(`${apiUrl}/DocumentValidation/GetListDocumentValidationByValidator`, {
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

      
      setUserValidatorDocuments(data.objeto)
      return data;

    } catch (err) {
      console.error("Erro ao buscar validações:", err);
      throw err;
    }
  };

  const getDocumentToEdit = async () => {
    try {
      const response = await fetch(`${apiUrl}/DocumentValidation/GetListDocumentValidationToEdit`, {
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

      setUserDocuments(data.objeto)
      return data;

    } catch (err) {
      console.error("Erro ao buscar validações:", err);
      throw err;
    }
  };

  const updateValidationStatus = async (documentId: number, isValid: boolean | null, comment?: string) => {
    try {
      let status = null
      if (isValid) {
        status = 1
      }
      if (!isValid) {
        status = 2
      }

      const payload = {
        documentId,
        status: status, // Permitir null para revalidação
        comment: comment || ""
      };

      const response = await fetch(`${apiUrl}/DocumentValidation/UpdateDocumentValidationStatus`, {
        method: "PUT",
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

      // Atualizar o documento local com o novo status de validação
      setDocument((s) => s.map((doc) =>
        doc.DocumentId === documentId
          ? { ...doc, isValid }
          : doc
      ));

      const successMessage = isValid === null
        ? t('documents.resetValidationSuccess')
        : t('documents.validationUpdateSuccess');

      notificationActions.showNotification(successMessage, 'success');
      return data;

    } catch (err) {
      console.error("Erro ao atualizar status de validação:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      get()
      getDocumentToEdit()
      getDocumentValidatorByValidator()
    };
  }, [token]);

  return {
    document,
    activeDocument,
    deactiveDocument,
    userDocuments,
    userValidatorDocuments,
    GetDocumentValidationById,
    query,
    setQuery,
    create,
    update,
    softDelete,
    getById,
    getValidationsByDocumentId,
    updateValidationStatus
  } as const;
};