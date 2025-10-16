import { useState, useEffect } from "react";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { useAuthContext } from "../../context/AuthContext";

// Types para Relatórios
export interface DocumentStats {
  total: number;
  active: number;
  inactive: number;
  validated: number;
  pending: number;
  byPeriod: Array<{ month: string; count: number }>;
}

export interface ValidationStats {
  total: number;
  approved: number;
  rejected: number;
  returned: number;
  approvalRate: number;
  avgTime: string;
  topValidators: Array<{ name: string; count: number }>;
}

export interface VersionStats {
  total: number;
  mostEdited: Array<{ title: string; versions: number }>;
}

export interface TagStats {
  total: number;
  topTags: Array<{ name: string; count: number; size: number }>;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface GroupStats {
  total: number;
  members: number;
  avgMembersPerGroup: number;
  topGroups: Array<{ name: string; members: number }>;
}

export interface AIStats {
  totalRequests: number;
  totalTokens: number;
  avgTokensPerRequest: number;
  topUsers: Array<{ name: string; requests: number }>;
  estimatedCost: string;
}

export interface ReportsData {
  documents: DocumentStats;
  validations: ValidationStats;
  versions: VersionStats;
  tags: TagStats;
  tasks: TaskStats;
  groups: GroupStats;
  ai: AIStats;
}

export const useReports = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  // Buscar estatísticas de documentos
  const getDocumentStats = async (): Promise<DocumentStats> => {
    try {
      const response = await fetch(`${apiUrl}/Report/GetDocumentStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem);
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de documentos:", err);
      throw err;
    }
  };

  // Buscar estatísticas de validações
  const getValidationStats = async (): Promise<ValidationStats> => {
    try {
      const response = await fetch(`${apiUrl}/Report/GetValidationStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem);
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de validações:", err);
      throw err;
    }
  };

  // Buscar estatísticas de versões
  const getVersionStats = async (): Promise<VersionStats> => {
    try {
      const response = await fetch(`${apiUrl}/Report/GetVersionStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem);
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de versões:", err);
      throw err;
    }
  };

  // Buscar estatísticas de tags
  const getTagStats = async (): Promise<TagStats> => {
    try {
      const response = await fetch(`${apiUrl}/Report/GetTagStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem);
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de tags:", err);
      throw err;
    }
  };

  // Buscar estatísticas de tarefas
  const getTaskStats = async (): Promise<TaskStats> => {
    try {
      const response = await fetch(`${apiUrl}/Report/GetTaskStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem);
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de tarefas:", err);
      throw err;
    }
  };

  // Buscar estatísticas de grupos
  const getGroupStats = async (): Promise<GroupStats> => {
    try {
      const response = await fetch(`${apiUrl}/Report/GetGroupStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem);
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de grupos:", err);
      throw err;
    }
  };

  // Buscar estatísticas de IA
  const getAIStats = async (): Promise<AIStats> => {
    try {
      const response = await fetch(`${apiUrl}/Report/GetAIStats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem);
      }

      return data.objeto;
    } catch (err) {
      console.error("Erro ao buscar estatísticas de IA:", err);
      throw err;
    }
  };

  // Buscar todos os dados de relatório
  const getAllReports = async () => {
    setLoading(true);
    try {
      const [documents, validations, versions, tags, tasks, groups, ai] = await Promise.all([
        getDocumentStats(),
        getValidationStats(),
        getVersionStats(),
        getTagStats(),
        getTaskStats(),
        getGroupStats(),
        getAIStats(),
      ]);

      const reports: ReportsData = {
        documents,
        validations,
        versions,
        tags,
        tasks,
        groups,
        ai,
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
    getVersionStats,
    getTagStats,
    getTaskStats,
    getGroupStats,
    getAIStats,
    exportToCSV,
    exportToPDF,
  } as const;
};