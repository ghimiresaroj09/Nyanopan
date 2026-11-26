import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Eye } from "lucide-react";
import { getBlogBySlug, getBlogCategories, getBlogs } from "@/lib/api/blogs";
import { getSiteConfig } from "@/config/site";

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Story not found | Nyanopan" };

  const title = blog.meta_title || blog.og_title || blog.title;
  const description = blog.meta_description || blog.og_description || blog.excerpt;
  const image = blog.og_image || blog.image;
  const canonical = blog.canonical_url || `/blog/${blog.slug}`;
  const robots = parseRobots(blog.meta_robots);
  return {
    title,
    description,
    keywords: blog.meta_keywords,
    alternates: { canonical },
    robots,
    openGraph: {
      title: blog.og_title || title,
      description: blog.og_description || description,
      type: "article",
      url: blog.og_url || canonical,
      siteName: "Nyanopan",
      images: image ? [{ url: image, alt: blog.image_alt || title }] : undefined,
      publishedTime: blog.created_at,
      tags: blog.tags,
    },
    twitter: {
      card: blog.twitter_card === "summary" ? "summary" : "summary_large_image",
      title: blog.twitter_title || title,
      description: blog.twitter_description || description,
      images: blog.twitter_image || image ? [blog.twitter_image || image] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const [blog, siteConfig, categories, blogs] = await Promise.all([
    getBlogBySlug(slug),
    getSiteConfig(),
    getBlogCategories(),
    getBlogs(),
  ]);
  if (!blog) notFound();

  const date = new Date(blog.created_at);
  const formattedDate = Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(date);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.meta_description || blog.excerpt,
    image: blog.og_image || blog.image || undefined,
    datePublished: blog.created_at,
    dateModified: blog.created_at,
    mainEntityOfPage: blog.canonical_url || `${siteConfig.url}/blog/${blog.slug}`,
    articleSection: blog.category_name,
    keywords: blog.meta_keywords?.length ? blog.meta_keywords : blog.tags,
    author: { "@type": "Organization", name: "Nyanopan" },
    publisher: {
      "@type": "Organization",
      name: "Nyanopan",
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/brand/logo-cloud.png` },
    },
  };

  return (
    <main className="min-h-screen bg-[#fbf9f5]">
      <article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
        <header className="border-b border-[#e6decb] bg-[#f7f2e8]">
          <div className="container-page py-10 sm:py-14">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[#8a6a49] transition hover:text-[#c46243]"><ArrowLeft className="h-4 w-4" /> All stories</Link>
            <div className="mt-7 max-w-4xl">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#c46243]">
                <span>{blog.category_name}</span>{formattedDate && <><span className="h-1 w-1 rounded-full bg-[#c7b69b]" /><time dateTime={blog.created_at}>{formattedDate}</time></>}
                <span className="h-1 w-1 rounded-full bg-[#c7b69b]" /><span className="inline-flex items-center gap-1 text-[#8a7e6d]"><Eye className="h-3.5 w-3.5" />{blog.views} views</span>
                <span className="h-1 w-1 rounded-full bg-[#c7b69b]" /><span className="inline-flex items-center gap-1 text-[#8a7e6d]"><Clock3 className="h-3.5 w-3.5" />{estimateReadTime(blog.content)}</span>
              </div>
              <h1 className="mt-4 font-serif text-4xl font-normal leading-tight tracking-tight text-[#28221c] sm:text-5xl">{blog.title}</h1>
              {blog.excerpt && <p className="mt-5 max-w-3xl text-lg leading-8 text-[#675c4e]">{blog.excerpt}</p>}
            </div>
          </div>
        </header>

        {blog.image && (
          <figure className="container-page pt-8 sm:pt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded bg-[#f2eada]">
              <Image src={blog.image} alt={blog.image_alt || blog.title} title={blog.image_title || undefined} fill priority sizes="(max-width: 1280px) 100vw, 1152px" className="object-cover" />
            </div>
            {blog.image_caption && <figcaption className="mt-3 text-center text-sm text-[#8a7e6d]">{blog.image_caption}</figcaption>}
          </figure>
        )}

        <div className="container-page grid items-start gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.75fr)] lg:gap-12">
          <div className="min-w-0">
            <div className="blog-prose min-w-0 text-base leading-8 text-[#433b32]" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(blog.content) }} />
            {blog.tags.length > 0 && (
              <div className="mt-10 border-t border-[#e6decb] pt-5">
                <span className="mr-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7e6d]">Tags</span>
                {blog.tags.map((tag) => <span key={tag} className="mr-2 inline-block rounded-full bg-[#f5f1e8] px-3 py-1 text-xs text-[#675c4e]">#{tag}</span>)}
              </div>
            )}
          </div>
          <aside className="space-y-8 lg:sticky lg:top-24">
            <DetailSidebarAbout />
            <DetailPopularPosts blogs={blogs.filter((item) => item.slug !== blog.slug)} />
            <DetailCategories categories={categories} activeCategoryId={blog.category} />
          </aside>
        </div>
      </article>
    </main>
  );
}

function parseRobots(value: string) {
  const directives = (value || "index, follow").toLowerCase().split(/[\s,]+/).filter(Boolean);
  const robots: NonNullable<Metadata["robots"]> = {
    index: !directives.includes("noindex"),
    follow: !directives.includes("nofollow"),
  };
  const imagePreview = directives.find((directive) => directive.startsWith("max-image-preview:"))?.split(":")[1];
  if (imagePreview === "none" || imagePreview === "standard" || imagePreview === "large") {
    robots.googleBot = { index: robots.index, follow: robots.follow, "max-image-preview": imagePreview };
  }
  return robots;
}

function sanitizeBlogHtml(html: string) {
  return html
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src)\s*=\s*("|')\s*javascript:[\s\S]*?\2/gi, "");
}

function estimateReadTime(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatSidebarDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function DetailSidebarAbout() {
  return (
    <div className="rounded border border-[#e6decb] bg-[#f7f2e8] p-6 text-center">
      <Image src="/brand/logo-cloud.png?v=2" alt="Nyanopan" width={76} height={46} className="mx-auto h-10 w-auto" />
      <p className="mt-4 text-sm leading-7 text-[#675c4e]">Stories of craft, care, and mountain living from our Kathmandu atelier.</p>
    </div>
  );
}

function DetailPopularPosts({ blogs }: { blogs: Awaited<ReturnType<typeof getBlogs>> }) {
  return (
    <div className="rounded border border-[#e6decb] p-6">
      <div className="mb-5 text-center">
        <h3 className="font-serif text-xl text-[#28221c]">Popular Posts</h3>
        <Image src="/brand/logo-cloud.png?v=2" alt="" width={60} height={16} className="mx-auto mt-2 h-2 w-14 object-contain" />
      </div>
      {blogs.length === 0 ? <p className="text-sm text-[#8a7e6d]">More stories are coming soon.</p> : (
        <div className="space-y-4">
          {blogs.slice(0, 4).map((item) => (
            <article key={item.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
              <Link href={`/blog/${item.slug}`} className="relative h-[72px] overflow-hidden rounded bg-[#f2eada]">
                {item.image && <Image src={item.image} alt="" fill sizes="72px" className="object-cover" />}
              </Link>
              <div>
                <h4 className="font-serif text-sm leading-snug text-[#28221c]"><Link href={`/blog/${item.slug}`} className="hover:text-[#c46243]">{item.title}</Link></h4>
                <time className="mt-1 block text-[11px] text-[#8a7e6d]" dateTime={item.created_at}>{formatSidebarDate(item.created_at)}</time>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailCategories({ categories, activeCategoryId }: { categories: Awaited<ReturnType<typeof getBlogCategories>>; activeCategoryId: string }) {
  return (
    <div className="rounded border border-[#e6decb] p-6">
      <div className="mb-5 text-center">
        <h3 className="font-serif text-xl text-[#28221c]">Explore Topics</h3>
        <Image src="/brand/logo-cloud.png?v=2" alt="" width={60} height={16} className="mx-auto mt-2 h-2 w-14 object-contain" />
      </div>
      <ul className="divide-y divide-[#ece4d5]">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/blog?category=${encodeURIComponent(category.id)}`} className={`flex items-center justify-between py-3 text-sm font-medium transition ${category.id === activeCategoryId ? "text-[#c46243]" : "text-[#28221c] hover:text-[#c46243]"}`}>
              <span>{category.name}</span><span className="text-xs text-[#8a7e6d]">{category.blogs_count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
