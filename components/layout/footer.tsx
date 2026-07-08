import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/lib/seo";
import { getPublishedPostsSafe } from "@/lib/blog-data";

const quickLinks = [
  { label: "Hakkımızda", href: "/#hakkimizda" },
  { label: "SSS", href: "/#sss" },
  { label: "İletişim", href: "/#iletisim" },
  { label: "Blog", href: "/blog" },
];

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-[#101214]">
      {children}
    </h3>
  );
}

function SocialIconButton({
  href,
  label,
  children,
  variant = "default",
}: {
  href: string;
  label: string;
  children: ReactNode;
  variant?: "default" | "whatsapp";
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={
        variant === "whatsapp"
          ? "flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#20BD5A]"
          : "flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-[#374151] transition-colors hover:bg-[#E5E7EB] hover:text-[#101214]"
      }
    >
      {children}
    </a>
  );
}

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`;
  const latestPosts = await getPublishedPostsSafe(3);

  return (
    <footer className="relative" role="contentinfo">
      <div className="container-site relative z-10">
        <div className="mx-auto max-w-4xl mt-12 sm:mt-16 lg:mt-20 -mb-10 sm:-mb-12 lg:-mb-14">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[28px] bg-white px-6 py-7 shadow-[0_8px_40px_rgba(16,18,20,0.08)] sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:rounded-[32px] lg:px-10 lg:py-9">
            <h2 className="font-display text-[20px] font-bold leading-tight text-[#101214] sm:text-[26px] lg:max-w-md lg:text-[28px]">
              ABS beyni tamiri için güvenilir adres.
            </h2>

            <div className="flex shrink-0 flex-col items-start gap-1.5 lg:items-end">
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#165FC7] px-6 font-text text-sm font-semibold text-white transition-colors hover:bg-[#124DA3]"
              >
                <Phone className="h-4 w-4" strokeWidth={2} />
                Hemen Ara
              </a>
              <p className="font-text text-[11px] text-[#6B7280] lg:text-right">
                WhatsApp ve telefon ile hızlı ulaşın.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#EEF3FF] pb-12 pt-20 sm:pb-14 sm:pt-24 lg:pb-16 lg:pt-28">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.9fr_0.9fr_1fr] lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <Logo className="mb-4" />
              <FooterHeading>Hakkımızda</FooterHeading>
              <p className="max-w-md font-text text-sm leading-relaxed text-[#374151] lg:max-w-none">
                Yılların deneyimi ve uzman kadromuzla ABS beyni tamiri ve satışı
                alanında güvenilir hizmet sunuyoruz. Tüm marka ve modeller için
                garantili onarım sağlıyoruz.
              </p>
            </div>

            <div>
              <FooterHeading>Hızlı Bağlantılar</FooterHeading>
              <ul className="space-y-2.5">
                {quickLinks.map((link, index) => (
                  <li key={`quick-${index}`}>
                    <Link
                      href={link.href}
                      className="font-text text-[13px] leading-snug text-[#374151] transition-colors hover:text-[#101214]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <FooterHeading>Son Yazılar</FooterHeading>
              {latestPosts.length > 0 ? (
                <ul className="space-y-2.5">
                  {latestPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-text text-[13px] leading-snug text-[#374151] transition-colors hover:text-[#101214] line-clamp-2"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-text text-[13px] text-[#6B7280]">
                  Henüz yayınlanmış yazı yok.
                </p>
              )}
              <Link
                href="/blog"
                className="mt-4 inline-block font-text text-[13px] font-medium text-[#165FC7] transition-colors hover:text-[#124DA3]"
              >
                Tüm yazılar →
              </Link>
            </div>

            <div>
              <FooterHeading>İletişim</FooterHeading>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-start gap-2.5 font-text text-[13px] text-[#374151] transition-colors hover:text-[#101214]"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{siteConfig.phone}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-start gap-2.5 font-text text-[13px] text-[#374151] transition-colors hover:text-[#101214]"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{siteConfig.email}</span>
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-2.5 font-text text-[13px] text-[#374151]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{siteConfig.address}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] bg-white">
        <div className="container-site flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:py-6">
          <div className="flex flex-wrap items-center gap-3">
            <SocialIconButton href={whatsappUrl} label="WhatsApp" variant="whatsapp">
              <Image
                src="/icons/whatsapp.svg"
                alt=""
                width={16}
                height={16}
                className="brightness-0 invert"
                aria-hidden="true"
              />
            </SocialIconButton>
            <SocialIconButton href={`tel:${siteConfig.phone}`} label="Telefon">
              <Phone className="h-4 w-4" strokeWidth={1.75} />
            </SocialIconButton>
            <SocialIconButton href={`mailto:${siteConfig.email}`} label="E-posta">
              <Mail className="h-4 w-4" strokeWidth={1.75} />
            </SocialIconButton>
          </div>

          <p className="font-text text-xs text-[#6B7280] sm:text-right">
            © {currentYear} abscimustafa.com.tr
          </p>
        </div>
      </div>
    </footer>
  );
}
