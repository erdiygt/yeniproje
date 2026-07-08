import Link from "next/link";
import { getAllPosts } from "@/services/blog.service";
import { Button } from "@/components/ui/button";
import { BlogList } from "@/components/admin/blog-list";
import { Plus } from "lucide-react";

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-[#101214] lg:text-5xl">
            Blog Yazıları
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {posts.length} yazı
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Yazı
          </Link>
        </Button>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
