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

const postDataSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200),
  excerpt: z.string().optional(),
  content: z.string().trim().min(1),
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
  const result = postDataSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Geçersiz form verisi.");
  }
  return result.data;
}

export async function createBlogPost(data: PostFormData) {
  await requireAuth();
  const validated = validatePostData(data);
  const post = await createPost(validated);
  revalidatePath("/blog");
  revalidatePath("/");
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
