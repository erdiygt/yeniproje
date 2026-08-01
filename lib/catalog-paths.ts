export const RESERVED_ROOT_SLUGS = new Set([
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

/** @deprecated Use RESERVED_ROOT_SLUGS / isReservedRootSlug */
export const RESERVED_CATEGORY_SLUGS = RESERVED_ROOT_SLUGS;

export function categoryPath(slug: string): string {
  return `/${slug}`;
}

export function productPath(slug: string): string {
  return `/${slug}`;
}

export function isReservedRootSlug(slug: string): boolean {
  return RESERVED_ROOT_SLUGS.has(slug.trim().toLowerCase());
}

/** @deprecated Use isReservedRootSlug */
export function isReservedCategorySlug(slug: string): boolean {
  return isReservedRootSlug(slug);
}
