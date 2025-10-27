import { useState, useEffect } from "react";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { useAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

// Types baseados nos DTOs da API
export interface AIRequest {
  DocumentId: number;
  Model: number;
}

export interface AIResponse {
  Content: string;
}

export interface OpenAIConfig {
  OpenAIConfigId?: number;
  ApiKey: string;
}

export interface OpenAIConfigResponse {
  OpenAIConfigId: number;
  ApiKey: string;
  CompanyId: number;
  CreatedAt: string;
  UpdatedAt: string;
  IsActive: boolean;
}

export const useAI = () => {
  const [openAIConfig, setOpenAIConfig] = useState<OpenAIConfigResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  // Transformar dados da API seguindo padrão do useUser
  const transformConfigData = (item: any): OpenAIConfigResponse => {
    return {
      OpenAIConfigId: item.openAIConfigId || item.OpenAIConfigId,
      ApiKey: item.apiKey || item.ApiKey,
      CompanyId: item.companyId || item.CompanyId,
      CreatedAt: item.createdAt || item.CreatedAt,
      UpdatedAt: item.updatedAt || item.UpdatedAt,
      IsActive: item.isActive ?? item.IsActive ?? true
    };
  };

  // Gerar resumo de documento usando OpenAI
  const generateSummary = async (documentId: number, modelType: number = 1): Promise<AIResponse> => {
    setLoading(true);
    try {
      const payload: AIRequest = {
        DocumentId: documentId,
        Model: modelType
      };

      const response = await fetch(`${apiUrl}/AI/GenerateSummary`, {
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

      notificationActions.showNotification(t('ai.summarySuccess'), 'success');
      return data.objeto;
    } catch (err) {
      console.error("Erro ao gerar resumo:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar configuração OpenAI da empresa
  const getOpenAIConfig = async () => {
    try {
      const response = await fetch(`${apiUrl}/AI/GetOpenAIConfigByCompany`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        // Se não existe configuração, não mostrar erro
        if (data.mensagem !== "configNotFound") {
          // notificationActions.showError(data.mensagem);
        }
        setOpenAIConfig(null);
        return null;
      }

      const config = transformConfigData(data.objeto);
      setOpenAIConfig(config);
      return config;
    } catch (err) {
      console.error("Erro ao buscar configuração OpenAI:", err);
      setOpenAIConfig(null);
      return null;
    }
  };

  const addOpenAIConfig = async (apiKey: string) => {
    setLoading(true);
    try {
      const payload: OpenAIConfig = {
        ApiKey: apiKey
      };

      const response = await fetch(`${apiUrl}/AI/AddOpenAIConfig`, {
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

      const newConfig = transformConfigData(data.objeto);
      setOpenAIConfig(newConfig);
      notificationActions.showNotification(t('ai.configAddSuccess'), 'success');
      return newConfig;
    } catch (err) {
      console.error("Erro ao adicionar configuração OpenAI:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar configuração OpenAI
  const updateOpenAIConfig = async (configId: number, apiKey: string) => {
    setLoading(true);
    try {
      const payload: OpenAIConfig = {
        OpenAIConfigId: configId,
        ApiKey: apiKey
      };

      const response = await fetch(`${apiUrl}/AI/UpdateOpenAIConfig`, {
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

      const updatedConfig = transformConfigData(data.objeto);
      setOpenAIConfig(updatedConfig);
      notificationActions.showNotification(t('ai.configUpdateSuccess') || 'Configuração OpenAI atualizada com sucesso!', 'success');
      return updatedConfig;
    } catch (err) {
      console.error("Erro ao atualizar configuração OpenAI:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateEmbedding = async (text: string) => {
    try {
      const response = await fetch(`${apiUrl}/Embedding/GetEmbedding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(text)
      });

      const data = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem || "Error generating embedding");
        throw new Error(data.mensagem);
      }

      // A API retorna o embedding como um array de floats
      return data.objeto;
    } catch (error) {
      console.error("Error generating embedding:", error);
      notificationActions.showError("Failed to generate embedding");
      return null;
    }
  };


  // Verificar se OpenAI está configurado
  const isOpenAIConfigured = (): boolean => {
    return !!(openAIConfig && openAIConfig.ApiKey && openAIConfig.IsActive);
  };

  // Obter dados mascarados da API Key (para exibição)
  const getMaskedApiKey = (): string => {
    if (!openAIConfig || !openAIConfig.ApiKey) return '';
    const key = openAIConfig.ApiKey;
    if (key.length <= 10) return key;
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  };

  // Validar formato da API Key OpenAI
  const validateApiKey = (apiKey: string): boolean => {
    // Formato esperado: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const openAIKeyPattern = /^sk-[a-zA-Z0-9]{48}$/;
    return openAIKeyPattern.test(apiKey);
  };

  useEffect(() => {
    if (token) {
      getOpenAIConfig();
    }
  }, [token]);

  return {
    openAIConfig,
    loading,

    generateSummary,
    getOpenAIConfig,
    addOpenAIConfig,
    updateOpenAIConfig,

    isOpenAIConfigured,
    getMaskedApiKey,
    validateApiKey,
    generateEmbedding
  } as const;
};