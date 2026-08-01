export const RESERVED_CATEGORY_SLUGS = new Set([
  "admin",
  "api",
  "blog",
  "urunler",
  "login",
  "images",
  "brands",
  "fonts",
  "icons",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "icon.png",
  "apple-icon.png",
  "favicon.ico",
  "_next",
]);

export function categoryPath(slug: string): string {
  return `/${slug}`;
}

export function productPath(slug: string): string {
  return `/urunler/${slug}`;
}

export function isReservedCategorySlug(slug: string): boolean {
  return RESERVED_CATEGORY_SLUGS.has(slug.trim().toLowerCase());
}
