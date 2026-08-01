"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
} from "@/services/blog.service";
import {
  SLUG_ERROR_MESSAGE,
  SLUG_PATTERN,
  assertAllowedMediaUrls,
} from "@/lib/catalog-validation";
import { isReservedRootSlug } from "@/lib/catalog-paths";
import type { PostFormData } from "@/types";

function hasTextContent(value: string): boolean {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

function normalizeOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

const postDataSchema = z.object({
  title: z.string().trim().min(1, "Başlık gereklidir").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug gereklidir")
    .max(200)
    .regex(SLUG_PATTERN, SLUG_ERROR_MESSAGE),
  excerpt: z.string().optional(),
  content: z
    .string()
    .min(1, "İçerik gereklidir")
    .refine(hasTextContent, { message: "İçerik gereklidir" }),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
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

function validatePostData(data: PostFormData) {
  const normalized: PostFormData = {
    title: data.title.trim(),
    slug: data.slug.trim().toLowerCase(),
    content: data.content,
    excerpt: normalizeOptional(data.excerpt),
    coverImage: normalizeOptional(data.coverImage),
    category: normalizeOptional(data.category),
    author: normalizeOptional(data.author),
    status: data.status,
    publishedAt: normalizeOptional(data.publishedAt),
    seoTitle: normalizeOptional(data.seoTitle),
    seoDescription: normalizeOptional(data.seoDescription),
  };

  if (normalized.status === "published" && !normalized.publishedAt) {
    normalized.publishedAt = new Date().toISOString();
  }

  const result = postDataSchema.safeParse(normalized);
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

  assertAllowedMediaUrls([result.data.coverImage]);

  return result.data;
}

function revalidateBlogPaths(slug?: string | null, previousSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");

  for (const value of new Set(
    [slug, previousSlug].filter((item): item is string => Boolean(item))
  )) {
    revalidatePath(`/blog/${value}`);
  }
}

function mapPrismaBlogError(error: unknown): never {
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

export async function createBlogPost(data: PostFormData) {
  await requireAuth();
  const validated = validatePostData(data);
  try {
    const post = await createPost(validated);
    revalidateBlogPaths(post.slug);
    return post;
  } catch (error) {
    mapPrismaBlogError(error);
  }
}

export async function updateBlogPost(id: string, data: PostFormData) {
  await requireAuth();
  if (!id?.trim()) {
    throw new Error("Geçersiz form verisi.");
  }

  const existing = await getPostById(id);
  if (!existing) {
    throw new Error("Yazı bulunamadı.");
  }

  const validated = validatePostData(data);
  try {
    const post = await updatePost(id, validated);
    revalidateBlogPaths(post.slug, existing.slug);
    return post;
  } catch (error) {
    mapPrismaBlogError(error);
  }
}

export async function deleteBlogPost(id: string) {
  await requireAuth();
  if (!id?.trim()) {
    throw new Error("Geçersiz form verisi.");
  }

  const existing = await getPostById(id);
  if (!existing) {
    throw new Error("Yazı bulunamadı.");
  }

  await deletePost(id);
  revalidateBlogPaths(existing.slug);
}
