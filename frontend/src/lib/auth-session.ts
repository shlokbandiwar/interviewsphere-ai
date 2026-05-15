/** Cookie names read by middleware (must stay in sync with auth-store). */
export const AUTH_TOKEN_COOKIE = "is-auth";
export const ONBOARDING_COOKIE = "onboarding-complete";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function syncAuthCookies(
  token: string | null,
  onboardingComplete?: boolean
): void {
  if (typeof document === "undefined") return;

  if (token) {
    document.cookie = `${AUTH_TOKEN_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    document.cookie = `${ONBOARDING_COOKIE}=${onboardingComplete ? "1" : "0"}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } else {
    clearAuthCookies();
  }
}

export function clearAuthCookies(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${ONBOARDING_COOKIE}=; path=/; max-age=0`;
}
