"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GSI_SCRIPT_URL = "https://accounts.google.com/gsi/client";

type CredentialCallback = (response: { credential: string }) => void;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: CredentialCallback;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>
          ) => void;
        };
      };
    };
  }
}

let gsiScriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gsiScriptPromise) return gsiScriptPromise;

  gsiScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("GSI load failed"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("GSI load failed"));
    document.head.appendChild(script);
  });

  return gsiScriptPromise;
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  className,
  disabled,
  children,
}: GoogleSignInButtonProps) {
  const { loginWithGoogle, isLoading } = useAuth();
  const hiddenHostRef = useRef<HTMLDivElement>(null);
  const [gsiReady, setGsiReady] = useState(false);

  const handleCredential = useCallback(
    async (credential: string) => {
      const success = await loginWithGoogle(credential);
      if (success) {
        onSuccess?.();
      } else {
        onError?.("Google sign-in failed. Please try again.");
      }
    },
    [loginWithGoogle, onSuccess, onError]
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !hiddenHostRef.current) return;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !hiddenHostRef.current || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              void handleCredential(response.credential);
            }
          },
        });

        hiddenHostRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(hiddenHostRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: hiddenHostRef.current.offsetWidth || 400,
        });

        setGsiReady(true);
      })
      .catch(() => {
        onError?.("Failed to load Google Sign-In. Please try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [handleCredential, onError]);

  const handleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      onError?.(
        "Google Sign-In is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID."
      );
      return;
    }

    if (!gsiReady) {
      onError?.("Google Sign-In is still loading. Please try again.");
      return;
    }

    const gsiButton = hiddenHostRef.current?.querySelector(
      "div[role='button'], button"
    ) as HTMLElement | null;

    gsiButton?.click();
  };

  return (
    <>
      <div
        ref={hiddenHostRef}
        className="sr-only absolute h-px w-px overflow-hidden opacity-0 pointer-events-none"
        aria-hidden
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={className}
      >
        {children}
      </button>
    </>
  );
}
