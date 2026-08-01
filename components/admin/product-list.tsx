"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteProductAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/utils/format-date";
import { formatPrice } from "@/utils/format-price";
import type { Product } from "@/types";
import { Edit, Eye, Trash2 } from "lucide-react";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`"${title}" ürününü silmek istediğinize emin misiniz?`)) {
      return;
    }

    startTransition(async () => {
      await deleteProductAction(id);
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Henüz ürün yok.</p>
        <Button asChild>
          <Link href="/admin/products/new">İlk Ürünü Oluştur</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              Ürün
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
              Kategori
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 hidden md:table-cell">
              Fiyat
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
              Durum
            </th>
            <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
              <td className="px-6 py-4">
                <p className="font-medium text-foreground text-sm">{product.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">/{product.slug}</p>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                {product.category?.name || "—"}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                {formatPrice(product.price)}
              </td>
              <td className="px-6 py-4 hidden sm:table-cell">
                <span
                  className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                    product.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {product.status === "published" ? "Yayında" : "Taslak"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  {product.status === "published" && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/urunler/${product.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.id, product.title)}
                    disabled={isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
