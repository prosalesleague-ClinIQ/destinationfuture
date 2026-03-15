const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("df_token") : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: "Request failed" } }));
    throw new Error(error.error?.message || "Request failed");
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; firstName: string; middleName?: string; lastName?: string; nickname?: string }) =>
      fetchApi<{ token: string; user: any }>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      fetchApi<{ token: string; user: any }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => fetchApi<{ user: any }>("/api/auth/me"),
  },
  user: {
    getProfile: () => fetchApi<any>("/api/user/profile"),
    updateProfile: (data: any) => fetchApi<any>("/api/user/profile", { method: "PUT", body: JSON.stringify(data) }),
    submitOnboarding: (data: any) => fetchApi<any>("/api/user/onboarding", { method: "PUT", body: JSON.stringify(data) }),
  },
  report: {
    generate: (data: { selectedSections: string[]; presetKey?: string; outputDepth: string }) =>
      fetchApi<any>("/api/report/generate", { method: "POST", body: JSON.stringify(data) }),
    get: (sessionId: string) => fetchApi<any>(`/api/report/${sessionId}`),
    regenerateSection: (reportId: string, data: { sectionKey: string; outputDepth: string }) =>
      fetchApi<any>(`/api/report/${reportId}/regenerate-section`, { method: "POST", body: JSON.stringify(data) }),
    history: (page = 1) => fetchApi<any>(`/api/report/history?page=${page}`),
  },
  quest: {
    list: () => fetchApi<any>("/api/quest"),
    start: (questId: string) => fetchApi<any>(`/api/quest/${questId}/start`, { method: "POST" }),
    complete: (questId: string, reflectionText?: string) =>
      fetchApi<any>(`/api/quest/${questId}/complete`, { method: "POST", body: JSON.stringify({ reflectionText }) }),
    active: () => fetchApi<any>("/api/quest/active"),
  },
  gamification: {
    xp: () => fetchApi<any>("/api/gamification/xp"),
    badges: () => fetchApi<any>("/api/gamification/badges"),
    streak: () => fetchApi<any>("/api/gamification/streak"),
    reflect: (data: { type: string; content: any }) =>
      fetchApi<any>("/api/gamification/reflect", { method: "POST", body: JSON.stringify(data) }),
  },
};
