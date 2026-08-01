"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileWidgetProps {
  onToken: (token: string | null) => void;
  onReadyChange?: (ready: boolean) => void;
}

const SCRIPT_ID = "cf-turnstile-script";

export function TurnstileWidget({ onToken, onReadyChange }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onReadyChangeRef = useRef(onReadyChange);

  onTokenRef.current = onToken;
  onReadyChangeRef.current = onReadyChange;

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
    if (!siteKey || !containerRef.current) {
      onReadyChangeRef.current?.(false);
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        callback: (token) => {
          onTokenRef.current(token);
          onReadyChangeRef.current?.(true);
        },
        "expired-callback": () => {
          onTokenRef.current(null);
          onReadyChangeRef.current?.(false);
        },
        "error-callback": () => {
          onTokenRef.current(null);
          onReadyChangeRef.current?.(false);
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      window.onTurnstileLoad = () => {
        if (!cancelled) renderWidget();
      };

      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else if (window.turnstile) {
        renderWidget();
      }
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // widget already removed
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()) {
    return (
      <p className="text-sm text-destructive">
        Turnstile yapılandırılmamış. Site key eksik.
      </p>
    );
  }

  return <div ref={containerRef} className="flex justify-center" />;
}

export function resetTurnstile() {
  if (typeof window !== "undefined" && window.turnstile) {
    window.turnstile.reset();
  }
}
