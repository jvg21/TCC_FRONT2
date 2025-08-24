import { useState, useMemo, useEffect } from "react";
import type { Document } from "./types";
import { getCookie } from "../../utils/Cookies";


export const useDocument = () => {
  const [document, setDocument] = useState<Document[]>([]);
  const [query, setQuery] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = getCookie('authToken') || "";


  const activeDocument = useMemo(() => {
    return document.filter((c) => c.IsActive);
  }, [document]);

  const deactiveDocument = useMemo(() => {
    return document.filter((c) => !c.IsActive);
  }, [document, query]);

  const transformPayloadToCamelCase = (payload: any) => ({})

  const transformApiDataToPascalCase = (apiData: any[]): Document[] => { })

  const transformSingleApiData = (item: any): Document => ({})



  const get = async () => {};


  const create = (payload: Omit<Document, "CreatedAt" | "UpdatedAt" | "IsActive" | "UserId">) => {

  };

  const update = (id: number, updates: Partial<Document>) => {
  };

  const softDelete = (id: number) => {
  };

  useEffect(() => {
    if (token) get();
  }, [token]);

  return {
    document,
    activeDocument,
    query,
    setQuery,
    create,
    update,
    softDelete,
  } as const;
};