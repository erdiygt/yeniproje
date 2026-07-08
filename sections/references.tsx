"use client";

import Image from "next/image";
import { referenceLogos } from "@/lib/data/references";
import { SectionHeading } from "@/components/common/section-heading";

type ReferenceLogo = (typeof referenceLogos)[number];

function createInfiniteTrack(
  logos: readonly ReferenceLogo[],
  repeats = 6
): ReferenceLogo[] {
  const segment = Array.from({ length: repeats }, () => [...logos]).flat();
  return [...segment, ...segment];
}

function LogoRow({
  logos,
  speed,
  delay,
  className,
}: {
  logos: readonly ReferenceLogo[];
  speed: number;
  delay: number;
  className?: string;
}) {
  const track = createInfiniteTrack(logos, 6);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div
        className="flex w-max items-center gap-3 animate-marquee-left sm:gap-14 lg:gap-20"
        style={{
          animationDuration: `${speed}s`,
          animationDelay: `${delay}s`,
        }}
      >
        {track.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex h-11 w-32 shrink-0 items-center justify-center sm:h-14 sm:w-44 lg:h-16 lg:w-48"
          >
            <Image
              src={logo.src}
              alt={`${logo.name} logosu`}
              width={200}
              height={64}
              className="h-9 w-auto max-w-[118px] object-contain grayscale opacity-55 sm:h-11 sm:max-w-[180px] sm:opacity-60 lg:h-14 lg:max-w-[210px]"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const row1Logos = referenceLogos;
const row2Logos = [
  ...referenceLogos.slice(3),
  ...referenceLogos.slice(0, 3),
];
const row3Logos = [...referenceLogos].reverse();

export function ReferencesSection() {
  return (
    <section
      id="referanslar"
      className="section-padding scroll-mt-[72px] bg-white"
      aria-label="Referanslar"
    >
      <div className="container-site">
        <div className="mb-10 flex flex-col items-center text-center lg:mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Hizmet Verdiğimiz Markalar
          </p>
          <SectionHeading>Tüm Marka ve Modeller İçin Hizmet</SectionHeading>
        </div>
      </div>

      <div className="relative w-full">
        <div className="references-fade-left" aria-hidden="true" />
        <div className="references-fade-right" aria-hidden="true" />

        <div className="mask-fade-x flex flex-col gap-3 sm:gap-6">
          <LogoRow logos={row1Logos} speed={260} delay={0} />
          <LogoRow logos={row2Logos} speed={310} delay={-20} className="pl-6 sm:pl-0" />
          <LogoRow logos={row3Logos} speed={350} delay={-35} className="pl-3 sm:pl-0" />
        </div>
      </div>
    </section>
  );
}
