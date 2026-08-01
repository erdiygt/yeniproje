import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.abscimustafa.com.tr"
).replace(/\/$/, "");
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "ABSCİMustafa.com.tr";
const defaultAddress =
  "İvedik Organize Sanayi Bölgesi 1333. Cadde No:113 İvedik / ANKARA";

const address =
  process.env.NEXT_PUBLIC_ADDRESS ||
  process.env.ADDRESS ||
  defaultAddress;

const mapsEmbedOverride =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL?.trim() || "";

function resolveMapsEmbedUrl(addressValue: string, override: string): string {
  const fallback = `https://maps.google.com/maps?q=${encodeURIComponent(addressValue)}&hl=tr&z=16&output=embed`;
  if (!override) return fallback;

  try {
    const parsed = new URL(override);
    const allowedHosts = new Set([
      "www.google.com",
      "maps.google.com",
      "google.com",
    ]);
    if (!allowedHosts.has(parsed.hostname)) return fallback;
    if (parsed.protocol !== "https:") return fallback;
    if (
      parsed.hostname === "www.google.com" &&
      !parsed.pathname.startsWith("/maps")
    ) {
      return fallback;
    }
    return override;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: siteName,
  url: siteUrl,
  description:
    "ABS beyni tamiri ve satış konusunda sektörün lider firması abscimustafa.com.tr'den profesyonel destek alın.",
  phone:
    process.env.NEXT_PUBLIC_PHONE ||
    process.env.PHONE ||
    "+90 543 654 26 70",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP ||
    process.env.WHATSAPP ||
    "+90 543 654 26 70",
  email:
    process.env.NEXT_PUBLIC_EMAIL ||
    process.env.EMAIL ||
    "bilgi@abscimustafa.com.tr",
  address,
  mapsEmbedUrl: resolveMapsEmbedUrl(address, mapsEmbedOverride),
  locale: "tr_TR",
  twitterHandle: "@abscimustafa",
};

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  /** Use title as-is without appending site name */
  absoluteTitle?: boolean;
}

export function generateSEO({
  title,
  description,
  image,
  noIndex = false,
  canonical,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  absoluteTitle = false,
}: SEOProps = {}): Metadata {
  const pageTitle = absoluteTitle && title
    ? title
    : title
      ? `${title} | ${siteConfig.name}`
      : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || `${siteConfig.url}/og-image.jpg`;
  const pageUrl = canonical || siteConfig.url;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: siteConfig.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
