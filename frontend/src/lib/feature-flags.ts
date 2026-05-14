import type { FeatureFlags } from "@/types";

// Default flags — overridden by server values when backend is connected
const DEFAULT_FLAGS: FeatureFlags = {
  enableWebcam: false,
  enableVoice: true,
  enableCodingMode: true,
  enableStressMode: true,
  enableStreaks: true,
  enableAdminUpload: true,
};

let currentFlags: FeatureFlags = { ...DEFAULT_FLAGS };

export function setFeatureFlags(flags: Partial<FeatureFlags>) {
  currentFlags = { ...DEFAULT_FLAGS, ...flags } as FeatureFlags;
}

export function getFeatureFlag(key: keyof FeatureFlags): boolean {
  return currentFlags[key] ?? false;
}

export function getAllFeatureFlags(): FeatureFlags {
  return { ...currentFlags };
}

export function isFeatureEnabled(key: string): boolean {
  return currentFlags[key] ?? false;
}
