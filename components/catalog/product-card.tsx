import Link from "next/link";
import Image from "next/image";
import type { ElementType } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format-price";
import { productPath } from "@/lib/catalog-paths";

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  /** Heading level under page H1 — use h3 inside sections that already have an h2 */
  titleAs?: "h2" | "h3";
}

export function ProductCard({
  product,
  showPrice = true,
  titleAs = "h2",
}: ProductCardProps) {
  const TitleTag = titleAs as ElementType;

  return (
    <article>
      <Link
        href={productPath(product.slug)}
        className="group block overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {product.coverImage ? (
            <Image
              src={product.coverImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="font-display text-lg font-bold text-primary/30">
                ABS
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          {product.category && (
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-primary">
              {product.category.name}
            </span>
          )}
          <TitleTag className="font-display text-lg font-bold text-[#101214] transition-colors group-hover:text-primary line-clamp-2">
            {product.title}
          </TitleTag>
          {product.shortDescription && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
          )}
          {showPrice && (
            <p className="mt-4 font-display text-base font-semibold text-[#101214]">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
