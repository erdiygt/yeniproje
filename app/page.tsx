import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebSiteSchema,
  getFAQSchema,
} from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/sections/hero";
import { HomeCatalogSection } from "@/sections/home-catalog";
import { ReferencesSection } from "@/sections/references";
import { AboutSection } from "@/sections/about";
import { WhyUsSection } from "@/sections/why-us";
import { TestimonialsSection } from "@/sections/testimonials";
import { DarkCTASection } from "@/sections/dark-cta";
import { ContactSection } from "@/sections/contact";
import { BlogPreviewSection } from "@/sections/blog-preview";
import { FAQSection } from "@/sections/faq";
import { faqItems } from "@/lib/data/faq";
import { getPublishedPostsSafe } from "@/lib/blog-data";
import {
  getPublishedCategoriesSafe,
  getPublishedProductsSafe,
} from "@/lib/catalog-data";

export const metadata: Metadata = generateSEO({
  title: "ABS'ci Mustafa: ABS Beyni Tamir & Satış",
  description:
    "ABS beyni tamiri ve satış konusunda sektörün lider firması abscimustafa.com.tr'den profesyonel destek alın.",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [posts, products, categories] = await Promise.all([
    getPublishedPostsSafe(2),
    getPublishedProductsSafe(9),
    getPublishedCategoriesSafe(),
  ]);

  const schemas = [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getWebSiteSchema(),
    getFAQSchema(
      faqItems.map((item) => ({
        question: item.question,
        answer: item.answer,
      }))
    ),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <Header />
      <main>
        <HeroSection />
        <HomeCatalogSection categories={categories} products={products} />
        <ReferencesSection />
        <AboutSection />
        <TestimonialsSection />
        <BlogPreviewSection posts={posts} />
        <WhyUsSection />
        <DarkCTASection />
        <ContactSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
