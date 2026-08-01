import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { categoryPath } from "@/lib/catalog-paths";
import type { Category, Product } from "@/types";

interface HomeCatalogSectionProps {
  categories: Category[];
  products: Product[];
}

export function HomeCatalogSection({
  categories,
  products,
}: HomeCatalogSectionProps) {
  if (categories.length === 0 && products.length === 0) {
    return null;
  }

  const visibleCategories = categories.slice(0, 10);

  return (
    <section
      className="bg-[#F7F9FC] py-12 sm:py-16 lg:py-20"
      aria-labelledby="home-catalog-heading"
    >
      <div className="container-site">
        <div className="mb-8 text-center sm:mb-10">
          <h2
            id="home-catalog-heading"
            className="font-display text-2xl font-bold text-[#101214] sm:text-3xl lg:text-4xl"
          >
            Ürünlerimiz
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Tüm ABS beyni modelleri
          </p>
        </div>

        {categories.length > 0 && (
          <div className="-mx-4 mb-8 sm:-mx-0 sm:mb-10">
            <div
              className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:px-0"
              role="list"
              aria-label="Ürün kategorileri"
            >
              <Link
                href="/urunler"
                role="listitem"
                className="shrink-0 rounded-full bg-[#165FC7] px-5 py-2.5 font-text text-sm font-semibold text-white transition-colors hover:bg-[#124DA3]"
              >
                Tümü
              </Link>
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  href={categoryPath(category.slug)}
                  role="listitem"
                  className="shrink-0 rounded-full bg-white px-5 py-2.5 font-text text-sm font-medium text-[#101214] shadow-[0_1px_3px_rgba(16,18,20,0.08)] transition-colors hover:bg-[#EBF2FF] hover:text-[#165FC7]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/urunler"
                className="inline-flex items-center justify-center rounded-full border border-[#165FC7] px-6 py-3 font-text text-sm font-semibold text-[#165FC7] transition-colors hover:bg-[#165FC7] hover:text-white"
              >
                Tüm Ürünleri Gör
              </Link>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Henüz yayınlanmış ürün bulunmuyor.
          </p>
        )}
      </div>
    </section>
  );
}
