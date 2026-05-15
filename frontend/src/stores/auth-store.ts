import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";
import { apiClient } from "@/lib/api-client";
import { identifyUser, resetAnalytics, trackEvent } from "@/lib/analytics";
import { syncAuthCookies, clearAuthCookies } from "@/lib/auth-session";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  completeOnboarding: () => void;
}

function applySession(
  set: (partial: Partial<AuthState>) => void,
  user: User | null,
  token: string | null
) {
  apiClient.setToken(token);
  syncAuthCookies(token, user?.onboardingComplete ?? false);
  set({
    user,
    token,
    isAuthenticated: !!(user && token),
    isLoading: false,
  });
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => {
        const { token } = get();
        syncAuthCookies(token, user?.onboardingComplete ?? false);
        set({ user, isAuthenticated: !!(user && token) });
      },

      setToken: (token) => {
        const { user } = get();
        apiClient.setToken(token);
        syncAuthCookies(token, user?.onboardingComplete ?? false);
        set({ token, isAuthenticated: !!(user && token) });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        const res = await apiClient.post<{ user: User; token: string }>("/auth/login", {
          email,
          password,
        });
        if (res.success && res.data) {
          const { user, token } = res.data;
          identifyUser(user.id, { email: user.email, name: user.name });
          trackEvent("login");
          applySession(set, user, token);
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
          identifyUser(user.id, { email: user.email, name: user.name });
          trackEvent("signup");
          applySession(set, user, token);
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
          identifyUser(user.id, { email: user.email, name: user.name });
          trackEvent("login", { provider: "google" });
          applySession(set, user, token);
          return true;
        }
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        apiClient.setToken(null);
        clearAuthCookies();
        resetAnalytics();
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;
        apiClient.setToken(token);
        const res = await apiClient.get<User>("/auth/me");
        if (res.success && res.data) {
          syncAuthCookies(token, res.data.onboardingComplete);
          set({ user: res.data, isAuthenticated: true });
        } else {
          apiClient.setToken(null);
          clearAuthCookies();
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      requestPasswordReset: async (email) => {
        set({ isLoading: true });
        const res = await apiClient.post("/auth/forgot-password", { email });
        set({ isLoading: false });
        return res.success;
      },

      completeOnboarding: () => {
        const { user, token } = get();
        if (!user || !token) return;
        const updated = { ...user, onboardingComplete: true };
        syncAuthCookies(token, true);
        set({ user: updated });
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
          syncAuthCookies(state.token, state.user?.onboardingComplete ?? false);
        }
      },
    }
  )
);
