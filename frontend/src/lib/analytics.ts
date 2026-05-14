// PostHog analytics wrapper — no-ops gracefully when key is not configured

type AnalyticsEvent =
  | "interview_started"
  | "interview_completed"
  | "interview_abandoned"
  | "question_answered"
  | "voice_toggled"
  | "coding_mode_entered"
  | "resume_uploaded"
  | "onboarding_completed"
  | "page_viewed"
  | "signup"
  | "login"
  | "error_occurred";

/* eslint-disable @typescript-eslint/no-explicit-any */
let posthogInstance: any = null;

export async function initAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  try {
    const posthog = (await import("posthog-js")).default;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false, // We handle manually for SPA
      persistence: "localStorage",
    });
    posthogInstance = posthog;
  } catch {
    // Silent fail — analytics should never break the app
  }
}

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  posthogInstance?.capture(event, properties);
}

export function trackPageView(path: string) {
  posthogInstance?.capture("$pageview", { $current_url: path });
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  posthogInstance?.identify(userId, traits);
}

export function resetAnalytics() {
  posthogInstance?.reset();
}
