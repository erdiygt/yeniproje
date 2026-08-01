import { getAllCategories } from "@/services/category.service";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#101214] mb-8">
        Yeni Ürün
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}
