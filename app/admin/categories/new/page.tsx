import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#101214] mb-8">
        Yeni Kategori
      </h1>
      <CategoryForm />
    </div>
  );
}
