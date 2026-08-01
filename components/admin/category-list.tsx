"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteCategoryAction } from "@/actions/category";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import { Edit, Trash2 } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) {
      return;
    }

    startTransition(async () => {
      await deleteCategoryAction(id);
    });
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Henüz kategori yok.</p>
        <Button asChild>
          <Link href="/admin/categories/new">İlk Kategoriyi Oluştur</Link>
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
              Kategori
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
              Durum
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3 hidden md:table-cell">
              Ürün
            </th>
            <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-secondary/30 transition-colors">
              <td className="px-6 py-4">
                <p className="font-medium text-foreground text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">/{category.slug}</p>
              </td>
              <td className="px-6 py-4 hidden sm:table-cell">
                <span
                  className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                    category.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {category.status === "published" ? "Yayında" : "Taslak"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                {category._count?.products ?? 0}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id, category.name)}
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
