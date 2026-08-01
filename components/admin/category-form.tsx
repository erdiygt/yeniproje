"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/actions/category";
import { slugify } from "@/utils/slugify";
import {
  SLUG_ERROR_MESSAGE,
  SLUG_PATTERN,
} from "@/lib/catalog-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { Category } from "@/types";

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gereklidir"),
  slug: z
    .string()
    .min(1, "Slug gereklidir")
    .regex(SLUG_PATTERN, SLUG_ERROR_MESSAGE),
  description: z.string().optional(),
  content: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(["draft", "published"]),
  sortOrder: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      content: category?.content || "",
      seoTitle: category?.seoTitle || "",
      seoDescription: category?.seoDescription || "",
      status: (category?.status as "draft" | "published") || "published",
      sortOrder: String(category?.sortOrder ?? 0),
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setValue("name", newName);
    if (!isEditing) {
      setValue("slug", slugify(newName));
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        sortOrder: Number(data.sortOrder || 0),
      };
      if (isEditing && category) {
        await updateCategoryAction(category.id, payload);
      } else {
        await createCategoryAction(payload);
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Kategori Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad *</Label>
            <Input id="name" {...register("name")} onChange={handleNameChange} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Kısa Açıklama</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  key={`desc-${category?.id ?? "new"}`}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Kategori kısa açıklamasını yazın..."
                  folder="abscimustafa/categories"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <select
                id="status"
                className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                {...register("status")}
              >
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sıra</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register("sortOrder")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Meta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Başlığı</Label>
            <Input id="seoTitle" {...register("seoTitle")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Açıklaması (meta)</Label>
            <Textarea
              id="seoDescription"
              rows={3}
              {...register("seoDescription")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uzun SEO Metni</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Bu içerik kategori sayfasında ürün listesinin altında gösterilir.
          </p>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                key={`content-${category?.id ?? "new"}`}
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Uzun SEO metnini yazın..."
                folder="abscimustafa/categories"
              />
            )}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Kaydediliyor..."
            : isEditing
              ? "Güncelle"
              : "Oluştur"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
      </div>
    </form>
  );
}
