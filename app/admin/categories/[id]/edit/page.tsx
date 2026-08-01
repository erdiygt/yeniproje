import { notFound } from "next/navigation";
import { getCategoryById } from "@/services/category.service";
import { CategoryForm } from "@/components/admin/category-form";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#101214] mb-8">
        Kategori Düzenle
      </h1>
      <CategoryForm category={category} />
    </div>
  );
}
