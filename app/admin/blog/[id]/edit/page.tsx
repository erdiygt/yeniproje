import { notFound } from "next/navigation";
import { getPostById } from "@/services/blog.service";
import { BlogPostForm } from "@/components/admin/blog-post-form";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-bold text-[#101214] mb-8 lg:text-5xl">
        Yazıyı Düzenle
      </h1>
      <BlogPostForm post={post} />
    </div>
  );
}
