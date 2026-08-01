import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { generateSEO, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/catalog/product-card";
import { Breadcrumb } from "@/components/common/breadcrumb";
import {
  CatalogPagination,
  PaginationSeoLinks,
} from "@/components/catalog/catalog-pagination";
import {
  getPublishedCategoriesSafe,
  getPublishedProductsPageSafe,
} from "@/lib/catalog-data";
import { categoryPath, productPath } from "@/lib/catalog-paths";
import {
  PRODUCTS_PER_PAGE,
  buildCanonicalUrl,
  getTotalPages,
  parsePageParam,
} from "@/lib/pagination";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const canonical = buildCanonicalUrl(siteConfig.url, "/urunler", page);
  const title = page > 1 ? `Ürünler - Sayfa ${page}` : "Ürünler";

  return generateSEO({
    title,
    description:
      "ABS beyni ve otomotiv parçaları ürün kataloğu. Tüm marka ve modeller için test edilmiş orijinal parçalar.",
    canonical,
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const requestedPage = parsePageParam(params.page);

  if (params.page === "1") {
    redirect("/urunler");
  }

  const [{ products, total }, categories] = await Promise.all([
    getPublishedProductsPageSafe(requestedPage, PRODUCTS_PER_PAGE),
    getPublishedCategoriesSafe(),
  ]);

  const totalPages = getTotalPages(total);
  const currentPage = Math.min(requestedPage, totalPages);

  if (requestedPage > 1 && (total === 0 || requestedPage > totalPages)) {
    redirect(currentPage === 1 || total === 0 ? "/urunler" : `/urunler?page=${currentPage}`);
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Ürünler", url: `${siteConfig.url}/urunler` },
  ]);

  const itemListSchema = getItemListSchema(
    products.map((product) => ({
      name: product.title,
      url: `${siteConfig.url}${productPath(product.slug)}`,
    })),
    "Ürünler"
  );

  return (
    <>
      <PaginationSeoLinks
        basePath="/urunler"
        currentPage={currentPage}
        totalPages={totalPages}
        siteUrl={siteConfig.url}
      />
      <JsonLd data={[breadcrumbSchema, itemListSchema]} />
      <Header />
      <main className="pt-[72px]">
        <section className="section-padding">
          <div className="container-site">
            <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
              <h1 className="font-display text-2xl font-bold text-[#101214] sm:text-3xl lg:text-4xl">
                Ürünler
              </h1>
              <Breadcrumb
                className="mt-4 justify-center"
                items={[
                  { name: "Ana Sayfa", href: "/" },
                  { name: "Ürünler" },
                ]}
              />
              <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-lg">
                ABS beyni ve yedek parça çözümlerimiz
                {total > 0 && (
                  <span className="mt-1 block text-sm">
                    Toplam {total} ürün
                    {totalPages > 1 ? ` · Sayfa ${currentPage}/${totalPages}` : ""}
                  </span>
                )}
              </p>
            </div>

            {categories.length > 0 && (
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                <Link
                  href="/urunler"
                  className="rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                  Tümü
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={categoryPath(category.slug)}
                    className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-[#101214] transition-colors hover:border-primary hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            {products.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">
                  Henüz yayınlanmış ürün bulunmuyor.
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
                  basePath="/urunler"
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
