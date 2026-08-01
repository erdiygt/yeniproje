import { siteConfig } from "@/lib/seo";

export function ContactMap() {
  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-[#ECEEF1] sm:min-h-[300px] lg:min-h-[340px]">
      <iframe
        src={siteConfig.mapsEmbedUrl}
        title="Konum haritası"
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        allowFullScreen
      />
    </div>
  );
}
