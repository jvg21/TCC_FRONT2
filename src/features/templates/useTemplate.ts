import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { notificationActions } from "../notifications/useNotification";
import { useTypedTranslation } from "../../context/LanguageContext";
import type { Template } from "./types";
import type { ApiResponse } from "../../types";
import { getCookie } from "../../utils/Cookies";

const apiUrl = import.meta.env.VITE_API_URL;

export const useTemplate = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const token = getCookie('authToken') || "";
  const { t } = useTypedTranslation();

  const activeTemplate = templates.filter(template => template.IsActive);
  const deactiveTemplate = templates.filter(template => !template.IsActive);

  const transformPayloadToCamelCase = (payload: any) => {
    return {
      templateId: payload.TemplateId || null,
      name: payload.Name,
      content: payload.Content
    };
  };

  const transformApiDataToPascalCase = (apiData: any[]): Template[] => {
    return apiData.map(item => ({
      TemplateId: item.templateId,
      Name: item.name,
      Content: item.content,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    }));
  };

  const transformSingleApiData = (item: any): Template => {
    return {
      TemplateId: item.templateId,
      Name: item.name,
      Content: item.content,
      IsActive: item.isActive,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt
    };
  };

  const get = async () => {
    try {
      const response = await fetch(`${apiUrl}/Template/GetListTemplate`, {
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

      const transformedTemplates = transformApiDataToPascalCase(data.objeto);
      setTemplates(transformedTemplates);
      return data;
    } catch (err) {
      console.error("Erro ao buscar templates:", err);
      throw err;
    }
  };

  const getById = async (templateId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Template/GetTemplateById/${templateId}`, {
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
      console.error("Erro ao buscar template:", err);
      throw err;
    }
  };

  const create = async (payload: Omit<Template, "TemplateId" | "CreatedAt" | "UpdatedAt" | "IsActive">) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase(payload);

      console.log('Payload enviado:', camelCasePayload);

      const response = await fetch(`${apiUrl}/Template/AddTemplate`, {
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

      const newTemplate: Template = transformSingleApiData(data.objeto);
      setTemplates((s) => [newTemplate, ...s]);
      notificationActions.showNotification(t('templates.createSuccess'), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao criar template:", err);
      throw err;
    }
  };

  const update = async (templateId: number, payload: Omit<Template, "TemplateId" | "CreatedAt" | "UpdatedAt" | "IsActive">) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase({ ...payload, TemplateId: templateId });

      const response = await fetch(`${apiUrl}/Template/UpdateTemplate`, {
        method: 'PUT',
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

      const updatedTemplate: Template = transformSingleApiData(data.objeto);
      setTemplates((s) => s.map(template => 
        template.TemplateId === templateId ? updatedTemplate : template
      ));
      notificationActions.showNotification(t('templates.updateSuccess'), 'success');
      return data;
    } catch (err) {
      console.error("Erro ao atualizar template:", err);
      throw err;
    }
  };

  const softDelete = async (templateId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Template/ToggleStatusTemplate/${templateId}`, {
        method: 'PUT',
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

      const updatedTemplate: Template = transformSingleApiData(data.objeto);
      setTemplates((s) => s.map(template => 
        template.TemplateId === templateId ? updatedTemplate : template
      ));
      notificationActions.showNotification(t('templates.updateStatusSuccess') || 'Status do template alterado com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao alterar status do template:", err);
      throw err;
    }
  };

  const copyTemplate = async (templateId: number) => {
    try {
      const templateToCopy = templates.find(t => t.TemplateId === templateId);
      if (!templateToCopy) {
        notificationActions.showError('Template não encontrado');
        return;
      }

      const newTemplate = {
        Name: `${templateToCopy.Name} - Cópia`,
        Content: templateToCopy.Content,
      };

      await create(newTemplate);
      notificationActions.showNotification(t('templates.copySuccess') || 'Template copiado com sucesso!', 'success');
    } catch (err) {
      console.error("Erro ao copiar template:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      get();
    }
  }, [token]);

  return {
    templates,
    activeTemplate,
    deactiveTemplate,
    get,
    getById,
    create,
    update,
    softDelete,
    copyTemplate
  };
};