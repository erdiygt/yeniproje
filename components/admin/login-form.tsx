"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TurnstileWidget,
  resetTurnstile,
} from "@/components/admin/turnstile-widget";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/admin";
  const callbackUrl =
    rawCallbackUrl === "/admin" ||
    (rawCallbackUrl.startsWith("/admin/") &&
      !rawCallbackUrl.startsWith("//") &&
      !rawCallbackUrl.includes("..") &&
      !rawCallbackUrl.includes("\\"))
      ? rawCallbackUrl
      : "/admin";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    if (!turnstileToken) {
      setError("Lütfen güvenlik doğrulamasını tamamlayın.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await loginAction(
      data.email,
      data.password,
      callbackUrl,
      turnstileToken
    );

    if (result.success) {
      router.push(callbackUrl);
      router.refresh();
      return;
    }

    setError(result.error || "Giriş başarısız.");
    setTurnstileToken(null);
    resetTurnstile();
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl text-[#101214]">
          Yönetim Paneli
        </CardTitle>
        <CardDescription>Devam etmek için giriş yapın</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <TurnstileWidget onToken={setTurnstileToken} />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !turnstileToken}
          >
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
