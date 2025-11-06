import { useState, useEffect } from "react";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import type { AIStats, AIUsersStats, DocumentMonthStatus, DocumentStats, GroupStats, ReportsData, TaskPriorityStats, TaskStats, ValidationStats, ValidatorsStats } from "./types";
import { t } from "i18next";


export const useReports = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const getDocumentStats = async (body?: { CreatedAtFrom: string, CreatedAtTo: string }): Promise<DocumentStats> => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/documents`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: body ? JSON.stringify(body) : undefined
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

  const getDocumentMonthsStats = async (body?: { CreatedAtFrom: string, CreatedAtTo: string }): Promise<DocumentMonthStatus[]> => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/documentsMonths`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: body ? JSON.stringify(body) : undefined
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

  const getAIStats = async (body?: { CreatedAtFrom: string, CreatedAtTo: string }): Promise<AIStats> => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/ai`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: body ? JSON.stringify(body) : undefined
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


  const getAIUserStats = async (body?: { CreatedAtFrom: string, CreatedAtTo: string }): Promise<AIUsersStats[]> => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/aiUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: body ? JSON.stringify(body) : undefined
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de usuarios de  ai:", err);
      throw err;
    }
  };

   const getValidationStats = async (body?: { CreatedAtFrom: string, CreatedAtTo: string }): Promise<ValidationStats> => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/documentvalidation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: body ? JSON.stringify(body) : undefined
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de validações:", err);
      throw err;
    }
  };

   const getValidatorsStats = async (body?: { CreatedAtFrom: string, CreatedAtTo: string }): Promise<ValidatorsStats[]> => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/documentvalidationUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: body ? JSON.stringify(body) : undefined
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de validações:", err);
      throw err;
    }
  };

   const getTaskStats = async (body?: { CreatedAtFrom: string, CreatedAtTo: string }): Promise<TaskStats> => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/task`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: body ? JSON.stringify(body) : undefined
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de task:", err);
      throw err;
    }
  };

   const getTaskPriorityStats = async (body?: { CreatedAtFrom: string, CreatedAtTo: string }): Promise<TaskPriorityStats[]> => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/taskPriority`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: body ? JSON.stringify(body) : undefined
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(t(data.mensagem));
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de tasks:", err);
      throw err;
    }
  };




  const getAllReports = async () => {
    setLoading(true);
    try {
      const [documents, documentMonths, ai, aiUsers,validations,validators,tasks,taskPrioritys] = await Promise.all([
        getDocumentStats(),
        getDocumentMonthsStats(),
        getAIStats(),
        getAIUserStats(),
        getValidationStats(),
        getValidatorsStats(),
        getTaskStats(),
        getTaskPriorityStats(),
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

  // Exportar relatório em CSV
  const exportToCSV = (reportType: string) => {
    try {
      // Implementar lógica de exportação
      notificationActions.showNotification(`Relatório de ${reportType} exportado com sucesso!`, 'success');
    } catch (err) {
      console.error("Erro ao exportar relatório:", err);
      notificationActions.showError("Erro ao exportar relatório");
    }
  };

  // Exportar relatório em PDF
  const exportToPDF = (reportType: string) => {
    try {
      // Implementar lógica de exportação
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
  }, [token]);

  return {
    reportsData,
    loading,
    getAllReports,
    getDocumentStats,
    getValidationStats,
    getTaskStats,
    getTaskPriorityStats,
    getAIStats,
    exportToCSV,
    exportToPDF,
  } as const;
};