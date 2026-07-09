import { prisma } from "@/lib/prisma";
import type { Post, PostFormData } from "@/types";

function logPrismaPayload(phase: "create" | "update", data: PostFormData) {
  console.log(`[blog:prisma:${phase}:before]`, {
    title: data.title,
    slug: data.slug,
    content: data.content,
    contentLength: data.content?.length ?? 0,
    coverImage: data.coverImage,
    excerpt: data.excerpt,
    status: data.status,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    publishedAt: data.publishedAt,
  });
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    ...(limit && { take: limit }),
  });
  return posts as Post[];
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return posts as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  return post as Post | null;
}

export async function getPostById(id: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  return post as Post | null;
}

export async function createPost(data: PostFormData): Promise<Post> {
  logPrismaPayload("create", data);

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      category: data.category || null,
      author: data.author || null,
      status: data.status,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });
  return post as Post;
}

export async function updatePost(
  id: string,
  data: PostFormData
): Promise<Post> {
  logPrismaPayload("update", data);

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      category: data.category || null,
      author: data.author || null,
      status: data.status,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });
  return post as Post;
}

export async function deletePost(id: string): Promise<void> {
  await prisma.post.delete({ where: { id } });
}

export async function getRelatedPosts(
  slug: string,
  category: string | null,
  limit = 3
): Promise<Post[]> {
  const sameCategory = category
    ? await prisma.post.findMany({
        where: {
          status: "published",
          slug: { not: slug },
          category,
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
      })
    : [];

  if (sameCategory.length >= limit) {
    return sameCategory as Post[];
  }

  const excludeSlugs = [slug, ...sameCategory.map((post) => post.slug)];

  const additionalPosts = await prisma.post.findMany({
    where: {
      status: "published",
      slug: { notIn: excludeSlugs },
    },
    orderBy: { publishedAt: "desc" },
    take: limit - sameCategory.length,
  });

  return [...sameCategory, ...additionalPosts] as Post[];
}
