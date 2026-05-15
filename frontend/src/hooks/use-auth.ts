"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const logout = useAuthStore((s) => s.logout);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  useEffect(() => {
    if (token && !user) {
      void refreshUser();
    }
  }, [token, user, refreshUser]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    signup,
    loginWithGoogle,
    logout,
    refreshUser,
    requestPasswordReset,
    completeOnboarding,
  };
}
