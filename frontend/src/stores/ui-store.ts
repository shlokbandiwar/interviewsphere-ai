import { create } from "zustand";
import type { FeatureFlags } from "@/types";
import { getAllFeatureFlags, setFeatureFlags } from "@/lib/feature-flags";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Mobile
  mobileMenuOpen: boolean;

  // Feature flags
  featureFlags: FeatureFlags;

  // Global loading
  globalLoading: boolean;

  // Toast notifications (minimal — extend later)
  toasts: Toast[];

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setFeatureFlags: (flags: Partial<FeatureFlags>) => void;
  setGlobalLoading: (loading: boolean) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  duration?: number;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  featureFlags: getAllFeatureFlags(),
  globalLoading: false,
  toasts: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  setFeatureFlags: (flags) => {
    setFeatureFlags(flags);
    set({ featureFlags: getAllFeatureFlags() });
  },

  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }],
    })),

  removeToast: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),
}));
