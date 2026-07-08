import { getPublishedPosts } from "@/services/blog.service";
import type { Post } from "@/types";

export async function getPublishedPostsSafe(limit?: number): Promise<Post[]> {
  try {
    return await getPublishedPosts(limit);
  } catch {
    return [];
  }
}
