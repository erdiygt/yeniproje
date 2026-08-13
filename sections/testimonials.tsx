"use client";

import {
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

const GAP = 24;

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "ABS beyni arızası nedeniyle aracımı getirdim. Çok kısa sürede teşhis koydular ve aynı gün teslim ettiler. Garantili hizmet ve uygun fiyat için teşekkürler.",
    author: "Mehmet Yılmaz",
    role: "BMW 320i Sahibi",
    company: "İstanbul",
  },
  {
    id: "2",
    quote:
      "Başka bir serviste çözülemeyen ABS sorunumu burada hallettiler. Profesyonel yaklaşımları ve şeffaf fiyatlandırmaları çok etkileyiciydi.",
    author: "Ayşe Kaya",
    role: "Mercedes C200 Sahibi",
    company: "Ankara",
  },
  {
    id: "3",
    quote:
      "Yıllardır ABS beyni tamiri konusunda en güvenilir adresimiz. Hem kaliteli işçilik hem de hızlı teslimat. Gönül rahatlığıyla öneririm.",
    author: "Ali Demir",
    role: "Filo Yöneticisi",
    company: "İzmir",
  },
];

const SLIDE_COUNT = testimonials.length;
const extendedSlides = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
];

function HexLogo() {
  return (
    <svg
      width="36"
      height="20"
      viewBox="0 0 36 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M6 2L11 5V11L6 14L1 11V5L6 2Z" fill="#010B2F" />
      <path
        d="M14 2L19 5V11L14 14L9 11V5L14 2Z"
        fill="#010B2F"
        opacity="0.85"
      />
      <path
        d="M22 2L27 5V11L22 14L17 11V5L22 2Z"
        fill="#010B2F"
        opacity="0.7"
      />
    </svg>
  );
}

function TestimonialCard({
  item,
  isActive,
}: {
  item: Testimonial;
  isActive: boolean;
}) {
  return (
    <motion.div
      data-card
      animate={{
        opacity: isActive ? 1 : 0.42,
        scale: isActive ? 1 : 0.96,
        filter: isActive ? "blur(0px)" : "blur(3px)",
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "flex h-full min-h-[360px] w-[min(88vw,860px)] shrink-0 flex-col items-center justify-center rounded-[40px] bg-[#FFF1EB] px-10 py-12 text-center sm:min-h-[400px] sm:px-14 sm:py-14 lg:px-20 lg:py-16",
        !isActive && "pointer-events-none"
      )}
    >
      <div className="mb-10 flex items-center justify-center gap-2.5">
        <HexLogo />
        <span className="font-display text-[15px] font-bold tracking-tight text-[#010B2F]">
          {item.company}
        </span>
      </div>

      <blockquote className="max-w-[640px] font-display text-[18px] font-medium leading-[1.4] text-[#101214] sm:text-[26px] lg:text-[30px] lg:leading-[1.35]">
        &lsquo;{item.quote}&rsquo;
      </blockquote>

      <div className="mt-12 flex items-center justify-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#FFE0D1]">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#93B4E8] to-[#5B8FCE] font-display text-sm font-bold text-white">
            {item.author.charAt(0)}
          </div>
        </div>
        <div className="text-left">
          <p className="font-display text-[15px] font-bold text-[#101214]">
            {item.author}
          </p>
          <p className="font-text text-sm text-[#6B7280]">{item.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(SLIDE_COUNT);
  const [isInstant, setIsInstant] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const card = container?.querySelector("[data-card]") as HTMLElement | null;
    if (container && card) {
      setContainerWidth(container.offsetWidth);
      setSlideWidth(card.offsetWidth);
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, currentIndex]);

  const handleLoopReset = useCallback(() => {
    if (currentIndex >= SLIDE_COUNT * 2) {
      setIsInstant(true);
      setCurrentIndex((prev) => prev - SLIDE_COUNT);
      requestAnimationFrame(() => setIsInstant(false));
    } else if (currentIndex < SLIDE_COUNT) {
      setIsInstant(true);
      setCurrentIndex((prev) => prev + SLIDE_COUNT);
      requestAnimationFrame(() => setIsInstant(false));
    }
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const translateX =
    slideWidth > 0
      ? containerWidth / 2 -
        slideWidth / 2 -
        currentIndex * (slideWidth + GAP)
      : 0;

  return (
    <section
      id="yorumlar"
      className="scroll-mt-[72px] overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Müşteri Yorumları"
    >
      <div className="relative pb-8 md:pb-0">
        {/* Masaüstü: yan oklar */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center md:flex">
          <div className="relative w-[min(88vw,860px)]">
            <button
              type="button"
              onClick={goToPrevious}
              className="pointer-events-auto absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_14px_rgba(16,18,20,0.1)] transition-shadow hover:shadow-[0_4px_18px_rgba(16,18,20,0.14)]"
              aria-label="Önceki yorum"
            >
              <ChevronLeft
                className="h-5 w-5 text-[#101214]"
                strokeWidth={1.5}
              />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="pointer-events-auto absolute right-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_14px_rgba(16,18,20,0.1)] transition-shadow hover:shadow-[0_4px_18px_rgba(16,18,20,0.14)]"
              aria-label="Sonraki yorum"
            >
              <ChevronRight
                className="h-5 w-5 text-[#101214]"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* Mobil: alt orta oklar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center md:hidden">
          <div className="flex translate-y-1/2 items-center gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(16,18,20,0.12)] transition-shadow hover:shadow-[0_6px_24px_rgba(16,18,20,0.16)]"
              aria-label="Önceki yorum"
            >
              <span className="font-text text-xl leading-none text-[#101214]">
                ←
              </span>
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(16,18,20,0.12)] transition-shadow hover:shadow-[0_6px_24px_rgba(16,18,20,0.16)]"
              aria-label="Sonraki yorum"
            >
              <span className="font-text text-xl leading-none text-[#101214]">
                →
              </span>
            </button>
          </div>
        </div>

        <div ref={containerRef} className="mask-fade-x overflow-hidden">
          <motion.div
            className="flex items-stretch"
            style={{ gap: GAP }}
            animate={{ x: translateX }}
            transition={
              isInstant
                ? { duration: 0 }
                : { type: "spring", stiffness: 280, damping: 32 }
            }
            onAnimationComplete={() => {
              measure();
              handleLoopReset();
            }}
          >
            {extendedSlides.map((item, index) => (
              <TestimonialCard
                key={`${item.id}-${index}`}
                item={item}
                isActive={index === currentIndex}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
