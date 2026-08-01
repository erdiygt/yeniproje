import { notFound } from "next/navigation";
import { getAllCategories } from "@/services/category.service";
import { getProductById } from "@/services/product.service";
import { ProductForm } from "@/components/admin/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#101214] mb-8">
        Ürün Düzenle
      </h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
