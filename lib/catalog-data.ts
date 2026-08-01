import {
  getPublishedCategories,
  getCategoryBySlug,
} from "@/services/category.service";
import {
  getPublishedProducts,
  getPublishedProductsByCategory,
  getPublishedProductsByCategoryPage,
  getPublishedProductsPage,
  getProductBySlug,
} from "@/services/product.service";
import type { Category, Product } from "@/types";

export async function getPublishedProductsSafe(
  limit?: number
): Promise<Product[]> {
  try {
    return await getPublishedProducts(limit);
  } catch {
    return [];
  }
}

export async function getPublishedProductsPageSafe(
  page: number,
  perPage: number
): Promise<{ products: Product[]; total: number }> {
  try {
    return await getPublishedProductsPage(page, perPage);
  } catch {
    return { products: [], total: 0 };
  }
}

export async function getPublishedCategoriesSafe(): Promise<Category[]> {
  try {
    return await getPublishedCategories();
  } catch {
    return [];
  }
}

export async function getCategoryBySlugSafe(
  slug: string
): Promise<Category | null> {
  try {
    return await getCategoryBySlug(slug);
  } catch {
    return null;
  }
}

export async function getPublishedProductsByCategorySafe(
  categoryId: string
): Promise<Product[]> {
  try {
    return await getPublishedProductsByCategory(categoryId);
  } catch {
    return [];
  }
}

export async function getPublishedProductsByCategoryPageSafe(
  categoryId: string,
  page: number,
  perPage: number
): Promise<{ products: Product[]; total: number }> {
  try {
    return await getPublishedProductsByCategoryPage(categoryId, page, perPage);
  } catch {
    return { products: [], total: 0 };
  }
}

export async function getProductBySlugSafe(
  slug: string
): Promise<Product | null> {
  try {
    return await getProductBySlug(slug);
  } catch {
    return null;
  }
}
