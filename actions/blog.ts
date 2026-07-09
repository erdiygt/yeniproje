"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  createPost,
  updatePost,
  deletePost,
} from "@/services/blog.service";
import type { PostFormData } from "@/types";

function hasTextContent(value: string): boolean {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

function normalizeOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function logPostPayload(phase: string, data: PostFormData) {
  console.log(`[blog:${phase}]`, {
    title: data.title,
    slug: data.slug,
    content:
      data.content === undefined
        ? undefined
        : data.content === ""
          ? ""
          : data.content,
    contentLength: data.content?.length ?? 0,
    coverImage: data.coverImage,
    excerpt: data.excerpt,
    status: data.status,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    publishedAt: data.publishedAt,
  });
}

const postDataSchema = z.object({
  title: z.string().trim().min(1, "Başlık gereklidir").max(200),
  slug: z.string().trim().min(1, "Slug gereklidir").max(200),
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

function normalizePostData(data: PostFormData): PostFormData {
  const normalized: PostFormData = {
    title: data.title.trim(),
    slug: data.slug.trim(),
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

  return normalized;
}

function validatePostData(data: PostFormData) {
  logPostPayload("incoming", data);

  const normalized = normalizePostData(data);
  const result = postDataSchema.safeParse(normalized);

  if (!result.success) {
    console.error("[blog:validation]", result.error.flatten());
    throw new Error("Geçersiz form verisi. Lütfen zorunlu alanları kontrol edin.");
  }

  logPostPayload("validated", result.data);
  return result.data;
}

export async function createBlogPost(data: PostFormData) {
  await requireAuth();
  const validated = validatePostData(data);
  const post = await createPost(validated);
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath(`/blog/${post.slug}`);
  return post;
}

export async function updateBlogPost(id: string, data: PostFormData) {
  await requireAuth();
  if (!id?.trim()) {
    throw new Error("Geçersiz form verisi.");
  }
  const validated = validatePostData(data);
  const post = await updatePost(id, validated);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  return post;
}

export async function deleteBlogPost(id: string) {
  await requireAuth();
  if (!id?.trim()) {
    throw new Error("Geçersiz form verisi.");
  }
  await deletePost(id);
  revalidatePath("/blog");
  revalidatePath("/");
}
