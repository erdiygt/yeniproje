import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { getPublishedPostsSafe } from "@/lib/blog-data";
import {
  getPublishedCategoriesSafe,
  getPublishedProductsSafe,
} from "@/lib/catalog-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, products, categories] = await Promise.all([
    getPublishedPostsSafe(),
    getPublishedProductsSafe(),
    getPublishedCategoriesSafe(),
  ]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/urunler/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/urunler`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...categoryEntries,
    ...productEntries,
    ...blogEntries,
  ];
}
