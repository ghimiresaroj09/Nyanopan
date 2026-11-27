import { BACKEND_API_BASE_URL, fetchNoStore } from "./backend";

const API_BASE_URL = BACKEND_API_BASE_URL;

export interface BlogCategory {
  id: string;
  name: string;
  blogs_count: number;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  category_name: string;
  image: string;
  image_title: string;
  image_alt: string;
  image_caption: string;
  content: string;
  tags: string[];
  is_featured: boolean;
  views: number;
  created_at: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  canonical_url: string;
  meta_robots: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_image: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
}

interface ListResponse<T> {
  success: boolean;
  data: { results: T[]; next?: string | null };
}

interface DetailResponse {
  success: boolean;
  data: Blog;
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const response = await fetchNoStore(`${API_BASE_URL}/blog-categories/`);
    if (!response.ok) return [];
    const body: ListResponse<BlogCategory> = await response.json();
    return body.data?.results ?? [];
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}

export async function getBlogs(category?: string): Promise<Blog[]> {
  try {
    const firstUrl = new URL(`${API_BASE_URL}/blogs/`);
    if (category) firstUrl.searchParams.set("category", category);
    const blogs: Blog[] = [];
    let nextUrl: string | null = firstUrl.toString();
    const visited = new Set<string>();

    while (nextUrl && !visited.has(nextUrl)) {
      visited.add(nextUrl);
      const response = await fetchNoStore(nextUrl);
      if (!response.ok) break;
      const body: ListResponse<Blog> = await response.json();
      blogs.push(...(body.data?.results ?? []));
      nextUrl = body.data?.next
        ? new URL(body.data.next, API_BASE_URL).toString()
        : null;
    }
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const response = await fetchNoStore(`${API_BASE_URL}/blogs/${encodeURIComponent(slug)}/`);
    if (response.status === 404) return null;
    if (!response.ok) return null;
    const body: DetailResponse = await response.json();
    return body.data ?? null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}
