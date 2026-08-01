import { siteConfig } from "@/lib/seo";
import { productPath } from "@/lib/catalog-paths";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "İvedik Organize Sanayi Bölgesi 1333. Cadde No:113",
      addressLocality: "Ankara",
      addressRegion: "Ankara",
      postalCode: "06378",
      addressCountry: "TR",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getBlogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  coverImage?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
  modifiedAt?: Date | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${siteConfig.url}/blog/${post.slug}`,
    image: post.coverImage || `${siteConfig.url}/og-image.jpg`,
    author: {
      "@type": "Person",
      name: post.author || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.png`,
      },
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: (post.modifiedAt || post.publishedAt)?.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

export function getFAQSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Product JSON-LD — ürün alanlarından otomatik üretilir */
export function getProductSchema(product: {
  title: string;
  slug: string;
  shortDescription?: string | null;
  content?: string | null;
  seoDescription?: string | null;
  coverImage?: string | null;
  gallery?: string[] | null;
  price?: number | null;
  category?: { name: string } | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
}) {
  const url = `${siteConfig.url}${productPath(product.slug)}`;
  const description =
    product.seoDescription?.trim() ||
    product.shortDescription?.trim() ||
    (product.content ? stripHtml(product.content) : "") ||
    product.title;

  const images = [
    product.coverImage,
    ...(product.gallery || []),
  ].filter((image): image is string => Boolean(image));

  const brandName = product.category?.name || siteConfig.name;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: description.slice(0, 5000),
    sku: product.slug,
    url,
    image: images.length > 0 ? images : `${siteConfig.url}/icon.png`,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    itemCondition: "https://schema.org/NewCondition",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  if (product.category?.name) {
    schema.category = product.category.name;
  }

  if (product.publishedAt) {
    schema.releaseDate = product.publishedAt.toISOString();
  }

  if (product.price !== null && product.price !== undefined) {
    schema.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "TRY",
      price: Number(product.price).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        telephone: siteConfig.phone,
      },
    };
  }

  return schema;
}

export function getCollectionPageSchema(page: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.name,
    description: page.description,
    url: page.url,
  };
}

export function getItemListSchema(
  items: { name: string; url: string }[],
  listName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
