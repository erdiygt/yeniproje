import Link from "next/link";

export const brandName = "ABSCİMustafa.com.tr";
export const brandNameShort = "ABSCİ";
export const brandNameDomain = "Mustafa.com.tr";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  weight?: "bold" | "semibold" | "medium";
  /** Mobilde üst/alt satır; masaüstünde tek satır */
  layout?: "responsive" | "stacked" | "inline";
}

export function Logo({
  className = "",
  variant = "default",
  weight = "bold",
  layout = "responsive",
}: LogoProps) {
  const textColor = variant === "white" ? "text-white" : "text-[#101214]";
  const subtextColor =
    variant === "white" ? "text-white/80" : "text-[#101214]";
  const weightClass =
    weight === "medium"
      ? "font-medium"
      : weight === "semibold"
        ? "font-semibold"
        : "font-bold";

  const showStacked = layout === "stacked" || layout === "responsive";
  const showInline = layout === "inline" || layout === "responsive";

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className}`}
      aria-label="Ana Sayfa"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary lg:h-9 lg:w-9 lg:rounded-lg">
        <span className={`font-display text-sm ${weightClass} text-white`}>
          ABS
        </span>
      </div>

      {showStacked && (
        <div
          className={`flex flex-col leading-none ${
            layout === "responsive" ? "lg:hidden" : ""
          }`}
        >
          <span
            className={`font-display text-[10px] font-bold uppercase tracking-[0.14em] ${subtextColor}`}
          >
            {brandNameShort}
          </span>
          <span
            className={`font-display -mt-0.5 text-[18px] font-medium tracking-tight ${textColor}`}
          >
            {brandNameDomain}
          </span>
        </div>
      )}

      {showInline && (
        <span
          className={`font-display text-base ${weightClass} tracking-tight ${textColor} sm:text-lg ${
            layout === "responsive" ? "hidden lg:block" : ""
          }`}
        >
          {brandName}
        </span>
      )}
    </Link>
  );
}
