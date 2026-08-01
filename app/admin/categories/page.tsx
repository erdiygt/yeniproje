import Link from "next/link";
import { getAllCategories } from "@/services/category.service";
import { CategoryList } from "@/components/admin/category-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101214]">
            Kategoriler
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ürün kategorilerini yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kategori
          </Link>
        </Button>
      </div>

      <CategoryList categories={categories} />
    </div>
  );
}
