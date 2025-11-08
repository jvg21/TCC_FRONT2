import { useState, useEffect, useMemo } from "react";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { useTranslation } from "react-i18next";
import type { Comment } from "./types";



export const useComment = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  
  const activeComments = useMemo(() => {
    return comments.filter((c) => c.IsActive);
  }, [comments]);

  const deactiveComments = useMemo(() => {
    return comments.filter((c) => !c.IsActive);
  }, [comments]);

  
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

  
  const getComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Comment/GetListComment`, {
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
      setComments(transformedComments);
      return transformedComments;
    } catch (err) {
      console.error("Erro ao buscar comentários:", err);
      setComments([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const getCommentById = async (commentId: number) => {
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
  };

  
  const getCommentsByDocumentId = async (documentId: number) => {
    if (!documentId) return [];
    
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
      return transformedComments;
    } catch (err) {
      console.error("Erro ao buscar comentários do documento:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (payload: Comment) => {
    if (!payload.Content.trim() || !payload.DocumentId) {
      notificationActions.showError(t('comments.contentRequired') || 'Conteúdo e documento são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const requestPayload = {
        content: payload.Content,
        documentId: payload.DocumentId
      };

      const response = await fetch(`${apiUrl}/Comment/AddComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const newComment = transformSingleApiData(data.objeto);
      setComments((prev) => [...prev, newComment]);
      notificationActions.showNotification(t('comments.createSuccess') || 'Comentário adicionado com sucesso!', 'success');
      return newComment;
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (commentId: number, payload: Comment) => {
    if (!payload.Content.trim()) {
      notificationActions.showError(t('comments.contentRequired') || 'Conteúdo é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const requestPayload = {
        commentId: commentId,
        content: payload.Content,
        documentId: payload.DocumentId
      };

      const response = await fetch(`${apiUrl}/Comment/UpdateComment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const data: ApiResponse = await response.json();

      if (data.erro) {
        notificationActions.showError(data.mensagem);
        throw new Error(data.mensagem);
      }

      const updatedComment = transformSingleApiData(data.objeto);
      setComments((prev) => prev.map((c) => c.CommentId === commentId ? updatedComment : c));
      notificationActions.showNotification(t('comments.updateSuccess') || 'Comentário atualizado com sucesso!', 'success');
      return updatedComment;
    } catch (err) {
      console.error("Erro ao atualizar comentário:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  const softDeleteComment = async (commentId: number) => {
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

      const updatedComment = transformSingleApiData(data.objeto);
      setComments((prev) => prev.map((c) => c.CommentId === commentId ? updatedComment : c));
      notificationActions.showNotification(t('comments.statusUpdateSuccess') || 'Status do comentário alterado com sucesso!', 'success');
      return updatedComment;
    } catch (err) {
      console.error("Erro ao alterar status do comentário:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (token) {
      getComments();
    }
  }, [token]);

  return {
    comments,
    activeComments,
    deactiveComments,
    loading,
    query,
    setQuery,
    getComments,
    getCommentById,
    getCommentsByDocumentId,
    createComment,
    updateComment,
    softDeleteComment,
  } as const;
};