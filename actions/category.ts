"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "@/services/category.service";
import { getProductBySlug } from "@/services/product.service";
import type { CategoryFormData } from "@/types";
import { isReservedRootSlug } from "@/lib/catalog-paths";
import {
  SLUG_ERROR_MESSAGE,
  SLUG_PATTERN,
} from "@/lib/catalog-validation";

function normalizeOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeHtmlOptional(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  const text = value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  return text ? value : undefined;
}

const categoryDataSchema = z.object({
  name: z.string().trim().min(1, "Kategori adı gereklidir").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug gereklidir")
    .max(200)
    .regex(SLUG_PATTERN, SLUG_ERROR_MESSAGE),
  description: z.string().optional(),
  content: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(["draft", "published"]),
  sortOrder: z.number().int().optional(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Bu işlem için yetkiniz bulunmuyor.");
  }
  return session;
}

function validateCategoryData(data: CategoryFormData) {
  const normalized: CategoryFormData = {
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    description: normalizeHtmlOptional(data.description),
    content: normalizeHtmlOptional(data.content),
    seoTitle: normalizeOptional(data.seoTitle),
    seoDescription: normalizeOptional(data.seoDescription),
    status: data.status,
    sortOrder: data.sortOrder ?? 0,
  };

  const result = categoryDataSchema.safeParse(normalized);
  if (!result.success) {
    const slugIssue = result.error.issues.find((issue) => issue.path[0] === "slug");
    throw new Error(
      slugIssue?.message ||
        "Geçersiz form verisi. Lütfen zorunlu alanları kontrol edin."
    );
  }

  if (isReservedRootSlug(result.data.slug)) {
    throw new Error(
      "Bu slug sistem tarafından kullanılıyor. Lütfen farklı bir slug seçin."
    );
  }

  return result.data;
}

async function assertCategorySlugAvailable(slug: string) {
  const product = await getProductBySlug(slug);
  if (product) {
    throw new Error(
      "Bu slug bir ürün tarafından kullanılıyor. Lütfen farklı bir slug seçin."
    );
  }
}

function revalidateCatalogPaths(
  slug?: string | null,
  previousSlug?: string | null
) {
  revalidatePath("/");
  revalidatePath("/urunler");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");

  for (const value of new Set(
    [slug, previousSlug].filter((item): item is string => Boolean(item))
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
  }
  throw error;
}

export async function createCategoryAction(data: CategoryFormData) {
  await requireAuth();
  const validated = validateCategoryData(data);
  await assertCategorySlugAvailable(validated.slug);
  try {
    const category = await createCategory(validated);
    revalidateCatalogPaths(category.slug);
    return category;
  } catch (error) {
    mapPrismaCatalogError(error);
  }
}

export async function updateCategoryAction(id: string, data: CategoryFormData) {
  await requireAuth();
  if (!id?.trim()) {
    throw new Error("Geçersiz form verisi.");
  }

  const existing = await getCategoryById(id);
  if (!existing) {
    throw new Error("Kategori bulunamadı.");
  }

  const validated = validateCategoryData(data);
  await assertCategorySlugAvailable(validated.slug);
  try {
    const category = await updateCategory(id, validated);
    revalidateCatalogPaths(category.slug, existing.slug);
    return category;
  } catch (error) {
    mapPrismaCatalogError(error);
  }
}

export async function deleteCategoryAction(id: string) {
  await requireAuth();
  if (!id?.trim()) {
    throw new Error("Geçersiz form verisi.");
  }

  const existing = await getCategoryById(id);
  if (!existing) {
    throw new Error("Kategori bulunamadı.");
  }

  await deleteCategory(id);
  revalidateCatalogPaths(existing.slug);
}
