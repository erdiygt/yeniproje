"use client";

import { motion } from "framer-motion";
import { AboutMockup } from "@/components/common/about-mockup";

export function AboutSection() {
  return (
    <section
      id="hakkimizda"
      className="scroll-mt-[72px] md:section-padding md:bg-white"
      aria-labelledby="about-heading"
    >
      {/* Mobil: tam genişlik mavi arka plan; masaüstü: container içinde kart */}
      <div className="bg-[#165FC7] py-12 sm:py-16 md:bg-transparent md:py-0">
        <div className="md:container-site">
          <motion.div
            className="overflow-visible max-md:rounded-none md:mx-auto md:max-w-5xl md:overflow-hidden md:rounded-[40px] md:bg-[#165FC7]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 items-center gap-10 px-6 sm:px-10 md:grid-cols-2 md:gap-8 md:p-10 lg:p-14 xl:p-16">
              <AboutMockup />

              <div className="flex flex-col items-start text-left md:pl-2 lg:pl-4 xl:pl-10">
                <span className="mb-4 font-text text-sm font-bold text-white">
                  Hakkımızda
                </span>

                <h2
                  id="about-heading"
                  className="font-display text-[22px] font-bold leading-[1.15] text-white sm:text-[28px] lg:text-[34px]"
                >
                  ABS Beyni Tamiri Konusunda Uzman Ekibiniz
                </h2>

                <p className="mt-4 max-w-md font-text text-sm leading-[1.6] text-white/90 sm:mt-5 sm:text-[17px] lg:mt-6">
                  Yılların deneyimi ve uzman kadromuzla ABS beyni tamiri ve
                  satışı alanında güvenilir hizmet sunuyoruz. Modern test
                  ekipmanlarımız ve orijinal yedek parçalarımızla tüm marka ve
                  modeller için garantili onarım sağlıyoruz.
                </p>

                <a
                  href="#iletisim"
                  className="mt-8 inline-flex h-[46px] items-center justify-center rounded-full bg-[#101214] px-8 font-text text-[15px] font-semibold text-white transition-colors hover:bg-black lg:mt-10"
                >
                  Daha Fazla
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
