"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/data/faq";
import { SectionHeading } from "@/components/common/section-heading";

export function FAQSection() {
  return (
    <section
      id="sss"
      className="section-padding scroll-mt-[72px] bg-[#EEF3FF]"
      aria-labelledby="faq-heading"
    >
      <div className="container-site">
        <motion.div
          className="mb-12 text-center sm:mb-14 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading id="faq-heading">
            Sıkça Sorulan Sorular
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#4A5F7F] sm:text-lg">
            ABS beyni tamiri hakkında merak ettikleriniz
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="flex w-full flex-col gap-3">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="overflow-hidden rounded-2xl border-0 bg-[#D6E4FF] sm:rounded-[20px]"
              >
                <AccordionTrigger className="px-5 py-4 font-display text-[15px] font-bold text-[#101214] hover:no-underline sm:px-6 sm:py-5 sm:text-base [&[data-state=open]]:pb-3 [&>svg]:text-[#101214]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-[#374151] sm:px-6 sm:pb-6 sm:text-[15px]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
