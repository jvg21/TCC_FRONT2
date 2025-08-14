import { useState, useMemo } from "react";
import { mockGroup } from "./group.data";
import type { Group } from "./types";



export const useGroup = () => {
  const [group, setGroup] = useState<Group[]>(() => [...mockGroup]);
  const [query, setQuery] = useState("");

  const activeGroup = useMemo(() => {
    return group.filter((c) => !c.IsActive && c.Name.toLowerCase().includes(query.toLowerCase()));
  }, [group, query]);

  const create = (payload: Omit<Group, "CreatedAt" | "UpdatedAt" | "IsActive"| "UserId"> ) => {
    const newGroup: Group = {
      ...payload,
      GroupId: '1',
      CreatedAt: new Date().toISOString(),
      IsActive: false
    };
    setGroup((s) => [newGroup, ...s]);
    return newGroup;
  };

  const update = (id: string, updates: Partial<Group>) => {
    setGroup((s) => s.map((c) => c.GroupId === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const softDelete = (id: string) => {
    setGroup((s) => s.map((c) => c.GroupId === id ? { ...c, isDeleted: true } : c));
  };

  const restore = (id: string) => {
    setGroup((s) => s.map((c) => c.GroupId === id ? { ...c, isDeleted: false } : c));
  };

  return {
    group,
    activeGroup,
    query,
    setQuery,
    create,
    update,
    softDelete,
    restore
  } as const;
};