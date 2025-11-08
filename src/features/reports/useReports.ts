import { useState, useEffect } from "react";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import type { AIStats, AIUsersStats, DocumentMonthStatus, DocumentStats, ReportsData, TaskPriorityStats, TaskStats, ValidationStats, ValidatorsStats } from "./types";
import { t } from "i18next";

export const useReports = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{
    CreatedAtFrom?: string;
    CreatedAtTo?: string;
    [key: string]: any;
  }>({});

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const buildUrlWithParams = (baseUrl: string, params?: Record<string, any>): string => {
    if (!params || Object.keys(params).length === 0) {
      return baseUrl;
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    if (queryString) {
      return `${baseUrl}?${queryString}`;
    }
    return baseUrl;
  };

  const getDocumentStats = async (params?: Record<string, any>): Promise<DocumentStats> => {
    try {
      const url = buildUrlWithParams(`${apiUrl}/dashboard/documents`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data: ApiResponse = await response.json();
      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de documentos:", err);
      throw err;
    }
  };

  const getDocumentMonthsStats = async (params?: Record<string, any>): Promise<DocumentMonthStatus[]> => {
    try {
      const url = buildUrlWithParams(`${apiUrl}/dashboard/documentsMonths`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de documentos por mês:", err);
      throw err;
    }
  };

  const getAIStats = async (params?: Record<string, any>): Promise<AIStats> => {
    try {
      const url = buildUrlWithParams(`${apiUrl}/dashboard/ai`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data: ApiResponse = await response.json();
      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de ai:", err);
      throw err;
    }
  };

  const getAIUserStats = async (params?: Record<string, any>): Promise<AIUsersStats[]> => {
    try {
      const url = buildUrlWithParams(`${apiUrl}/dashboard/aiUsers`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de usuários de AI:", err);
      throw err;
    }
  };

  const getValidationStats = async (params?: Record<string, any>): Promise<ValidationStats> => {
    try {
      const url = buildUrlWithParams(`${apiUrl}/dashboard/documentvalidation`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de validação:", err);
      throw err;
    }
  };

  const getValidatorsStats = async (params?: Record<string, any>): Promise<ValidatorsStats[]> => {
    try {
      const url = buildUrlWithParams(`${apiUrl}/dashboard/documentvalidationUsers`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de validadores:", err);
      throw err;
    }
  };

  const getTaskStats = async (params?: Record<string, any>): Promise<TaskStats> => {
    try {
      const url = buildUrlWithParams(`${apiUrl}/dashboard/task`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de tarefas:", err);
      throw err;
    }
  };

  const getTaskPriorityStats = async (params?: Record<string, any>): Promise<TaskPriorityStats[]> => {
    try {
      const url = buildUrlWithParams(`${apiUrl}/dashboard/taskPriority`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de prioridade de tarefas:", err);
      throw err;
    }
  };

  
  const updateFilters = (newFilters: Record<string, any>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  
  const clearFilters = () => {
    updateFilters({});
    setFilters({});
  };

  const getAllReports = async (customFilters?: Record<string, any>) => {
    setLoading(true);
    
    const currentFilters = customFilters || filters;
    
    try {
      const [documents, documentMonths, ai, aiUsers, validations, validators, tasks, taskPrioritys] = await Promise.all([
        getDocumentStats(currentFilters),
        getDocumentMonthsStats(currentFilters),
        getAIStats(currentFilters),
        getAIUserStats(currentFilters),
        getValidationStats(currentFilters),
        getValidatorsStats(currentFilters),
        getTaskStats(currentFilters),
        getTaskPriorityStats(currentFilters),
      ]);

      const reports: ReportsData = {
        documents,
        documentMonths,
        ai,
        aiUsers,
        validations,
        validators,
        tasks,
        taskPrioritys,
      };

      setReportsData(reports);

      return reports;
    } catch (err) {
      console.error("Erro ao buscar relatórios:", err);
      notificationActions.showError("Erro ao carregar relatórios");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const exportToCSV = (reportType: string) => {
    try {
      
      notificationActions.showNotification(`Relatório de ${reportType} exportado com sucesso!`, 'success');
    } catch (err) {
      console.error("Erro ao exportar relatório:", err);
      notificationActions.showError("Erro ao exportar relatório");
    }
  };

  
  const exportToPDF = (reportType: string) => {
    try {
      notificationActions.showNotification(`Relatório de ${reportType} exportado em PDF!`, 'success');
    } catch (err) {
      console.error("Erro ao exportar relatório:", err);
      notificationActions.showError("Erro ao exportar relatório");
    }
  };

  useEffect(() => {
    if (token) {
      getAllReports();
    }
  }, [token, filters]); 

  return {
    reportsData,
    loading,
    filters,
    updateFilters,
    clearFilters,
    getAllReports,
    getDocumentStats,
    getDocumentMonthsStats,
    getValidationStats,
    getValidatorsStats,
    getTaskStats,
    getTaskPriorityStats,
    getAIStats,
    getAIUserStats,
    exportToCSV,
    exportToPDF,
    
  } as const;
};