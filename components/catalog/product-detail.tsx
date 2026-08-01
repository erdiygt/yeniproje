import Image from "next/image";
import Link from "next/link";
import { Phone, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema, getProductSchema } from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogContent } from "@/components/blog/blog-content";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductCard } from "@/components/catalog/product-card";
import { categoryPath, productPath } from "@/lib/catalog-paths";
import { getRelatedProducts } from "@/services/product.service";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
}

export async function ProductDetail({ product }: ProductDetailProps) {
  let relatedProducts: Product[] = [];
  try {
    relatedProducts = await getRelatedProducts(
      product.slug,
      product.categoryId,
      3
    );
  } catch {
    relatedProducts = [];
  }

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Merhaba, ${product.title} ürünü hakkında bilgi almak istiyorum.`
  )}`;
  const phoneUrl = `tel:${siteConfig.phone}`;

  const productUrl = `${siteConfig.url}${productPath(product.slug)}`;
  const shareTitle = `${product.title} | ${siteConfig.name}`;
  const encodedProductUrl = encodeURIComponent(productUrl);
  const encodedShareTitle = encodeURIComponent(shareTitle);
  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedShareTitle}%20${encodedProductUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedProductUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedShareTitle}&url=${encodedProductUrl}`,
    },
  ];

  const relatedTitle = product.category
    ? `${product.category.name} Kategorisindeki Diğer Ürünler`
    : "Benzer Ürünler";

  const breadcrumbItems = [{ name: "Ana Sayfa", url: siteConfig.url }];

  if (product.category) {
    breadcrumbItems.push({
      name: product.category.name,
      url: `${siteConfig.url}${categoryPath(product.category.slug)}`,
    });
  }

  breadcrumbItems.push({
    name: product.title,
    url: productUrl,
  });

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const productSchema = getProductSchema(product);

  const visualBreadcrumbs = [
    { name: "Ana Sayfa", href: "/" },
    ...(product.category
      ? [
          {
            name: product.category.name,
            href: categoryPath(product.category.slug),
          },
        ]
      : []),
    { name: product.title },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema, productSchema]} />
      <Header />
      <main className="bg-white pt-[72px]">
        <section className="section-padding">
          <div className="container-site">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
              <ProductGallery
                title={product.title}
                coverImage={product.coverImage}
                gallery={product.gallery}
              />

              <div>
                <h1 className="font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#101214] sm:text-[36px]">
                  {product.title}
                </h1>

                <Breadcrumb className="mt-4" items={visualBreadcrumbs} />

                {product.shortDescription && (
                  <p className="mt-4 font-text text-base leading-7 text-[#4B5563]">
                    {product.shortDescription}
                  </p>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 font-semibold text-white transition-colors hover:bg-[#20BD5A]"
                  >
                    <Image
                      src="/icons/whatsapp.svg"
                      alt=""
                      width={18}
                      height={18}
                      className="brightness-0 invert"
                      aria-hidden="true"
                    />
                    WhatsApp İletişim
                  </a>
                  <a
                    href={phoneUrl}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#EBF2FF] px-6 font-semibold text-[#091E42] transition-colors hover:bg-[#DCE6FF]"
                  >
                    <Phone className="h-4 w-4" strokeWidth={2.25} />
                    Tıkla Ara
                  </a>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-[760px] border-t border-[#E5E7EB] pt-10">
              <h2 className="font-display text-xl font-bold text-[#101214]">
                Ürün Açıklaması
              </h2>
              <div className="mt-6">
                <BlogContent content={product.content} />
              </div>

              <section
                aria-labelledby="product-share-heading"
                className="mt-10 rounded-[24px] border border-[#E5E7EB] bg-white p-6 sm:p-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#101214]">
                      <Share2 className="h-4 w-4" strokeWidth={2} />
                      <h2
                        id="product-share-heading"
                        className="font-display text-lg font-bold"
                      >
                        Ürünü Paylaş
                      </h2>
                    </div>
                    <p className="mt-2 font-text text-sm text-[#6B7280]">
                      Bu ürünü sosyal mecralarda kolayca paylaşın.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {shareLinks.map((shareLink) => (
                      <a
                        key={shareLink.label}
                        href={shareLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${shareLink.label} ile paylaş`}
                        className="inline-flex items-center justify-center rounded-full border border-[#D1D5DB] px-4 py-2 font-text text-sm font-medium text-[#101214] transition-colors hover:border-[#165FC7] hover:text-[#165FC7]"
                      >
                        {shareLink.label}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {relatedProducts.length > 0 && (
              <div className="mt-16 border-t border-[#E5E7EB] pt-12">
                <div className="mb-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
                  <h2 className="font-display text-2xl font-bold text-[#101214]">
                    {relatedTitle}
                  </h2>
                  {product.category && (
                    <Link
                      href={categoryPath(product.category.slug)}
                      className="font-text text-sm font-semibold text-[#165FC7] transition-colors hover:text-[#124DA3]"
                    >
                      Tümünü Gör →
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {relatedProducts.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      showPrice={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
