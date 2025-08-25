import { useState, useMemo, useEffect } from "react";
import type { Task } from "./types";
import { t } from "i18next";
import { getCookie } from "../../utils/Cookies";
import type { ApiResponse } from "../../types";
import { notificationActions } from "../notifications/useNotification";
import { useAuthContext } from "../../context/AuthContext";

export const useTask = () => {
  const [task, setTask] = useState<Task[]>([]);
  const [query, setQuery] = useState("");
  const { user } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";

  const activeTask = useMemo(() => {
    return task.filter((c) => c.IsActive);
  }, [task]);

  const deactiveTask = useMemo(() => {
    return task.filter((c) => !c.IsActive);
  }, [task]);

  const transformPayloadToCamelCase = (payload: any) => {
    return {
      title: payload.Title,
      description: payload.Description,
      dueDate: payload.DueDate,
      priority: payload.Priority || 1,
      status: payload.Status || 1,
      assigneeId: payload.AssigneeId,
      userId: payload.UserId || user?.UserId,
      parentTaskId: payload.ParentTaskId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: payload.IsActive ?? true
    };
  };

  const transformApiDataToPascalCase = (apiData: any[]): Task[] => {
    return apiData.map(item => ({
      TaskId: item.taskId,
      Title: item.title,
      Description: item.description,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt,
      DueDate: item.dueDate,
      Priority: item.priority,
      Status: item.status,
      AssigneeId: item.assigneeId,
      UserId: item.userId,
      ParentTaskId: item.parentTaskId,
      IsActive: item.isActive
    }));
  };

  const transformSingleApiData = (item: any): Task => {
    return {
      TaskId: item.taskId,
      Title: item.title,
      Description: item.description,
      CreatedAt: item.createdAt,
      UpdatedAt: item.updatedAt,
      DueDate: item.dueDate,
      Priority: item.priority,
      Status: item.status,
      AssigneeId: item.assigneeId,
      UserId: item.userId,
      ParentTaskId: item.parentTaskId,
      IsActive: item.isActive
    };
  };

  const get = async () => {
    try {
      const response = await fetch(`${apiUrl}/Task/GetListTask`, {
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

      const transformedTasks = transformApiDataToPascalCase(data.objeto);
      setTask(transformedTasks);
      return data;
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      throw err;
    }
  };

  const getById = async (taskId: string) => {
    try {
      const response = await fetch(`${apiUrl}/Task/GetTaskById/${taskId}`, {
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
      console.error("Erro ao buscar tarefa:", err);
      throw err;
    }
  };

  const create = async (payload: Omit<Task, "TaskId" | "CreatedAt" | "UpdatedAt" | "IsActive" | "UserId">) => {
    try {
      const camelCasePayload = transformPayloadToCamelCase(payload);

      console.log('Payload enviado:', camelCasePayload);

      const response = await fetch(`${apiUrl}/Task/AddTask`, {
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

      const newTask: Task = transformSingleApiData(data.objeto);
      setTask((s) => [newTask, ...s]);
      notificationActions.showNotification(t('tasks.createSuccess'), 'success');

      return data;

    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
      throw err;
    }
  };

  const update = async (id: number, updates: Partial<Task>) => {
    try {
      const camelCasePayload = {
        taskId: id,
        ...transformPayloadToCamelCase(updates)
      };

      const response = await fetch(`${apiUrl}/Task/UpdateTask`, {
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

      const updatedTask: Task = transformSingleApiData(data.objeto);
      setTask((s) => s.map((c) => c.TaskId === id ? updatedTask : c));
      notificationActions.showNotification(t('tasks.updateSuccess') || 'Tarefa atualizada com sucesso!', 'success');
      return data;
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
      throw err;
    }
  };

  const softDelete = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/Task/ToogleStatusTask/${id}`, {
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

      const updatedTask: Task = transformSingleApiData(data.objeto);
      setTask((s) => s.map((c) => c.TaskId === id ? updatedTask : c));
      notificationActions.showNotification(t('tasks.updateStatusSuccess'), 'success');
      
      return data;

    } catch (err) {
      console.error("Erro ao alterar status da tarefa:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    task,
    activeTask,
    deactiveTask,
    query,
    setQuery,
    get,
    getById,
    create,
    update,
    softDelete,
  } as const;
};