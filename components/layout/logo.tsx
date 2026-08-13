import Image from "next/image";
import Link from "next/link";

export const brandName = "ABSCİMustafa.com.tr";
export const brandNameShort = "ABSCİ";
export const brandNameDomain = "Mustafa.com.tr";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  /** @deprecated Image logo ignores weight */
  weight?: "bold" | "semibold" | "medium";
  /** @deprecated Image logo ignores layout */
  layout?: "responsive" | "stacked" | "inline";
}

export function Logo({ className = "", variant = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex min-w-0 max-w-full items-center ${className}`}
      aria-label="Ana Sayfa"
    >
      <Image
        src="/images/logo.png?v=4"
        alt="ABSCİ Mustafa"
        width={500}
        height={137}
        priority
        unoptimized
        className={
          variant === "white"
            ? "h-11 w-auto max-w-[min(260px,calc(100vw-6rem))] object-contain object-left brightness-0 invert sm:h-11 sm:max-w-none lg:h-12"
            : "h-11 w-auto max-w-[min(260px,calc(100vw-6rem))] object-contain object-left sm:h-11 sm:max-w-none lg:h-12"
        }
      />
    </Link>
  );
}
