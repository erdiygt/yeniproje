export const PRODUCTS_PER_PAGE = 20;

export function parsePageParam(value?: string | string[]): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw || "1", 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return page;
}

export function getTotalPages(totalItems: number, perPage = PRODUCTS_PER_PAGE): number {
  return Math.max(1, Math.ceil(totalItems / perPage));
}

export function buildPageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}page=${page}`;
}

export function buildCanonicalUrl(siteUrl: string, basePath: string, page: number): string {
  const path = buildPageHref(basePath, page);
  return `${siteUrl}${path}`;
}
