import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";
import { apiClient } from "@/lib/api-client";
import { identifyUser, resetAnalytics, trackEvent } from "@/lib/analytics";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => {
        apiClient.setToken(token);
        set({ token });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        const res = await apiClient.post<{ user: User; token: string }>("/auth/login", {
          email,
          password,
        });
        if (res.success && res.data) {
          const { user, token } = res.data;
          apiClient.setToken(token);
          identifyUser(user.id, { email: user.email, name: user.name });
          trackEvent("login");
          set({ user, token, isAuthenticated: true, isLoading: false });
          return true;
        }
        set({ isLoading: false });
        return false;
      },

      signup: async (name, email, password) => {
        set({ isLoading: true });
        const res = await apiClient.post<{ user: User; token: string }>("/auth/signup", {
          name,
          email,
          password,
        });
        if (res.success && res.data) {
          const { user, token } = res.data;
          apiClient.setToken(token);
          identifyUser(user.id, { email: user.email, name: user.name });
          trackEvent("signup");
          set({ user, token, isAuthenticated: true, isLoading: false });
          return true;
        }
        set({ isLoading: false });
        return false;
      },

      loginWithGoogle: async (credential) => {
        set({ isLoading: true });
        const res = await apiClient.post<{ user: User; token: string }>("/auth/google", {
          credential,
        });
        if (res.success && res.data) {
          const { user, token } = res.data;
          apiClient.setToken(token);
          identifyUser(user.id, { email: user.email, name: user.name });
          trackEvent("login", { provider: "google" });
          set({ user, token, isAuthenticated: true, isLoading: false });
          return true;
        }
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        apiClient.setToken(null);
        resetAnalytics();
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;
        apiClient.setToken(token);
        const res = await apiClient.get<User>("/auth/me");
        if (res.success && res.data) {
          set({ user: res.data, isAuthenticated: true });
        } else {
          // Token expired
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "interviewsphere-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token);
        }
      },
    }
  )
);
