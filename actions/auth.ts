"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

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

export async function loginAction(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim();

  try {
    const result = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
      redirectTo: "/admin",
    });

    if (typeof result === "string" && isFailedSignIn(result)) {
      return { success: false, error: "Geçersiz e-posta veya şifre." };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Geçersiz e-posta veya şifre." };
    }
    throw error;
  }
}
