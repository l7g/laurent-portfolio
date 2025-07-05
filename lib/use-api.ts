import { useState } from "react";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface UseApiOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useApi() {
  const [loading, setLoading] = useState(false);

  const request = async <T>(
    url: string,
    options: RequestInit = {},
    apiOptions: UseApiOptions = {},
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const error = data.error || `HTTP ${response.status}`;
        apiOptions.onError?.(error);
        return { error };
      }

      apiOptions.onSuccess?.();
      return { data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      apiOptions.onError?.(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Project operations
  const projects = {
    getAll: () => request<any[]>("/api/projects"),
    getById: (id: string) => request<any>(`/api/admin/projects/${id}`),
    create: (data: any, options?: UseApiOptions) =>
      request<any>(
        "/api/projects",
        { method: "POST", body: JSON.stringify(data) },
        options,
      ),
    update: (id: string, data: any, options?: UseApiOptions) =>
      request<any>(
        `/api/admin/projects/${id}`,
        { method: "PUT", body: JSON.stringify(data) },
        options,
      ),
    delete: (id: string, options?: UseApiOptions) =>
      request<{ message: string }>(
        `/api/admin/projects/${id}`,
        { method: "DELETE" },
        options,
      ),
  };

  // Section operations
  const sections = {
    getAll: () => request<any[]>("/api/sections"),
    getById: (id: string) => request<any>(`/api/sections/${id}`),
    create: (data: any, options?: UseApiOptions) =>
      request<any>(
        "/api/sections",
        { method: "POST", body: JSON.stringify(data) },
        options,
      ),
    update: (id: string, data: any, options?: UseApiOptions) =>
      request<any>(
        `/api/sections/${id}`,
        { method: "PUT", body: JSON.stringify(data) },
        options,
      ),
    delete: (id: string, options?: UseApiOptions) =>
      request<{ message: string }>(
        `/api/sections/${id}`,
        { method: "DELETE" },
        options,
      ),
  };

  // Skill operations
  const skills = {
    getAll: () => request<any[]>("/api/skills"),
    getById: (id: string) => request<any>(`/api/skills/${id}`),
    create: (data: any, options?: UseApiOptions) =>
      request<any>(
        "/api/skills",
        { method: "POST", body: JSON.stringify(data) },
        options,
      ),
    update: (id: string, data: any, options?: UseApiOptions) =>
      request<any>(
        `/api/skills/${id}`,
        { method: "PUT", body: JSON.stringify(data) },
        options,
      ),
    delete: (id: string, options?: UseApiOptions) =>
      request<{ message: string }>(
        `/api/skills/${id}`,
        { method: "DELETE" },
        options,
      ),
  };

  const settings = {
    getAll: () => request<any[]>("/api/settings"),
    getByKey: (key: string) => request<any>(`/api/settings/${key}`),
    getPublic: () => request<Record<string, any>>("/api/public/settings"),
    upsert: (data: any, options?: UseApiOptions) =>
      request<any>(
        "/api/settings",
        { method: "POST", body: JSON.stringify(data) },
        options,
      ),
    update: (key: string, data: any, options?: UseApiOptions) =>
      request<any>(
        `/api/settings/${key}`,
        { method: "PUT", body: JSON.stringify(data) },
        options,
      ),
    delete: (key: string, options?: UseApiOptions) =>
      request<{ message: string }>(
        `/api/settings/${key}`,
        { method: "DELETE" },
        options,
      ),
  };

  return {
    loading,
    projects,
    sections,
    skills,
    settings,
  };
}
