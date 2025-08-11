import ApiService from "@/services/api";
import type { User } from "@/types";
import { create } from "zustand";

interface AuthStore {
	isAdmin: boolean;
	user: User | null;
	isLoading: boolean;
	error: string | null;

	checkAdminStatus: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	isAdmin: false,
	isLoading: false,
	error: null,
	user: null,

	checkAdminStatus: async () => {
    const user = get().user;
    if (user && user.role == "admin") set({ isAdmin: true })
    else set({ isAdmin: false })
	},

	reset: () => {
		set({ isAdmin: false, isLoading: false, error: null });
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
      const data = {email, password};
			const response = await ApiService.post("/auth/login", data);
      const user: User = {...response.data.user}
			set({ user });
		} catch (error: any) {
			set({ isAdmin: false, error: error.response.data.message });
		} finally {
      get().checkAdminStatus();
			set({ isLoading: false });
		}
	},

	register: async (name, email, password) => {
		set({ isLoading: true, error: null });
		try {
      const data = {name, email, password};
			const response = await ApiService.post("/auth/register", data);
      const user  = {...response.data.user}
			set({ user });
		} catch (error: any) {
			set({ isAdmin: false, error: error.response.data.message });
		} finally {
      get().checkAdminStatus();
			set({ isLoading: false });
		}
	},

	logout: async () => {
		set({ isAdmin: false, isLoading: false, error: null, user: null });
	},
}));
