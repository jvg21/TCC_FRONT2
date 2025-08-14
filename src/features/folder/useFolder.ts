import { useState, useMemo } from "react";
import type { Folder } from "./types";
import { mockFolder } from "./folder.data";






export const useFolder = () => {
  const [folder, setFolder] = useState<Folder[]>(() => [...mockFolder]);
  const [query, setQuery] = useState("");

  const activeFolder = useMemo(() => {
    return folder.filter((c) => !c.IsActive && c.Name.toLowerCase().includes(query.toLowerCase()));
  }, [folder, query]);

  const create = (payload: Omit<Folder, "CreatedAt" | "UpdatedAt" | "IsActive"| "ParentFolderId" > ) => {
    const newFolder: Folder = {
      ...payload,
      FolderId: '1',
      CreatedAt: new Date().toISOString(),
      IsActive: false
    };
    setFolder((s) => [newFolder, ...s]);
    return newFolder;
  };

  const update = (id: string, updates: Partial<Folder>) => {
    setFolder((s) => s.map((c) => c.FolderId === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const softDelete = (id: string) => {
    setFolder((s) => s.map((c) => c.FolderId === id ? { ...c, isDeleted: true } : c));
  };

  const restore = (id: string) => {
    setFolder((s) => s.map((c) => c.FolderId === id ? { ...c, isDeleted: false } : c));
  };

  return {
    folder,
    activeFolder,
    query,
    setQuery,
    create,
    update,
    softDelete,
    restore
  } as const;
};
