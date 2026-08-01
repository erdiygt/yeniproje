import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { getPublishedPostsSafe } from "@/lib/blog-data";
import {
  getPublishedCategoriesSafe,
  getPublishedProductsSafe,
} from "@/lib/catalog-data";
import { isReservedRootSlug } from "@/lib/catalog-paths";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [categories, products, posts] = await Promise.all([
    getPublishedCategoriesSafe(),
    getPublishedProductsSafe(),
    getPublishedPostsSafe(),
  ]);

  const pages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/urunler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((category) => !isReservedRootSlug(category.slug))
    .map((category) => ({
      url: `${siteConfig.url}/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.95,
    }));

  const productEntries: MetadataRoute.Sitemap = products
    .filter((product) => !isReservedRootSlug(product.slug))
    .map((product) => ({
      url: `${siteConfig.url}/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...pages, ...categoryEntries, ...productEntries, ...postEntries];
}
