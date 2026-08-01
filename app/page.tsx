import type { Metadata } from "next";
import dynamic from "next/dynamic";
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
import { faqItems } from "@/lib/data/faq";
import { getPublishedPostsSafe } from "@/lib/blog-data";
import {
  getPublishedCategoriesSafe,
  getPublishedProductsSafe,
} from "@/lib/catalog-data";

const ReferencesSection = dynamic(
  () =>
    import("@/sections/references").then((mod) => mod.ReferencesSection),
  { loading: () => null }
);
const AboutSection = dynamic(
  () => import("@/sections/about").then((mod) => mod.AboutSection),
  { loading: () => null }
);
const TestimonialsSection = dynamic(
  () =>
    import("@/sections/testimonials").then((mod) => mod.TestimonialsSection),
  { loading: () => null }
);
const BlogPreviewSection = dynamic(
  () =>
    import("@/sections/blog-preview").then((mod) => mod.BlogPreviewSection),
  { loading: () => null }
);
const WhyUsSection = dynamic(
  () => import("@/sections/why-us").then((mod) => mod.WhyUsSection),
  { loading: () => null }
);
const DarkCTASection = dynamic(
  () => import("@/sections/dark-cta").then((mod) => mod.DarkCTASection),
  { loading: () => null }
);
const ContactSection = dynamic(
  () => import("@/sections/contact").then((mod) => mod.ContactSection),
  { loading: () => null }
);
const FAQSection = dynamic(
  () => import("@/sections/faq").then((mod) => mod.FAQSection),
  { loading: () => null }
);

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
