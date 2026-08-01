/** URL-safe slug: lowercase letters, digits, single hyphens between segments */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const SLUG_ERROR_MESSAGE =
  "Slug yalnızca küçük harf, rakam ve tire içerebilir (örn. abs-beyni-bmw).";

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug.trim());
}

const ALLOWED_IMAGE_HOSTS = new Set(["res.cloudinary.com", "abscim.com", "www.abscim.com"]);

/**
 * Accepts empty, site-relative (/...), Cloudinary, or legacy abscim.com upload URLs.
 */
export function isAllowedMediaUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return !trimmed.includes("\\");
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return false;
    if (!ALLOWED_IMAGE_HOSTS.has(parsed.hostname)) return false;
    if (
      parsed.hostname === "abscim.com" ||
      parsed.hostname === "www.abscim.com"
    ) {
      return parsed.pathname.startsWith("/wp-content/uploads/");
    }
    return true;
  } catch {
    return false;
  }
}

export function assertAllowedMediaUrls(urls: (string | undefined | null)[]): void {
  for (const url of urls) {
    if (!url?.trim()) continue;
    if (!isAllowedMediaUrl(url)) {
      throw new Error(
        "Görsel URL'si yalnızca Cloudinary veya onaylı kaynaklardan olabilir."
      );
    }
  }
}
