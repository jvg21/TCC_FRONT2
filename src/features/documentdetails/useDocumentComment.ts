import { useState, useMemo, useCallback } from "react";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { useAuthContext } from "../../context/AuthContext";

// Interface para comentários
export interface Comment {
  CommentId: number;
  Content: string;
  DocumentId: number;
  UserId: number;
  UserName?: string;
  CreatedAt: string;
  UpdatedAt: string;
  IsActive: boolean;
}

// Interface para criar comentário
export interface CreateCommentPayload {
  Content: string;
  DocumentId: number;
}

export const useDocumentComment = () => {
  const [documentComments, setDocumentComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  // Transformar dados da API para Pascal Case
  const transformApiDataToPascalCase = (apiData: any[]): Comment[] => {
    return apiData.map(item => ({
      CommentId: item.commentId || item.CommentId,
      Content: item.content || item.Content,
      DocumentId: item.documentId || item.DocumentId,
      UserId: item.userId || item.UserId,
      UserName: item.userName || item.UserName,
      CreatedAt: item.createdAt || item.CreatedAt,
      UpdatedAt: item.updatedAt || item.UpdatedAt,
      IsActive: item.isActive ?? item.IsActive ?? true
    }));
  };

  const transformSingleApiData = (item: any): Comment => {
    return {
      CommentId: item.commentId || item.CommentId,
      Content: item.content || item.Content,
      DocumentId: item.documentId || item.DocumentId,
      UserId: item.userId || item.UserId,
      UserName: item.userName || item.UserName,
      CreatedAt: item.createdAt || item.CreatedAt,
      UpdatedAt: item.updatedAt || item.UpdatedAt,
      IsActive: item.isActive ?? item.IsActive ?? true
    };
  };

  // Buscar comentários por documento
  const getCommentsByDocumentId = useCallback(async (documentId: number) => {
    if (!documentId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Comment/GetListCommentByDocumentId/${documentId}`, {
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

      const transformedComments = transformApiDataToPascalCase(data.objeto || []);
      setDocumentComments(transformedComments);
      return transformedComments;
    } catch (err) {
      console.error("Erro ao buscar comentários:", err);
      notificationActions.showError("Erro ao carregar comentários");
      setDocumentComments([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  // Buscar comentário por ID
  const getCommentById = useCallback(async (commentId: number) => {
    try {
      const response = await fetch(`${apiUrl}/Comment/GetCommentById/${commentId}`, {
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

      return transformSingleApiData(data.objeto);
    } catch (err) {
      console.error("Erro ao buscar comentário:", err);
      throw err;
    }
  }, [apiUrl, token]);

  // Criar novo comentário
  const createComment = useCallback(async (payload: CreateCommentPayload) => {
    if (!payload.Content.trim() || !payload.DocumentId) {
      notificationActions.showError("Conteúdo e documento são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Comment/AddComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: payload.Content,
          documentId: payload.DocumentId
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      // Recarregar comentários do documento
      await getCommentsByDocumentId(payload.DocumentId);
      
      notificationActions.showNotification("Comentário adicionado com sucesso!",'success');
      return transformSingleApiData(data.objeto);
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
      notificationActions.showError("Erro ao adicionar comentário");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token, getCommentsByDocumentId]);

  // Atualizar comentário existente
  const updateComment = useCallback(async (commentId: number, content: string) => {
    if (!content.trim()) {
      notificationActions.showError("Conteúdo não pode estar vazio");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Comment/UpdateComment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentId: commentId,
          content: content
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      // Atualizar estado local
      setDocumentComments(prev => 
        prev.map(comment => 
          comment.CommentId === commentId 
            ? { ...comment, Content: content, UpdatedAt: new Date().toISOString() }
            : comment
        )
      );

      notificationActions.showNotification("Comentário atualizado com sucesso!",'success');
      return transformSingleApiData(data.objeto);
    } catch (err) {
      console.error("Erro ao atualizar comentário:", err);
      notificationActions.showError("Erro ao atualizar comentário");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  // Deletar comentário
  const deleteComment = useCallback(async (commentId: number, documentId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Comment/ToggleStatusComment/${commentId}`, {
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

      // Recarregar comentários do documento
      await getCommentsByDocumentId(documentId);
      
      notificationActions.showNotification("Comentário removido com sucesso!",'success');
      return data;
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
      notificationActions.showError("Erro ao remover comentário");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token, getCommentsByDocumentId]);

  // Limpar comentários do estado
  const clearComments = useCallback(() => {
    setDocumentComments([]);
  }, []);

  return {
    // Estados
    documentComments,
    loading,
    
    // Funções
    getCommentsByDocumentId,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    clearComments,

  };
};