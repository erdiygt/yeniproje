"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";

const heroButtonBase =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-full font-semibold text-[13px] leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-9 px-3 sm:h-[46px] sm:w-auto sm:gap-2.5 sm:px-8 sm:text-[15px]";

export function HeroSection() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`;
  const phoneUrl = `tel:${siteConfig.phone}`;

  return (
    <section
      className="relative bg-white pt-[72px]"
      aria-labelledby="hero-heading"
    >
      <div className="container-site">
        <div className="mx-auto max-w-[1200px] pb-12 pt-12 text-left sm:pb-14 sm:pt-20 sm:text-center lg:pb-16 lg:pt-24">
          <motion.h1
            id="hero-heading"
            className="max-w-[920px] font-display text-[26px] font-bold leading-[1.12] tracking-[-0.02em] text-[#101214] sm:mx-auto sm:text-[52px] sm:leading-[1.08] lg:text-[64px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Profesyonel ABS Beyni
            <br />
            Tamiri ve Satışı
          </motion.h1>

          <motion.p
            className="mt-4 max-w-[640px] font-text text-[14px] font-normal leading-[1.6] text-[#4B5563] sm:mx-auto sm:mt-6 sm:text-[21px] sm:leading-[1.65] lg:mt-8 lg:max-w-[720px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tüm marka ve model araçların ABS Beyni tamir ve satışını yapıyoruz.
            Uzman ekibimiz ve modern ekipmanlarımızla hızlı ve güvenilir hizmet
            sunuyoruz.
          </motion.p>

          <motion.div
            className="mt-8 grid w-full max-w-md grid-cols-2 gap-3 sm:mx-auto sm:mt-10 sm:flex sm:w-auto sm:justify-center sm:gap-4 lg:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp ile iletişime geç"
              className={cn(
                heroButtonBase,
                "bg-[#25D366] text-white hover:bg-[#20BD5A] focus-visible:ring-[#25D366]"
              )}
            >
              <Image
                src="/icons/whatsapp.svg"
                alt=""
                width={18}
                height={18}
                className="h-4 w-4 shrink-0 brightness-0 invert sm:h-[18px] sm:w-[18px]"
                aria-hidden="true"
              />
              WhatsApp
            </a>

            <a
              href={phoneUrl}
              aria-label="Telefon ile ara"
              className={cn(
                heroButtonBase,
                "bg-[#165FC7] text-white hover:bg-[#124DA3] focus-visible:ring-[#165FC7]"
              )}
            >
              <Phone className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
              Telefon Ara
            </a>
          </motion.div>

          <motion.div
            className="relative mt-10 overflow-hidden rounded-2xl bg-[#F3F4F6] shadow-[0_20px_50px_rgba(16,18,20,0.12)] sm:mt-12 lg:mt-14 lg:rounded-[28px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Image
              src="/images/hero.jpg"
              alt="ABS beyni tamiri ve bakım hizmeti"
              width={1024}
              height={682}
              priority
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
