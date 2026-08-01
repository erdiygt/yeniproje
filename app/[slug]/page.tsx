import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { generateSEO, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema, getCollectionPageSchema, getItemListSchema } from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { ProductCard } from "@/components/catalog/product-card";
import { BlogContent } from "@/components/blog/blog-content";
import {
  CatalogPagination,
  PaginationSeoLinks,
} from "@/components/catalog/catalog-pagination";
import { categoryPath, isReservedCategorySlug } from "@/lib/catalog-paths";
import {
  getCategoryBySlugSafe,
  getPublishedCategoriesSafe,
  getPublishedProductsByCategoryPageSafe,
} from "@/lib/catalog-data";
import {
  PRODUCTS_PER_PAGE,
  buildCanonicalUrl,
  buildPageHref,
  getTotalPages,
  parsePageParam,
} from "@/lib/pagination";

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const categories = await getPublishedCategoriesSafe();
  return categories
    .filter((category) => !isReservedCategorySlug(category.slug))
    .map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const page = parsePageParam(query.page);

  if (isReservedCategorySlug(slug)) {
    return generateSEO({ title: "Sayfa Bulunamadı", noIndex: true });
  }

  const category = await getCategoryBySlugSafe(slug);

  if (!category || category.status !== "published") {
    return generateSEO({ title: "Kategori Bulunamadı", noIndex: true });
  }

  const basePath = categoryPath(category.slug);
  const canonical = buildCanonicalUrl(siteConfig.url, basePath, page);
  const titleBase = category.seoTitle || category.name;

  return generateSEO({
    title: page > 1 ? `${titleBase} - Sayfa ${page}` : titleBase,
    description:
      category.seoDescription ||
      (category.description ? stripHtml(category.description) : undefined) ||
      `${category.name} kategorisindeki ürünler`,
    canonical,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const requestedPage = parsePageParam(query.page);
  const basePath = categoryPath(slug);

  if (isReservedCategorySlug(slug)) {
    notFound();
  }

  if (query.page === "1") {
    redirect(basePath);
  }

  const category = await getCategoryBySlugSafe(slug);

  if (!category || category.status !== "published") {
    notFound();
  }

  const [{ products, total }, categories] = await Promise.all([
    getPublishedProductsByCategoryPageSafe(
      category.id,
      requestedPage,
      PRODUCTS_PER_PAGE
    ),
    getPublishedCategoriesSafe(),
  ]);

  const totalPages = getTotalPages(total);
  const currentPage = Math.min(requestedPage, totalPages);

  if (requestedPage > 1 && (total === 0 || requestedPage > totalPages)) {
    redirect(buildPageHref(basePath, total === 0 ? 1 : currentPage));
  }

  const categoryUrl = buildCanonicalUrl(siteConfig.url, basePath, currentPage);
  const categoryDescription =
    category.seoDescription?.trim() ||
    (category.description ? stripHtml(category.description) : "") ||
    `${category.name} kategorisindeki ürünler`;

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Ürünler", url: `${siteConfig.url}/urunler` },
    {
      name: category.name,
      url: `${siteConfig.url}${basePath}`,
    },
  ];

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const collectionPageSchema = getCollectionPageSchema({
    name:
      currentPage > 1
        ? `${category.name} - Sayfa ${currentPage}`
        : category.name,
    description: categoryDescription,
    url: categoryUrl,
  });

  const itemListSchema = getItemListSchema(
    products.map((product) => ({
      name: product.title,
      url: `${siteConfig.url}/urunler/${product.slug}`,
    })),
    category.name
  );

  return (
    <>
      <PaginationSeoLinks
        basePath={basePath}
        currentPage={currentPage}
        totalPages={totalPages}
        siteUrl={siteConfig.url}
      />
      <JsonLd data={[breadcrumbSchema, collectionPageSchema, itemListSchema]} />
      <Header />
      <main className="pt-[72px]">
        <section className="section-padding">
          <div className="container-site">
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
              <h1 className="font-display text-2xl font-bold text-[#101214] sm:text-3xl lg:text-4xl">
                {category.name}
              </h1>
              <Breadcrumb
                className="mt-4 justify-center"
                items={[
                  { name: "Ana Sayfa", href: "/" },
                  { name: "Ürünler", href: "/urunler" },
                  { name: category.name },
                ]}
              />
              {category.description && currentPage === 1 && (
                <div className="mt-4 text-left sm:mt-5">
                  <BlogContent content={category.description} />
                </div>
              )}
              {total > 0 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Toplam {total} ürün
                  {totalPages > 1 ? ` · Sayfa ${currentPage}/${totalPages}` : ""}
                </p>
              )}
            </div>

            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <Link
                href="/urunler"
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-[#101214] transition-colors hover:border-primary hover:text-primary"
              >
                Tümü
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.id}
                  href={categoryPath(item.slug)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    item.id === category.id
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-[#101214] hover:border-primary hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {products.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">
                  Bu kategoride henüz ürün bulunmuyor.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <CatalogPagination
                  basePath={basePath}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
            )}

            {category.content && currentPage === 1 && (
              <div className="mx-auto mt-14 max-w-[760px] border-t border-[#E5E7EB] pt-10">
                <BlogContent content={category.content} />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
