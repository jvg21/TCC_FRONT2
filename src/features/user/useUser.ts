import { useState, useMemo } from "react";
import type { User } from "./types";
import { mockUser } from "./user.data";





export const useUser = () => {
  const [user, setUser] = useState<User[]>(() => [...mockUser]);
  const [query, setQuery] = useState("");

  const activeUser = useMemo(() => {
    return user.filter((c) => !c.IsActive && c.Name.toLowerCase().includes(query.toLowerCase()));
  }, [user, query]);

  const create = (payload: Omit<User, "CreatedAt" | "UpdatedAt" | "IsActive"| "PreferredLanguage" | "PreferredTheme" | "Password" | "LastLoginAt" | "CompanyId"> ) => {
    const newUser: User = {
      ...payload,
      UserId: '1',
      CreatedAt: new Date().toISOString(),
      IsActive: false
    };
    setUser((s) => [newUser, ...s]);
    return newUser;
  };

  const update = (id: string, updates: Partial<User>) => {
    setUser((s) => s.map((c) => c.UserId === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const softDelete = (id: string) => {
    setUser((s) => s.map((c) => c.UserId === id ? { ...c, isDeleted: true } : c));
  };

  const restore = (id: string) => {
    setUser((s) => s.map((c) => c.UserId === id ? { ...c, isDeleted: false } : c));
  };

  return {
    user,
    activeUser,
    query,
    setQuery,
    create,
    update,
    softDelete,
    restore
  } as const;
};
