import { useState, useMemo } from "react";
import { mockTask } from "./task.data";
import type { Task } from "./types";




export const useTask = () => {
  const [task, setTask] = useState<Task[]>(() => [...mockTask]);
  const [query, setQuery] = useState("");

  const activeTask = useMemo(() => {
    return task.filter((c) => !c.IsActive && c.Title.toLowerCase().includes(query.toLowerCase()));
  }, [task, query]);

  const create = (payload: Omit<Task, "CreatedAt" | "UpdatedAt" | "IsActive"| "UserId"> ) => {
    const newTask: Task = {
      ...payload,
      TaskId: '1',
      CreatedAt: new Date().toISOString(),
      IsActive: false
    };
    setTask((s) => [newTask, ...s]);
    return newTask;
  };

  const update = (id: string, updates: Partial<Task>) => {
    setTask((s) => s.map((c) => c.TaskId === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const softDelete = (id: string) => {
    setTask((s) => s.map((c) => c.TaskId === id ? { ...c, isDeleted: true } : c));
  };

  const restore = (id: string) => {
    setTask((s) => s.map((c) => c.TaskId === id ? { ...c, isDeleted: false } : c));
  };

  return {
    task,
    activeTask,
    query,
    setQuery,
    create,
    update,
    softDelete,
    restore
  } as const;
};