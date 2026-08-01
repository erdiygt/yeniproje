import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildPageHref } from "@/lib/pagination";
import { cn } from "@/lib/utils";

interface CatalogPaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
}

export function CatalogPagination({
  basePath,
  currentPage,
  totalPages,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Sayfalandırma"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={buildPageHref(basePath, Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        className={cn(
          "inline-flex h-10 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors",
          currentPage <= 1
            ? "pointer-events-none border-border text-muted-foreground opacity-50"
            : "border-border text-[#101214] hover:border-primary hover:text-primary"
        )}
        rel={currentPage > 1 ? "prev" : undefined}
      >
        <ChevronLeft className="h-4 w-4" />
        Önceki
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildPageHref(basePath, page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors",
            page === currentPage
              ? "border-primary bg-primary text-white"
              : "border-border text-[#101214] hover:border-primary hover:text-primary"
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={buildPageHref(basePath, Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage >= totalPages}
        className={cn(
          "inline-flex h-10 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors",
          currentPage >= totalPages
            ? "pointer-events-none border-border text-muted-foreground opacity-50"
            : "border-border text-[#101214] hover:border-primary hover:text-primary"
        )}
        rel={currentPage < totalPages ? "next" : undefined}
      >
        Sonraki
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

interface PaginationSeoLinksProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  siteUrl: string;
}

export function PaginationSeoLinks({
  basePath,
  currentPage,
  totalPages,
  siteUrl,
}: PaginationSeoLinksProps) {
  if (totalPages <= 1) return null;

  return (
    <>
      {currentPage > 1 && (
        <link
          rel="prev"
          href={`${siteUrl}${buildPageHref(basePath, currentPage - 1)}`}
        />
      )}
      {currentPage < totalPages && (
        <link
          rel="next"
          href={`${siteUrl}${buildPageHref(basePath, currentPage + 1)}`}
        />
      )}
    </>
  );
}
