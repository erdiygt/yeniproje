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
        src="/images/logo.png"
        alt="ABSCİ Mustafa ABS Tamiri"
        width={400}
        height={144}
        priority
        className={
          variant === "white"
            ? "h-12 w-full max-w-full object-fill brightness-0 invert sm:h-10 sm:w-auto sm:max-w-none sm:object-contain lg:h-11"
            : "h-12 w-full max-w-full object-fill sm:h-10 sm:w-auto sm:max-w-none sm:object-contain lg:h-11"
        }
      />
    </Link>
  );
}
