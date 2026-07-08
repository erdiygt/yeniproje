import { BlogPostForm } from "@/components/admin/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-4xl font-bold text-[#101214] mb-8 lg:text-5xl">
        Yeni Blog Yazısı
      </h1>
      <BlogPostForm />
    </div>
  );
}
