import type { User } from "@/types";

export function getPostAuthPath(user: User | null | undefined): string {
  if (!user?.onboardingComplete) return "/onboarding";
  return "/dashboard";
}

export function resolveAuthRedirect(
  user: User | null | undefined,
  redirectParam: string | null
): string {
  const defaultPath = getPostAuthPath(user);
  if (!user?.onboardingComplete) return defaultPath;

  if (
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//") &&
    !redirectParam.startsWith("/login") &&
    !redirectParam.startsWith("/signup")
  ) {
    return redirectParam;
  }

  return defaultPath;
}
