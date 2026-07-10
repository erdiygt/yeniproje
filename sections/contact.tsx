import Image from "next/image";
import { Phone, Mail, MapPin, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { ContactMap } from "@/components/contact/contact-map";
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

            <ContactMap />
          </div>
        </div>
      </div>
    </section>
  );
}
