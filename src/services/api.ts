import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const TOKEN_KEY = "sleep_auth_token";

// ── Axios instance ────────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach JWT
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — normalise errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    return Promise.reject(error.response?.data || error);
  },
);

// ── Token helpers ─────────────────────────────────────────────────────────────
export const saveToken = (token: string) =>
  SecureStore.setItemAsync(TOKEN_KEY, token);
export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const clearToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    timezone?: string;
  }) => api.post("/auth/register", data),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

// ── Sleep sessions ────────────────────────────────────────────────────────────
export const sleepAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => api.get("/sleep", { params }),
  getOne: (id: string) => api.get(`/sleep/${id}`),
  getLatest: () => api.get("/sleep/latest"),
  create: (data: Record<string, unknown>) => api.post("/sleep", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/sleep/${id}`, data),
  delete: (id: string) => api.delete(`/sleep/${id}`),
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  getSummary: (period: "week" | "month" | "year" = "week") =>
    api.get("/analytics/summary", { params: { period } }),
  getTrends: (days = 30) => api.get("/analytics/trends", { params: { days } }),
  getInsights: () => api.get("/analytics/insights"),
  getStages: (days = 7) => api.get("/analytics/stages", { params: { days } }),
};

// ── Goals ─────────────────────────────────────────────────────────────────────
export const goalsAPI = {
  getAll: () => api.get("/goals"),
  create: (data: Record<string, unknown>) => api.post("/goals", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
};

export default api;
