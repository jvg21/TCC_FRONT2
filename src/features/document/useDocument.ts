import { useState, useMemo } from "react";
import type { Document } from "./types";
import { mockDocument } from "./document.data";


export const useDocument = () => {
  const [document, setDocument] = useState<Document[]>(() => [...mockDocument]);
  const [query, setQuery] = useState("");

  const activeDocument = useMemo(() => {
    return document.filter((c) => !c.IsActive && c.Title.toLowerCase().includes(query.toLowerCase()));
  }, [document, query]);

  const create = (payload: Omit<Document, "CreatedAt" | "UpdatedAt" | "IsActive"| "UserId"> ) => {
    const newDocument: Document = {
      ...payload,
      DocumentId: '1',
      CreatedAt: new Date().toISOString(),
      IsActive: false
    };
    setDocument((s) => [newDocument, ...s]);
    return newDocument;
  };

  const update = (id: string, updates: Partial<Document>) => {
    setDocument((s) => s.map((c) => c.DocumentId === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const softDelete = (id: string) => {
    setDocument((s) => s.map((c) => c.DocumentId === id ? { ...c, isDeleted: true } : c));
  };

  const restore = (id: string) => {
    setDocument((s) => s.map((c) => c.DocumentId === id ? { ...c, isDeleted: false } : c));
  };

  return {
    document,
    activeDocument,
    query,
    setQuery,
    create,
    update,
    softDelete,
    restore
  } as const;
};