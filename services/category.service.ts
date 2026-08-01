import { prisma } from "@/lib/prisma";
import type { Category, CategoryFormData } from "@/types";

function mapCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: { products: number };
}): Category {
  return {
    ...category,
    status: category.status as Category["status"],
  };
}

export async function getPublishedCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: { status: "published" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return categories.map(mapCategory);
}

export async function getAllCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return categories.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });
  return category ? mapCategory(category) : null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  return category ? mapCategory(category) : null;
}

export async function createCategory(data: CategoryFormData): Promise<Category> {
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      content: data.content || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      status: data.status,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return mapCategory(category);
}

export async function updateCategory(
  id: string,
  data: CategoryFormData
): Promise<Category> {
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      content: data.content || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      status: data.status,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return mapCategory(category);
}

export async function deleteCategory(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } });
}
