import Link from "next/link";
import { auth } from "@/lib/auth";
import { getAllPosts } from "@/services/blog.service";
import { getAllProducts } from "@/services/product.service";
import { getAllCategories } from "@/services/category.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Package,
  FolderTree,
} from "lucide-react";
import { formatDateShort } from "@/utils/format-date";
import { formatPrice } from "@/utils/format-price";
import { categoryPath } from "@/lib/catalog-paths";

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "published";
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        isPublished
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {isPublished ? "Yayında" : "Taslak"}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const [posts, products, categories] = await Promise.all([
    getAllPosts(),
    getAllProducts(),
    getAllCategories(),
  ]);

  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const publishedProducts = products.filter((p) => p.status === "published")
    .length;
  const draftProducts = products.filter((p) => p.status === "draft").length;
  const publishedCategories = categories.filter((c) => c.status === "published")
    .length;
  const draftCategories = categories.filter((c) => c.status === "draft").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-[#101214] lg:text-5xl">
            Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hoş geldiniz, {session?.user?.email}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            asChild
            className="bg-[#0F766E] text-white hover:bg-[#0D9488]"
          >
            <Link href="/admin/categories/new">
              <Plus className="h-4 w-4 mr-2" />
              Kategori Ekle
            </Link>
          </Button>
          <Button
            asChild
            className="bg-[#B45309] text-white hover:bg-[#D97706]"
          >
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Ürün Ekle
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Yazı
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Yazı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Yayında Yazı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {publishedPosts}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taslak Yazı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{draftPosts}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Ürün
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#B45309]">
                {products.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Yayında Ürün
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {publishedProducts}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taslak Ürün
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">
                {draftProducts}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0F766E]">
                {categories.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Yayında Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {publishedCategories}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taslak Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">
                {draftCategories}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Son Yazılar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                Henüz blog yazısı yok.{" "}
                <Link
                  href="/admin/blog/new"
                  className="text-primary hover:underline"
                >
                  İlk yazınızı oluşturun
                </Link>
              </p>
            ) : (
              <div className="divide-y divide-border">
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-medium text-foreground line-clamp-1">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={post.status} />
                        {post.publishedAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatDateShort(post.publishedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {post.status === "published" && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#B45309]" />
              Son Ürünler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                Henüz ürün yok.{" "}
                <Link
                  href="/admin/products/new"
                  className="text-[#B45309] hover:underline"
                >
                  İlk ürünü oluşturun
                </Link>
              </p>
            ) : (
              <div className="divide-y divide-border">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-medium text-foreground line-clamp-1">
                        {product.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <StatusBadge status={product.status} />
                        <span className="text-xs text-muted-foreground">
                          {formatPrice(product.price)}
                        </span>
                        {product.category && (
                          <span className="text-xs text-muted-foreground">
                            · {product.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {product.status === "published" && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/urunler/${product.slug}`}
                            target="_blank"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-[#0F766E]" />
              Son Kategoriler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                Henüz kategori yok.{" "}
                <Link
                  href="/admin/categories/new"
                  className="text-[#0F766E] hover:underline"
                >
                  İlk kategoriyi oluşturun
                </Link>
              </p>
            ) : (
              <div className="divide-y divide-border">
                {categories.slice(0, 5).map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-medium text-foreground line-clamp-1">
                        {category.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <StatusBadge status={category.status} />
                        <span className="text-xs text-muted-foreground">
                          {category._count?.products ?? 0} ürün
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {category.status === "published" && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={categoryPath(category.slug)}
                            target="_blank"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
