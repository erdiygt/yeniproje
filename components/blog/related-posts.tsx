import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      className="border-t border-[#E5E7EB] bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="related-posts-heading"
    >
      <div className="container-site">
        <h2
          id="related-posts-heading"
          className="mb-8 font-display text-xl font-bold text-[#101214] sm:mb-10 sm:text-2xl"
        >
          Benzer içerikler
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <article key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-shadow hover:shadow-[0_8px_30px_rgba(16,18,20,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#E8F5EC]">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFF1EB] to-[#E8F5EC]">
                      <span className="font-display text-3xl font-bold text-[#FE4203]/25">
                        ABS
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {post.category && (
                    <span className="mb-3 inline-flex w-fit rounded-full border border-[#FE4203]/35 px-2.5 py-1 font-text text-[10px] font-semibold uppercase tracking-[0.08em] text-[#FE4203]">
                      Yazı · {post.category}
                    </span>
                  )}

                  <h3 className="font-display text-lg font-bold leading-snug text-[#101214] group-hover:text-[#FE4203] sm:text-xl">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 font-text text-sm leading-relaxed text-[#6B7280]">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
