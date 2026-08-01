"use server";

import { headers } from "next/headers";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/login-rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

function isFailedSignIn(result: string): boolean {
  try {
    const url = new URL(result, "http://localhost");
    return (
      url.searchParams.has("error") || url.pathname.startsWith("/admin/login")
    );
  } catch {
    return result.includes("error=") || result.includes("/admin/login");
  }
}

function sanitizeCallbackPath(path: string | null | undefined): string {
  if (!path) return "/admin";
  if (!path.startsWith("/admin")) return "/admin";
  if (path.startsWith("//") || path.includes("\\") || path.includes("..")) {
    return "/admin";
  }
  if (path !== "/admin" && !path.startsWith("/admin/")) {
    return "/admin";
  }
  return path;
}

async function getClientIp(): Promise<string | undefined> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headerList.get("x-real-ip")?.trim();
  return forwarded || realIp || undefined;
}

async function getRateLimitKey(email: string): Promise<string> {
  const ip = (await getClientIp()) || "unknown";
  return `${ip}:${email.toLowerCase()}`;
}

export async function loginAction(
  email: string,
  password: string,
  callbackUrl?: string,
  turnstileToken?: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim();
  const rateKey = await getRateLimitKey(normalizedEmail);
  const limit = checkLoginRateLimit(rateKey);

  if (!limit.allowed) {
    return {
      success: false,
      error: `Çok fazla deneme. Lütfen ${limit.retryAfterSec ?? 60} saniye sonra tekrar deneyin.`,
    };
  }

  const remoteip = await getClientIp();
  const turnstileOk = await verifyTurnstileToken(
    turnstileToken || "",
    remoteip
  );

  if (!turnstileOk) {
    recordLoginFailure(rateKey);
    return {
      success: false,
      error: "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.",
    };
  }

  const redirectTo = sanitizeCallbackPath(callbackUrl);

  try {
    const result = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
      redirectTo,
    });

    if (typeof result === "string" && isFailedSignIn(result)) {
      recordLoginFailure(rateKey);
      return { success: false, error: "Geçersiz e-posta veya şifre." };
    }

    clearLoginFailures(rateKey);
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      recordLoginFailure(rateKey);
      return { success: false, error: "Geçersiz e-posta veya şifre." };
    }
    throw error;
  }
}
