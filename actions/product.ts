"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/services/product.service";
import {
  SLUG_ERROR_MESSAGE,
  SLUG_PATTERN,
  assertAllowedMediaUrls,
} from "@/lib/catalog-validation";
import type { ProductFormData } from "@/types";

function hasTextContent(value: string): boolean {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

function normalizeOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

const productDataSchema = z.object({
  title: z.string().trim().min(1, "Başlık gereklidir").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug gereklidir")
    .max(200)
    .regex(SLUG_PATTERN, SLUG_ERROR_MESSAGE),
  shortDescription: z.string().optional(),
  content: z
    .string()
    .min(1, "İçerik gereklidir")
    .refine(hasTextContent, { message: "İçerik gereklidir" }),
  coverImage: z.string().optional(),
  gallery: z.array(z.string().min(1)).optional(),
  price: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Bu işlem için yetkiniz bulunmuyor.");
  }
  return session;
}

function validateProductData(data: ProductFormData) {
  const normalized: ProductFormData = {
    title: data.title.trim(),
    slug: data.slug.trim().toLowerCase(),
    shortDescription: normalizeOptional(data.shortDescription),
    content: data.content,
    coverImage: normalizeOptional(data.coverImage),
    gallery: (data.gallery ?? []).filter((url) => url.trim().length > 0),
    price: normalizeOptional(data.price),
    categoryId: normalizeOptional(data.categoryId),
    status: data.status,
    publishedAt: normalizeOptional(data.publishedAt),
    seoTitle: normalizeOptional(data.seoTitle),
    seoDescription: normalizeOptional(data.seoDescription),
  };

  if (normalized.status === "published" && !normalized.publishedAt) {
    normalized.publishedAt = new Date().toISOString();
  }

  const result = productDataSchema.safeParse(normalized);
  if (!result.success) {
    const slugIssue = result.error.issues.find((issue) => issue.path[0] === "slug");
    throw new Error(
      slugIssue?.message ||
        "Geçersiz form verisi. Lütfen zorunlu alanları kontrol edin."
    );
  }

  assertAllowedMediaUrls([
    result.data.coverImage,
    ...(result.data.gallery ?? []),
  ]);

  return result.data;
}

function revalidateProductPaths(
  slug?: string | null,
  categorySlug?: string | null,
  previousSlug?: string | null,
  previousCategorySlug?: string | null
) {
  revalidatePath("/");
  revalidatePath("/urunler");
  revalidatePath("/admin/products");

  for (const value of new Set(
    [slug, previousSlug].filter((item): item is string => Boolean(item))
  )) {
    revalidatePath(`/urunler/${value}`);
  }

  for (const value of new Set(
    [categorySlug, previousCategorySlug].filter((item): item is string =>
      Boolean(item)
    )
  )) {
    revalidatePath(`/${value}`);
  }
}

function mapPrismaCatalogError(error: unknown): never {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    const code = (error as { code: string }).code;
    if (code === "P2002") {
      throw new Error("Bu slug zaten kullanılıyor. Lütfen farklı bir slug seçin.");
    }
    if (code === "P2003") {
      throw new Error("Seçilen kategori geçersiz.");
    }
  }
  throw error;
}

export async function createProductAction(data: ProductFormData) {
  await requireAuth();
  const validated = validateProductData(data);
  try {
    const product = await createProduct(validated);
    revalidateProductPaths(product.slug, product.category?.slug);
    return product;
  } catch (error) {
    mapPrismaCatalogError(error);
  }
}

export async function updateProductAction(id: string, data: ProductFormData) {
  await requireAuth();
  if (!id?.trim()) {
    throw new Error("Geçersiz form verisi.");
  }

  const existing = await getProductById(id);
  if (!existing) {
    throw new Error("Ürün bulunamadı.");
  }

  const validated = validateProductData(data);
  try {
    const product = await updateProduct(id, validated);
    revalidateProductPaths(
      product.slug,
      product.category?.slug,
      existing.slug,
      existing.category?.slug
    );
    return product;
  } catch (error) {
    mapPrismaCatalogError(error);
  }
}

export async function deleteProductAction(id: string) {
  await requireAuth();
  if (!id?.trim()) {
    throw new Error("Geçersiz form verisi.");
  }

  const existing = await getProductById(id);
  if (!existing) {
    throw new Error("Ürün bulunamadı.");
  }

  await deleteProduct(id);
  revalidateProductPaths(existing.slug, existing.category?.slug);
}
