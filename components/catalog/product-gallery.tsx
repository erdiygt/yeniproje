"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  title: string;
  coverImage?: string | null;
  gallery: string[];
}

function GalleryBadges() {
  return (
    <>
      <div
        className="pointer-events-none absolute left-3 top-3 z-10 flex h-[4.75rem] w-[4.75rem] flex-col items-center justify-center rounded-full bg-[#EBF2FF]/95 px-2 text-center shadow-[0_6px_20px_rgba(16,18,20,0.14)] backdrop-blur-sm sm:left-4 sm:top-4 sm:h-[5.5rem] sm:w-[5.5rem]"
        aria-label="Tüm Türkiye'ye Kargo"
      >
        <Truck
          className="h-4 w-4 text-[#165FC7] sm:h-5 sm:w-5"
          strokeWidth={2.25}
          aria-hidden="true"
        />
        <span className="mt-1 font-text text-[9px] font-semibold leading-[1.15] text-[#165FC7] sm:text-[10px]">
          Tüm Türkiye&apos;ye
          <br />
          Kargo
        </span>
      </div>

      <div
        className="pointer-events-none absolute bottom-3 right-3 z-10 flex h-[4.75rem] w-[4.75rem] flex-col items-center justify-center rounded-full bg-[#E8F8EF]/95 px-2 text-center shadow-[0_6px_20px_rgba(16,18,20,0.14)] backdrop-blur-sm sm:bottom-4 sm:right-4 sm:h-[5.5rem] sm:w-[5.5rem]"
        aria-label="Orijinal Ürün"
      >
        <ShieldCheck
          className="h-4 w-4 text-[#0F766E] sm:h-5 sm:w-5"
          strokeWidth={2.25}
          aria-hidden="true"
        />
        <span className="mt-1 font-text text-[9px] font-semibold leading-[1.15] text-[#0F766E] sm:text-[10px]">
          Orijinal
          <br />
          Ürün
        </span>
      </div>
    </>
  );
}

export function ProductGallery({
  title,
  coverImage,
  gallery,
}: ProductGalleryProps) {
  const images = [coverImage, ...gallery].filter(
    (image): image is string => Boolean(image)
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  const scrollToIndex = useCallback((index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const clamped = Math.max(0, Math.min(index, images.length - 1));
    isScrollingProgrammatically.current = true;
    slider.scrollTo({
      left: clamped * slider.clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(clamped);

    window.setTimeout(() => {
      isScrollingProgrammatically.current = false;
    }, 400);
  }, [images.length]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || images.length <= 1) return;

    const handleScroll = () => {
      if (isScrollingProgrammatically.current) return;
      const width = slider.clientWidth;
      if (width <= 0) return;
      const nextIndex = Math.round(slider.scrollLeft / width);
      setActiveIndex((current) =>
        nextIndex === current ? current : nextIndex
      );
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-2 sm:p-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="font-display text-2xl font-bold text-primary/30">
              ABS
            </span>
          </div>
          <GalleryBadges />
        </div>
      </div>
    );
  }

  const hasMultiple = images.length > 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-2 sm:p-3">
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl bg-secondary [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
          aria-label={`${title} görsel galerisi`}
        >
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative h-full w-full shrink-0 snap-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${images.length}`}
            >
              <Image
                src={image}
                alt={index === 0 ? title : `${title} - görsel ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <GalleryBadges />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex <= 0}
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/95 text-[#101214] shadow-sm transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-40 sm:left-3 sm:h-10 sm:w-10"
              aria-label="Önceki görsel"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex >= images.length - 1}
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/95 text-[#101214] shadow-sm transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-40 sm:right-3 sm:h-10 sm:w-10"
              aria-label="Sonraki görsel"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {images.map((_, index) => (
                <span
                  key={`dot-${index}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === activeIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/55"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <button
              key={`thumb-${image}-${index}`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors sm:h-[4.5rem] sm:w-[4.5rem]",
                index === activeIndex
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-[#E5E7EB] hover:border-primary/50"
              )}
              aria-label={`${title} görsel ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
