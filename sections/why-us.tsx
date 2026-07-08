"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package, Wrench, Car } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";

const whyUsItems = [
  {
    title: "Orijinal Ürünler",
    description:
      "ABS beyni tamir ve satışında yalnızca orijinal yedek parça kullanıyoruz. Marka onaylı, uyumlu ve dayanıklı ürünlerle aracınızın güvenliğini ve performansını koruyoruz.",
    link: "#iletisim",
    linkText: "Detaylı Bilgi",
    bgColor: "bg-[#EBF2FF]",
    icon: Package,
    visual: "orijinal",
  },
  {
    title: "Hızlı Teşhis ve Onarım",
    description:
      "Modern test cihazlarımız ile arızayı anında tespit ediyor, en kısa sürede profesyonel onarım hizmeti sunuyoruz. Zaman kaybetmeden aracınıza kavuşun.",
    link: "#iletisim",
    linkText: "Hemen İletişime Geç",
    bgColor: "bg-[#F3E8FF]",
    icon: Wrench,
    visual: "teshis",
  },
  {
    title: "Tüm Marka ve Model Desteği",
    description:
      "BMW, Mercedes, Audi, Volkswagen ve daha birçok markanın ABS modüllerinin tamir ve satışını yapıyoruz. Geniş marka yelpazesi ile her araca uygun çözüm sunuyoruz.",
    link: "#iletisim",
    linkText: "Detaylı Bilgi",
    bgColor: "bg-[#E8F5E9]",
    icon: Car,
    visual: "marka",
  },
];

function FeatureVisual({
  bgColor,
  icon: Icon,
  visual,
}: {
  bgColor: string;
  icon: typeof Package;
  visual: string;
}) {
  return (
    <div
      className={`relative flex aspect-square w-full max-w-[480px] items-center justify-center overflow-hidden rounded-3xl lg:rounded-[32px] ${bgColor} mx-auto lg:mx-0`}
    >
      {visual === "orijinal" && (
        <div className="relative w-[80%] rounded-2xl bg-white p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-sm font-bold text-[#101214]">
              Orijinal Yedek Parça
            </p>
            <span className="rounded-full bg-[#165FC7]/10 px-2.5 py-1 font-text text-[10px] font-bold uppercase tracking-wider text-[#165FC7]">
              OEM
            </span>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#165FC7]/10">
              <Icon className="h-7 w-7 text-[#165FC7]" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-2.5 w-full rounded bg-[#DBEAFE]" />
              <div className="h-2 w-3/4 rounded bg-[#E5E7EB]" />
              <p className="font-text text-[10px] font-semibold text-[#059669]">
                ✓ Orijinal Ürün
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["ABS Modül", "Sensör"].map((label) => (
              <div
                key={label}
                className="rounded-lg bg-[#F3F4F6] px-3 py-2 text-center font-text text-[10px] font-medium text-[#6B7280]"
              >
                {label}
              </div>
            ))}
          </div>
          <span className="absolute -bottom-3 -right-3 rounded-lg bg-[#165FC7] px-3 py-1.5 font-text text-xs font-semibold text-white shadow-md">
            Orijinal
          </span>
        </div>
      )}

      {visual === "teshis" && (
        <div className="relative w-[80%] rounded-2xl bg-white p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-sm font-bold text-[#101214]">
              ABS Teşhis Paneli
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C3AED]/10">
              <Icon className="h-4 w-4 text-[#7C3AED]" />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Arıza Kodu Okuma", status: "Tamamlandı", done: true },
              { label: "Modül Testi", status: "Devam Ediyor", done: false },
              { label: "Onarım Planı", status: "Bekliyor", done: false },
            ].map((step) => (
              <div
                key={step.label}
                className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      step.done ? "bg-[#059669]" : "bg-[#D1D5DB]"
                    }`}
                  />
                  <span className="font-text text-[11px] font-medium text-[#374151]">
                    {step.label}
                  </span>
                </div>
                <span
                  className={`font-text text-[10px] font-semibold ${
                    step.done ? "text-[#059669]" : "text-[#9CA3AF]"
                  }`}
                >
                  {step.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F3E8FF] px-3 py-2.5">
            <span className="font-text text-[11px] font-medium text-[#6B7280]">
              Tahmini süre
            </span>
            <span className="font-display text-sm font-bold text-[#7C3AED]">
              24 Saat
            </span>
          </div>

          <span className="absolute -bottom-3 -right-3 rounded-lg bg-[#7C3AED] px-3 py-1.5 font-text text-xs font-semibold text-white shadow-md">
            Hızlı Teşhis
          </span>
        </div>
      )}

      {visual === "marka" && (
        <div className="relative w-[80%] rounded-2xl bg-white p-5 shadow-lg">
          <p className="mb-4 font-display text-sm font-bold text-[#101214]">
            Desteklenen Markalar
          </p>
          <div className="grid grid-cols-3 gap-3">
            {["BMW", "AUDI", "VW", "FORD", "HONDA", "FIAT"].map((brand) => (
              <div
                key={brand}
                className="flex h-12 items-center justify-center rounded-xl bg-[#F9FAFB] font-text text-[10px] font-bold text-[#6B7280]"
              >
                {brand}
              </div>
            ))}
          </div>
          <span className="absolute -bottom-3 -right-3 rounded-lg bg-[#101214] px-3 py-1.5 font-text text-xs font-semibold text-white shadow-md">
            Tüm Markalar
          </span>
        </div>
      )}
    </div>
  );
}

function FeatureRow({
  item,
  index,
}: {
  item: (typeof whyUsItems)[number];
  index: number;
}) {
  const isReversed = index % 2 === 1;

  const textContent = (
    <div className="flex flex-col items-start text-left">
      <h3 className="font-display text-xl font-bold leading-tight text-[#101214] sm:text-[26px] lg:text-[32px]">
        {item.title}
      </h3>
      <p className="mt-4 max-w-lg font-text text-sm leading-[1.65] text-[#4E1214]/80 sm:text-[17px] lg:mt-5">
        {item.description}
      </p>
      <Link
        href={item.link}
        className="mt-6 inline-flex items-center gap-1.5 font-text text-[15px] font-semibold text-[#165FC7] transition-colors hover:text-[#124DA3] lg:mt-8"
      >
        {item.linkText}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );

  const visual = (
    <FeatureVisual
      bgColor={item.bgColor}
      icon={item.icon}
      visual={item.visual}
    />
  );

  return (
    <motion.div
      className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className={isReversed ? "order-1 lg:order-1" : "order-1 lg:order-2"}>
        {visual}
      </div>
      <div className={isReversed ? "order-2 lg:order-2" : "order-2 lg:order-1"}>
        {textContent}
      </div>
    </motion.div>
  );
}

export function WhyUsSection() {
  return (
    <section
      id="neden-biz"
      className="section-padding scroll-mt-[72px] bg-white"
      aria-labelledby="why-us-heading"
    >
      <div className="container-site">
        <motion.div
          className="mb-16 text-center lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading id="why-us-heading">
            Neden Bizi Tercih Etmelisiniz?
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-2xl font-text text-sm text-[#4E1214]/70 sm:text-lg">
            ABS beyni tamiri konusunda güvenilir ve profesyonel hizmet
          </p>
        </motion.div>

        <div className="flex flex-col gap-20 lg:gap-28">
          {whyUsItems.map((item, index) => (
            <FeatureRow key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
