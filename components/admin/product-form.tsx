"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/product";
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
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { GalleryUploadField } from "@/components/admin/gallery-upload-field";
import type { Category, Product } from "@/types";

const productSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  slug: z
    .string()
    .min(1, "Slug gereklidir")
    .regex(SLUG_PATTERN, SLUG_ERROR_MESSAGE),
  shortDescription: z.string().optional(),
  content: z
    .string()
    .min(1, "İçerik gereklidir")
    .refine(
      (value) =>
        value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0,
      { message: "İçerik gereklidir" }
    ),
  coverImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  price: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || "",
      slug: product?.slug || "",
      shortDescription: product?.shortDescription || "",
      content: product?.content || "",
      coverImage: product?.coverImage || "",
      gallery: product?.gallery || [],
      price:
        product?.price === null || product?.price === undefined
          ? ""
          : String(product.price),
      categoryId: product?.categoryId || "",
      status: (product?.status as "draft" | "published") || "draft",
      publishedAt: product?.publishedAt
        ? new Date(product.publishedAt).toISOString().slice(0, 16)
        : "",
      seoTitle: product?.seoTitle || "",
      seoDescription: product?.seoDescription || "",
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (!isEditing) {
      setValue("slug", slugify(newTitle));
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        categoryId: data.categoryId || undefined,
        gallery: data.gallery || [],
      };

      if (isEditing && product) {
        await updateProductAction(product.id, payload);
      } else {
        await createProductAction(payload);
      }
      router.push("/admin/products");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İçerik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  onChange={handleTitleChange}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" {...register("slug")} />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Kısa Açıklama</Label>
                <Textarea
                  id="shortDescription"
                  rows={3}
                  {...register("shortDescription")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Uzun Açıklama *</Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      key={product?.id ?? "new-product"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Başlığı</Label>
                <Input id="seoTitle" {...register("seoTitle")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Açıklaması</Label>
                <Textarea
                  id="seoDescription"
                  rows={3}
                  {...register("seoDescription")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yayın</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <select
                  id="status"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  {...register("status")}
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishedAt">Yayın Tarihi</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  {...register("publishedAt")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori</Label>
                <select
                  id="categoryId"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                  {...register("categoryId")}
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (TRY)</Label>
                <Input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  placeholder="Boş bırakılırsa: Fiyat sorun"
                  {...register("price")}
                />
              </div>

              <div className="space-y-2">
                <Label>Kapak Görseli</Label>
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      folder="abscimustafa/products"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Galeri</Label>
                <Controller
                  name="gallery"
                  control={control}
                  render={({ field }) => (
                    <GalleryUploadField
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading
                    ? "Kaydediliyor..."
                    : isEditing
                      ? "Güncelle"
                      : "Oluştur"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  İptal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
