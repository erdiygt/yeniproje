import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Yönetim Paneli Girişi",
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 text-center text-muted-foreground">
            Yükleniyor...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
