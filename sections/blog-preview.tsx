"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/types";

interface BlogPreviewSectionProps {
  posts: Post[];
}

const demoPosts: Pick<Post, "title" | "slug" | "excerpt">[] = [
  {
    title: "ABS Beyni Arızası Belirtileri ve Çözümleri",
    slug: "abs-beyni-arizasi-belirtileri",
    excerpt:
      "ABS uyarı lambası yandığında ne yapmalısınız? En yaygın arıza belirtileri ve profesyonel çözüm önerileri.",
  },
  {
    title: "ABS Modülü Bakımı: Uzun Ömürlü Kullanım İpuçları",
    slug: "abs-modulu-bakimi-ipuclari",
    excerpt:
      "ABS modülünüzün ömrünü uzatmak için dikkat etmeniz gereken bakım ipuçları ve uzman önerileri.",
  },
];

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function BlogCard({
  title,
  slug,
  excerpt,
  index,
}: {
  title: string;
  slug: string;
  excerpt: string;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.32, 0.72, 0, 1] }}
      className="h-full"
    >
      <Link
        href={`/blog/${slug}`}
        className="group flex h-full min-h-[280px] flex-col rounded-[20px] bg-[#010B2F] p-7 transition-colors hover:bg-[#162447] sm:min-h-[300px] sm:p-8 lg:min-h-[320px] lg:rounded-[24px] lg:p-10"
      >
        <h3 className="font-display text-[20px] font-bold leading-[1.25] text-white sm:text-[22px] lg:text-[26px]">
          {title}
        </h3>

        <p className="mt-5 flex-1 font-text text-[14px] leading-[1.7] text-white/75 sm:mt-6 sm:text-[15px] lg:text-base">
          {excerpt}
        </p>

        <span className="mt-8 inline-flex items-center gap-1 font-text text-[14px] font-medium text-white sm:text-[15px]">
          Yazıyı oku
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </Link>
    </motion.article>
  );
}

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  const displayPosts =
    posts.length > 0
      ? posts.slice(0, 2).map((post) => ({
          title: post.title,
          slug: post.slug,
          excerpt: stripHtml(
            post.excerpt ||
              "ABS beyni tamiri ve bakımı hakkında uzman ekibimizden faydalı bilgiler."
          ),
        }))
      : demoPosts;

  return (
    <section className="section-padding bg-white" aria-labelledby="blog-heading">
      <div className="container-site">
        <div className="overflow-hidden rounded-[28px] bg-[#010B2F] px-6 py-12 sm:rounded-[36px] sm:px-10 sm:py-14 lg:rounded-[40px] lg:px-16 lg:py-16 xl:px-20 xl:py-20">
          <motion.header
            className="mx-auto mb-10 max-w-4xl text-center lg:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 font-text text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 sm:mb-5">
              Blogumuzdan
            </p>
            <h2
              id="blog-heading"
              className="font-display text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[34px] lg:text-[42px] xl:text-[48px]"
            >
              ABS Beyni Tamiri Hakkında Bilmeniz Gerekenler
            </h2>
          </motion.header>

          <div className="mb-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:mb-14 lg:gap-8">
            {displayPosts.map((post, index) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt ?? ""}
                index={index}
              />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex h-[46px] min-w-[200px] items-center justify-center rounded-full bg-[#101214] px-10 font-text text-[15px] font-semibold text-white transition-colors hover:bg-black"
            >
              Blogu Keşfet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
