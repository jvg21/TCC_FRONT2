import { useState, useMemo, useEffect } from "react";
import { getCookie } from "../../utils/Cookies";
import type { Task } from "./types";

export const useTask = () => {
  const [document, setTask] = useState<Task[]>([]);
  const [query, setQuery] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";


  const activeTask = useMemo(() => {
    return document.filter((c) => c.IsActive);
  }, [document]);

  const deactiveTask = useMemo(() => {
    return document.filter((c) => !c.IsActive);
  }, [document, query]);

  const transformPayloadToCamelCase = (payload: any) => ({})

  const transformApiDataToPascalCase = (apiData: any[]): Task[] => { })

  const transformSingleApiData = (item: any): Task => ({})

  const get = async () => {};

  const create = (payload: Omit<Task, "CreatedAt" | "UpdatedAt" | "IsActive"| "UserId"> ) => {

  };

  const update = (id: number, updates: Partial<Task>) => {
  };

  const softDelete = (id: number) => {
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    document,
    activeTask,
    query,
    setQuery,
    create,
    update,
    softDelete,
  } as const;
};