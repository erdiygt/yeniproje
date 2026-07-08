import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { generateSEO, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema, getBlogPostingSchema } from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RelatedPosts } from "@/components/blog/related-posts";
import { BlogContent } from "@/components/blog/blog-content";
import { getPublishedPostsSafe } from "@/lib/blog-data";
import {
  getPostBySlug,
  getRelatedPosts,
} from "@/services/blog.service";
import { formatDate } from "@/utils/format-date";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPostsSafe();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    return generateSEO({ title: "Yazı Bulunamadı", noIndex: true });
  }

  const authorName = "ABS'ci Mustafa";

  return generateSEO({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: post.coverImage || undefined,
    canonical: `${siteConfig.url}/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: authorName,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.category, 3);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
  ]);

  const blogPostingSchema = getBlogPostingSchema({
    title: post.title,
    description: post.excerpt || post.seoDescription || "",
    slug: post.slug,
    coverImage: post.coverImage,
    author: "ABS'ci Mustafa",
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt,
  });

  const authorName = "ABS'ci Mustafa";
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  const shareTitle = `${post.title} | ${siteConfig.name}`;
  const encodedPostUrl = encodeURIComponent(postUrl);
  const encodedShareTitle = encodeURIComponent(shareTitle);
  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedShareTitle}%20${encodedPostUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedPostUrl}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedPostUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedShareTitle}&url=${encodedPostUrl}`,
    },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema, blogPostingSchema]} />
      <Header />
      <main className="bg-white pt-[72px]">
        <article>
          <div className="container-site">
            <div className="mx-auto max-w-[760px] px-0 py-12 sm:py-14 lg:py-16">
              <header className="text-left">
                <h1 className="font-display text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-[#101214] sm:text-[34px] lg:text-[40px]">
                  {post.title}
                </h1>

                <nav
                  aria-label="Breadcrumb"
                  className="mt-4 flex flex-wrap items-center gap-2 font-text text-sm text-[#6B7280]"
                >
                  <Link
                    href="/"
                    className="transition-colors hover:text-[#165FC7]"
                  >
                    Ana Sayfa
                  </Link>
                  <span aria-hidden="true">/</span>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-[#165FC7]"
                  >
                    Blog
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-[#101214]">{post.title}</span>
                </nav>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-left">
                  {post.publishedAt && (
                    <time
                      dateTime={post.publishedAt.toISOString()}
                      className="font-text text-sm text-[#6B7280]"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                  {post.category && (
                    <span className="inline-flex rounded-full border border-[#165FC7]/40 px-3 py-1 font-text text-[11px] font-semibold uppercase tracking-[0.08em] text-[#165FC7]">
                      {post.category}
                    </span>
                  )}
                </div>
              </header>

              {post.coverImage && (
                <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl sm:mt-10 sm:rounded-[20px]">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 760px) 100vw, 760px"
                  />
                </div>
              )}

              <div className="mt-10 sm:mt-12">
                <BlogContent content={post.content} />
              </div>

              <div className="mt-12 space-y-6 border-t border-[#E5E7EB] pt-8">
                <section
                  aria-labelledby="article-share-heading"
                  className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 sm:p-7"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#101214]">
                        <Share2 className="h-4 w-4" strokeWidth={2} />
                        <h2
                          id="article-share-heading"
                          className="font-display text-lg font-bold"
                        >
                          Paylaş
                        </h2>
                      </div>
                      <p className="mt-2 font-text text-sm text-[#6B7280]">
                        Bu makaleyi sosyal mecralarda kolayca paylaşın.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {shareLinks.map((shareLink) => (
                        <a
                          key={shareLink.label}
                          href={shareLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${shareLink.label} ile paylaş`}
                          className="inline-flex items-center justify-center rounded-full border border-[#D1D5DB] px-4 py-2 font-text text-sm font-medium text-[#101214] transition-colors hover:border-[#165FC7] hover:text-[#165FC7]"
                        >
                          {shareLink.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </section>

                <section
                  aria-labelledby="article-author-heading"
                  className="rounded-[24px] border border-[#D6E4FF] bg-[#EEF3FF] p-6 sm:p-7"
                >
                  <p
                    id="article-author-heading"
                    className="font-text text-[11px] font-bold uppercase tracking-[0.12em] text-[#165FC7]"
                  >
                    Yazar
                  </p>
                  <div className="mt-4 flex items-start gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#D6E4FF] bg-white">
                      <Image
                        src="/author-absci-mustafa.png"
                        alt="ABS'ci Mustafa"
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#101214]">
                        {authorName}
                      </h2>
                      <p className="mt-2 font-text text-sm leading-6 text-[#4B5563]">
                        ABS beyni tamiri, arıza tespiti ve modül onarımı
                        konularında teknik içerikler hazırlar. Sahadan gelen
                        deneyimi pratik bilgilerle birleştirerek sürücülere yol
                        gösteren rehberler sunar.
                      </p>
                    </div>
                  </div>
                </section>

                <Link
                  href="/blog"
                  className="font-text text-sm font-medium text-[#165FC7] underline underline-offset-2 hover:text-[#124DA3]"
                >
                  ← Tüm yazılara dön
                </Link>
              </div>
            </div>
          </div>
        </article>

        <RelatedPosts posts={relatedPosts} />
      </main>
      <Footer />
    </>
  );
}
