"use client";

import Image from "next/image";
import { Phone, Mail, MapPin, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  label: string;
  value: string;
  href?: string | null;
  isWhatsApp?: boolean;
  icon?: LucideIcon;
}

function ContactCard({
  label,
  value,
  href,
  isWhatsApp,
  icon: Icon,
}: ContactCardProps) {
  const cardClass = cn(
    "flex items-center gap-3.5 rounded-xl border border-[#ECEEF1] bg-white px-4 py-4 transition-colors sm:px-5 sm:py-4",
    href && "hover:border-[#D0D5DD]"
  );

  const content = (
    <>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          isWhatsApp ? "bg-[#25D366]" : "bg-[#F4F6F8]"
        )}
      >
        {isWhatsApp ? (
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={16}
            height={16}
            className="brightness-0 invert"
            aria-hidden="true"
          />
        ) : Icon ? (
          <Icon className="h-4 w-4 text-[#101214]" strokeWidth={1.75} />
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="font-text text-[11px] text-[#6B7280]">{label}</p>
        <p className="font-text text-sm font-medium leading-snug text-[#101214] break-words">
          {value}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={isWhatsApp ? "_blank" : undefined}
        rel={isWhatsApp ? "noopener noreferrer" : undefined}
        className={cardClass}
        aria-label={`${label}: ${value}`}
      >
        {content}
      </a>
    );
  }

  return <div className={cardClass}>{content}</div>;
}

export function ContactSection() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`;
  const mapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d385395.5590093089!2d28.682534!3d41.00527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzE5LjAiTiAyOMKwNDAnNTcuMSJF!5e0!3m2!1str!2str!4v1234567890";

  const contactItems: ContactCardProps[] = [
    {
      icon: Phone,
      label: "Telefon",
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone}`,
    },
    {
      label: "WhatsApp",
      value: siteConfig.whatsapp,
      href: whatsappUrl,
      isWhatsApp: true,
    },
    {
      icon: MapPin,
      label: "Adres",
      value: siteConfig.address,
      href: null,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
  ];

  return (
    <section
      id="iletisim"
      className="scroll-mt-[72px] bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="contact-heading"
    >
      <div className="container-site">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center sm:mb-12">
            <SectionHeading id="contact-heading" className="text-xl sm:text-2xl lg:text-3xl">
              İletişim
            </SectionHeading>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {contactItems.map((item) => (
                <ContactCard key={item.label} {...item} />
              ))}
            </div>

            <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-[#ECEEF1] sm:min-h-[300px] lg:min-h-[340px]">
              <iframe
                src={mapsUrl}
                title="Konum haritası"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
