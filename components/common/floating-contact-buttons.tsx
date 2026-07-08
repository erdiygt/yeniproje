"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";

const buttonBase =
  "relative z-10 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(16,18,20,0.18)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

function FloatingActionButton({
  href,
  ariaLabel,
  className,
  target,
  rel,
  children,
}: {
  href: string;
  ariaLabel: string;
  className: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
      className={cn(buttonBase, className)}
    >
      {children}
    </a>
  );
}

export function FloatingContactButtons() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`;
  const phoneUrl = `tel:${siteConfig.phone}`;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6"
      aria-label="Hızlı iletişim"
    >
      <FloatingActionButton
        href={phoneUrl}
        ariaLabel="Telefon ile ara"
        className="bg-[#165FC7] text-white hover:bg-[#124DA3] focus-visible:ring-[#165FC7]"
      >
        <Phone className="h-6 w-6" strokeWidth={2} />
      </FloatingActionButton>

      <FloatingActionButton
        href={whatsappUrl}
        ariaLabel="WhatsApp ile iletişime geç"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white hover:bg-[#20BD5A] focus-visible:ring-[#25D366]"
      >
        <Image
          src="/icons/whatsapp.svg"
          alt=""
          width={26}
          height={26}
          className="brightness-0 invert"
          aria-hidden="true"
        />
      </FloatingActionButton>
    </div>
  );
}
