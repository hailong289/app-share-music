import ApiService from "@/services/api";
import type { User } from "@/types";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;

  checkAdminStatus: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  reset: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAdmin: false,
  isLoading: false,
  error: null,
  user: null,
  accessToken: null,

  checkAdminStatus: () => {
    const user = get().user;
    if (user && user.role === "admin") set({ isAdmin: true });
    else set({ isAdmin: false });
  },

  loadFromStorage: () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = sessionStorage.getItem("accessToken");
    if (storedUser) set({ user: JSON.parse(storedUser) });
    if (storedToken) set({ accessToken: storedToken });
    get().checkAdminStatus();
  },

  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = { email, password };
      const response = await ApiService.post("/auth/login", data);

      const user: User = { ...response.data.user };
      const accessToken = response.data.tokens.accessToken;

      // lưu vào storage
      sessionStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, accessToken });
    } catch (error: any) {
      console.log("Login error:", error);

      set({
        isAdmin: false,
        error: error?.response?.data?.message || "Login failed",
      });
    } finally {
      get().checkAdminStatus();
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = { name, email, password };
      const response = await ApiService.post("/auth/register", data);

      const user: User = { ...response.data.user };
      const accessToken = response.data.tokens.accessToken;

      sessionStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, accessToken });
    } catch (error: any) {
      set({
        isAdmin: false,
        error: error?.response?.data?.message || "Register failed",
      });
    } finally {
      get().checkAdminStatus();
      set({ isLoading: false });
    }
  },

  logout: () => {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    set({
      isAdmin: false,
      isLoading: false,
      error: null,
      user: null,
      accessToken: null,
    });
  },
}));
