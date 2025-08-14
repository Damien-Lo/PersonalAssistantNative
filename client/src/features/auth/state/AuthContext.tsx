import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type User = { id: string; email: string } | null;

export interface AuthContextValue {
  user: User;
  loading: boolean;
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  authFetch(path: string, init?: RequestInit): Promise<Response>;
  refreshOnce(): Promise<string | null>;
}

// Export the context if you ever want to use it directly
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

const K_ACCESS = "access";
const K_REFRESH = "refresh";
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const access = await SecureStore.getItemAsync(K_ACCESS);
      if (!access) return setLoading(false);
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.ok) {
        const data = await res.json(); // { user: { id, email } }
        setUser(data.user);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error((await res.json()).error || "Login failed");
    }
    const { access, refresh, user } = await res.json();
    await SecureStore.setItemAsync(K_ACCESS, access);
    await SecureStore.setItemAsync(K_REFRESH, refresh);
    setUser(user);

    return user;
  };

  const register = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error((await res.json()).error || "Register failed");
    }
    const { access, refresh, user } = await res.json();
    await SecureStore.setItemAsync(K_ACCESS, access);
    await SecureStore.setItemAsync(K_REFRESH, refresh);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(K_ACCESS);
    await SecureStore.deleteItemAsync(K_REFRESH);
    setUser(null);
  };

  const refreshOnce = async () => {
    const refresh = await SecureStore.getItemAsync(K_REFRESH);
    if (!refresh) return null;
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const { access } = await res.json();
    if (access) await SecureStore.setItemAsync(K_ACCESS, access);
    return access ?? null;
  };

  const authFetch = async (path: string, init: RequestInit = {}) => {
    let access = await SecureStore.getItemAsync(K_ACCESS);
    const headers: any = {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    };
    if (access) headers.Authorization = `Bearer ${access}`;
    let res = await fetch(`${API_BASE}${path}`, { ...init, headers });
    if (res.status !== 401) return res;
    const newAccess = await refreshOnce();
    if (!newAccess) return res;
    headers.Authorization = `Bearer ${newAccess}`;
    return fetch(`${API_BASE}${path}`, { ...init, headers });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, authFetch, refreshOnce }} // <-- include refreshOnce
    >
      {children}
    </AuthContext.Provider>
  );
}
