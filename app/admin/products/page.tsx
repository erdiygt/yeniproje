import Link from "next/link";
import { getAllProducts } from "@/services/product.service";
import { ProductList } from "@/components/admin/product-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101214]">
            Ürünler
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ürün kataloğunu yönetin
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Ürün
          </Link>
        </Button>
      </div>

      <ProductList products={products} />
    </div>
  );
}
