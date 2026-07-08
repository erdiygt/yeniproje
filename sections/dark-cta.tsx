"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function DarkCTASection() {
  return (
    <section
      className="md:section-padding md:bg-white"
      aria-labelledby="dark-cta-heading"
    >
      {/* Mobil: tam genişlik koyu arka plan; masaüstü: container içinde kart */}
      <div className="bg-[#101214] py-14 sm:py-16 md:bg-transparent md:py-0">
        <div className="md:container-site">
          <motion.div
            className="flex flex-col items-center px-6 text-center sm:px-10 max-md:rounded-none md:mx-auto md:max-w-5xl md:rounded-[40px] md:bg-[#101214] md:px-12 md:py-16 lg:px-20 lg:py-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2
              id="dark-cta-heading"
              className="font-display text-[22px] font-bold leading-tight text-white sm:text-[28px] lg:text-[34px]"
            >
              ABS Beyninizi Güvenle Onarın
            </h2>

            <p className="mt-4 max-w-2xl font-text text-sm leading-[1.65] text-white/85 sm:mt-5 sm:text-[17px] lg:mt-6">
              Garantili onarım, orijinal yedek parça ve uzman teknik kadromuzla
              ABS beyni tamiri ve satışında güvenilir hizmet sunuyoruz. Tüm
              marka ve modeller için hızlı teşhis ve şeffaf fiyatlandırma.
            </p>

            <Link
              href="#iletisim"
              className="mt-8 inline-flex h-[46px] items-center justify-center rounded-full bg-[#165FC7] px-8 font-text text-[15px] font-semibold text-white transition-colors hover:bg-[#124DA3] lg:mt-10"
            >
              Daha Fazla
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
