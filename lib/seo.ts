import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "ABSCİMustafa.com.tr";

export const siteConfig = {
  name: siteName,
  url: siteUrl,
  description:
    "Profesyonel ABS beyni tamiri ve satışı hizmetleri. Tüm marka ve modeller için garantili ABS modül onarımı.",
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
  address:
    process.env.NEXT_PUBLIC_ADDRESS ||
    process.env.ADDRESS ||
    "İvedik Organize Sanayi Bölgesi 1333. Cadde No:113 İvedik / ANKARA",
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
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || `${siteConfig.url}/icon.png`;
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
