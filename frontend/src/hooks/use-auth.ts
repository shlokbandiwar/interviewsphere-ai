"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const store = useAuthStore();

  // Rehydrate user on mount if we have a token
  useEffect(() => {
    if (store.token && !store.user) {
      store.refreshUser();
    }
  }, [store]);

  return {
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    signup: store.signup,
    loginWithGoogle: store.loginWithGoogle,
    logout: store.logout,
    refreshUser: store.refreshUser,
  };
}
