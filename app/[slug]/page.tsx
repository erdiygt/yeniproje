import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateSEO, siteConfig } from "@/lib/seo";
import { CategoryArchive, buildCategoryMetadataFields } from "@/components/catalog/category-archive";
import { ProductDetail } from "@/components/catalog/product-detail";
import { isReservedRootSlug } from "@/lib/catalog-paths";
import {
  getCategoryBySlugSafe,
  getPublishedCategoriesSafe,
  getPublishedProductsSafe,
  getProductBySlugSafe,
} from "@/lib/catalog-data";
import { parsePageParam } from "@/lib/pagination";

interface CatalogSlugPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const [categories, products] = await Promise.all([
    getPublishedCategoriesSafe(),
    getPublishedProductsSafe(),
  ]);

  const slugs = new Set<string>();

  for (const category of categories) {
    if (!isReservedRootSlug(category.slug)) {
      slugs.add(category.slug);
    }
  }

  for (const product of products) {
    if (!isReservedRootSlug(product.slug)) {
      slugs.add(product.slug);
    }
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: CatalogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const page = parsePageParam(query.page);

  if (isReservedRootSlug(slug)) {
    return generateSEO({ title: "Sayfa Bulunamadı", noIndex: true });
  }

  const category = await getCategoryBySlugSafe(slug);
  if (category?.status === "published") {
    return generateSEO(buildCategoryMetadataFields(category, page));
  }

  const product = await getProductBySlugSafe(slug);
  if (product?.status === "published") {
    return generateSEO({
      title: product.seoTitle || product.title,
      description:
        product.seoDescription || product.shortDescription || undefined,
      image: product.coverImage || undefined,
      canonical: `${siteConfig.url}/${product.slug}`,
    });
  }

  return generateSEO({ title: "Sayfa Bulunamadı", noIndex: true });
}

export default async function CatalogSlugPage({
  params,
  searchParams,
}: CatalogSlugPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  if (isReservedRootSlug(slug)) {
    notFound();
  }

  const category = await getCategoryBySlugSafe(slug);
  if (category?.status === "published") {
    return <CategoryArchive category={category} pageParam={query.page} />;
  }

  const product = await getProductBySlugSafe(slug);
  if (product?.status === "published") {
    return <ProductDetail product={product} />;
  }

  notFound();
}
