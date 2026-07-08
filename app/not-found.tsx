import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Sayfa Bulunamadı",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-center px-6">
        <h1 className="font-display text-6xl font-bold text-[#101214]">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Aradığınız sayfa bulunamadı.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-primary font-medium hover:underline"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
