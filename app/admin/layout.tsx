import Link from "next/link";
import { signOut, auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { FileText, FolderTree, LogOut, Package } from "lucide-react";
import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Yönetim Paneli",
  noIndex: true,
});

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/admin/login" });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="font-display text-lg font-bold text-[#101214]"
            >
              Yönetim Paneli
            </Link>
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="/admin/products"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Package className="h-4 w-4" />
                Ürünler
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <FolderTree className="h-4 w-4" />
                Kategoriler
              </Link>
              <Link
                href="/admin/blog"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="h-4 w-4" />
                Blog
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {session.user.email}
            </span>
            <form action={handleSignOut}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
