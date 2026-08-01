"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Truck } from "lucide-react";

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

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
          <span className="font-display text-2xl font-bold text-primary/30">
            ABS
          </span>
        </div>
        <GalleryBadges />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={images[activeIndex]}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 560px"
        />
        <GalleryBadges />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border ${
                index === activeIndex
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
              aria-label={`${title} görsel ${index + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
