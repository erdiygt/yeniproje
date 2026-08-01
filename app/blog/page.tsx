import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { generateSEO, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbSchema } from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPublishedPostsSafe } from "@/lib/blog-data";
import { formatDateShort } from "@/utils/format-date";
import { Breadcrumb } from "@/components/common/breadcrumb";

export const metadata: Metadata = generateSEO({
  title: "Blog",
  description:
    "ABS beyni tamiri, bakım ve güvenlik konularında uzman yazılarımız.",
  canonical: `${siteConfig.url}/blog`,
});

export default async function BlogPage() {
  const posts = await getPublishedPostsSafe();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Header />
      <main className="pt-[72px]">
        <section className="section-padding">
          <div className="container-site">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="font-display text-2xl font-bold text-[#101214] sm:text-3xl lg:text-4xl">
                Blog
              </h1>
              <Breadcrumb
                className="mt-4 justify-center"
                items={[
                  { name: "Ana Sayfa", href: "/" },
                  { name: "Blog" },
                ]}
              />
              <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-lg">
                ABS beyni tamiri ve otomotiv güvenliği hakkında faydalı bilgiler
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Henüz yayınlanmış blog yazısı bulunmuyor.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-[16/10] bg-secondary overflow-hidden">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <span className="font-display text-lg font-bold text-primary/30">
                              ABS
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        {post.category && (
                          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                            {post.category}
                          </span>
                        )}
                        <h2 className="font-display text-lg font-bold text-[#101214] group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          {post.author && <span>{post.author}</span>}
                          {post.author && post.publishedAt && <span>·</span>}
                          {post.publishedAt && (
                            <time dateTime={post.publishedAt.toISOString()}>
                              {formatDateShort(post.publishedAt)}
                            </time>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
