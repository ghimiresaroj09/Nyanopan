import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { getBlogCategories, getBlogs } from "@/lib/api/blogs";

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const [{ category: categoryId }, categories] = await Promise.all([searchParams, getBlogCategories()]);
  const category = categories.find((item) => item.id === categoryId);
  const title = category ? `${category.name} Stories` : "Stories & Journal";
  const description = category
    ? `Read stories and journal articles filed under ${category.name} from the Nyanopan Kathmandu workshop.`
    : "Stories, care tips, and inspiration from the Nyanopan Kathmandu workshop.";
  return {
    title,
    description,
    alternates: { canonical: "/blog" },
    robots: categoryId ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { type: "website", url: "/blog", title: `${title} | Nyanopan`, description, siteName: "Nyanopan" },
    twitter: { card: "summary_large_image", title: `${title} | Nyanopan`, description },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [{ category: categoryId, page: pageParam }, categories] = await Promise.all([searchParams, getBlogCategories()]);
  const blogs = await getBlogs(categoryId);
  const activeCategory = categories.find((category) => category.id === categoryId);
  const orderedByDate = [...blogs].sort((a, b) => dateValue(b.created_at) - dateValue(a.created_at));
  const markedFeatured = orderedByDate.filter((blog) => blog.is_featured);
  const featuredBlogs = (markedFeatured.length > 0 ? markedFeatured : orderedByDate.slice(0, 1)).slice(0, 5);
  const featuredIds = new Set(featuredBlogs.map((blog) => blog.id));
  const recentBlogs = orderedByDate.filter((blog) => !featuredIds.has(blog.id));
  const pageSize = 6;
  const parsedPage = Number.parseInt(pageParam || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const totalPages = Math.max(1, Math.ceil(recentBlogs.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBlogs = recentBlogs.slice((safePage - 1) * pageSize, safePage * pageSize);
  const blogQuery = categoryId ? `&category=${encodeURIComponent(categoryId)}` : "";

  return (
    <main id="main-content" className="min-h-screen bg-[#fbf9f5]">
      <header className="bg-[#f7f2e8] py-10 sm:py-12">
        <div className="container-page text-center">
          <p className="editorial-eyebrow justify-center">Nyanopan journal</p>
          <h1 className="mt-3 font-serif text-4xl font-normal text-[#28221c] sm:text-5xl">
            {activeCategory ? activeCategory.name : "Stories & inspiration"}
          </h1>
          <nav className="mt-5 flex justify-center" aria-label="Breadcrumb">
            <Link href="/" className="text-xs text-[#8a7e6d] transition hover:text-[#c46243]">Home</Link>
            <span className="mx-2 text-xs text-[#c4b9a8]">/</span>
            <span className="text-xs font-medium text-[#28221c]">Blog</span>
          </nav>
        </div>
      </header>

      <section className="container-page py-12 sm:py-16">
        {categories.length > 0 && (
          <nav className="mb-8 flex gap-2 overflow-x-auto border-b border-[#e6decb] pb-4" aria-label="Filter articles by category">
            <Link href="/blog" aria-current={!categoryId ? "page" : undefined} className={`shrink-0 border-b-2 px-3 pb-2 text-sm font-medium transition ${!categoryId ? "border-[#c46243] text-[#28221c]" : "border-transparent text-[#675c4e] hover:text-[#c46243]"}`}>All stories</Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/blog?category=${encodeURIComponent(category.id)}`} aria-current={category.id === categoryId ? "page" : undefined} className={`shrink-0 border-b-2 px-3 pb-2 text-sm font-medium transition ${category.id === categoryId ? "border-[#c46243] text-[#28221c]" : "border-transparent text-[#675c4e] hover:text-[#c46243]"}`}>
                {category.name} <span className="ml-1 text-xs opacity-60">{category.blogs_count}</span>
              </Link>
            ))}
          </nav>
        )}

        {blogs.length === 0 ? (
          <div className="mx-auto max-w-xl rounded border border-[#e6decb] bg-white px-6 py-14 text-center">
            <BookOpen className="mx-auto h-7 w-7 text-[#c46243]" />
            <h2 className="mt-4 font-serif text-2xl text-[#28221c]">{activeCategory ? `No ${activeCategory.name} stories yet` : "New stories are on their way"}</h2>
            <p className="mt-2 text-sm leading-6 text-[#675c4e]">Check back soon for news and notes from our workshop.</p>
            {activeCategory && <Link href="/blog" className="mt-5 inline-flex text-sm font-medium text-[#c46243] hover:underline">View all stories</Link>}
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.75fr)]">
            <div className="min-w-0">
              {featuredBlogs[0] && (
                <section aria-labelledby="featured-stories-heading">
                  <SectionHeader id="featured-stories-heading" title="Editor's Pick" />
                  <FeaturedSection blogs={featuredBlogs} />
                </section>
              )}

              {paginatedBlogs.length > 0 && (
                <section className="mt-12" aria-labelledby="latest-stories-heading">
                  <SectionHeader id="latest-stories-heading" title="Latest Stories" />
                  <div className="grid gap-6 sm:grid-cols-2">
                    {paginatedBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
                  </div>
                  <Pagination currentPage={safePage} totalPages={totalPages} query={blogQuery} />
                </section>
              )}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-24">
              <SidebarAbout />
              <SidebarPosts title="Popular Posts" blogs={featuredBlogs.length > 1 ? featuredBlogs.slice(1) : orderedByDate} />
              <SidebarCategories categories={categories} activeCategoryId={categoryId} />
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function BlogCard({ blog, priority = false }: { blog: Awaited<ReturnType<typeof getBlogs>>[number]; priority?: boolean }) {
  return (
    <article className="group overflow-hidden rounded border border-[#e6decb] bg-white">
      <Link href={`/blog/${blog.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-[#f2eada]">
        {blog.image && <Image src={blog.image} alt={blog.image_alt || blog.title} title={blog.image_title || undefined} fill priority={priority} sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />}
        {!blog.image && <div className="absolute inset-0 grid place-items-center"><BookOpen className="h-8 w-8 text-[#c46243]" /></div>}
      </Link>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#8a7e6d]">
          <span className="font-semibold uppercase tracking-[0.11em] text-[#a4642d]">{blog.category_name}</span><span aria-hidden="true">·</span><time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
        </div>
        <h3 className="mt-3 font-serif text-xl leading-snug text-[#28221c]"><Link href={`/blog/${blog.slug}`} className="transition-colors hover:text-[#c46243]">{blog.title}</Link></h3>
        {blog.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#675c4e]">{stripHtml(blog.excerpt)}</p>}
        <Link href={`/blog/${blog.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#c46243] transition-colors hover:text-[#28221c]">Continue reading <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></Link>
      </div>
    </article>
  );
}

function FeaturedSection({ blogs }: { blogs: Awaited<ReturnType<typeof getBlogs>> }) {
  const [lead, ...sidePosts] = blogs;
  return (
    <div className="grid gap-5 rounded border border-[#e6decb] bg-white p-5 sm:p-6 md:grid-cols-2">
      <FeaturedPost blog={lead} />
      {sidePosts.length > 0 && (
        <div className="space-y-4">
          {sidePosts.map((blog) => (
            <article key={blog.id} className="group grid grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-[#ece4d5] pb-4 last:border-0 last:pb-0">
              <Link href={`/blog/${blog.slug}`} className="relative h-[92px] overflow-hidden rounded bg-[#f2eada]">
                {blog.image && <Image src={blog.image} alt={blog.image_alt || blog.title} fill sizes="112px" className="object-cover transition duration-500 group-hover:scale-[1.03]" />}
              </Link>
              <div className="min-w-0 py-1">
                <time className="block text-[10px] text-[#8a7e6d]" dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                <h3 className="mt-2 font-serif text-base leading-snug text-[#28221c]">
                  <Link href={`/blog/${blog.slug}`} className="transition-colors hover:text-[#c46243]">{blog.title}</Link>
                </h3>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturedPost({ blog }: { blog: Awaited<ReturnType<typeof getBlogs>>[number] }) {
  return (
    <article className="group">
      <Link href={`/blog/${blog.slug}`} className="relative block aspect-[16/11] overflow-hidden rounded bg-[#f2eada]">
        {blog.image && <Image src={blog.image} alt={blog.image_alt || blog.title} title={blog.image_title || undefined} fill priority sizes="(max-width: 768px) 100vw, 34vw" className="object-cover transition duration-700 group-hover:scale-[1.02]" />}
        {!blog.image && <div className="absolute inset-0 grid place-items-center"><BookOpen className="h-10 w-10 text-[#c46243]" /></div>}
      </Link>
      <div className="pt-5">
        <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-[#8a7e6d]">
          <span className="font-semibold uppercase tracking-[0.13em] text-[#c46243]">{blog.category_name}</span>
          <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
          {blog.content && <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{estimateReadTime(blog.content)}</span>}
        </div>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-[#28221c]">
          <Link href={`/blog/${blog.slug}`} className="transition-colors hover:text-[#c46243]">{blog.title}</Link>
        </h2>
        {blog.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#675c4e]">{stripHtml(blog.excerpt)}</p>}
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, query }: { currentPage: number; totalPages: number; query: string }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-8 flex justify-center" aria-label="Blog pagination">
      <ul className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <li key={page}>
            <Link
              href={`/blog?page=${page}${query}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={`grid h-10 min-w-10 place-items-center rounded border px-3 text-sm transition ${page === currentPage ? "border-[#213d2f] bg-[#213d2f] text-white" : "border-[#e6decb] bg-white text-[#675c4e] hover:border-[#c46243] hover:text-[#c46243]"}`}
            >
              {page}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <div id={id} className="mb-5">
      <h2 className="font-serif text-2xl text-[#28221c]">{title}</h2>
      <Image src="/brand/logo-cloud.png?v=2" alt="" width={60} height={16} className="mt-2 h-2 w-14 object-contain" />
    </div>
  );
}

function SidebarAbout() {
  return (
    <div className="rounded border border-[#e6decb] bg-[#f7f2e8] p-6 text-center">
      <Image src="/brand/logo-cloud.png?v=2" alt="Nyanopan" width={76} height={46} className="mx-auto h-10 w-auto" />
      <p className="mt-4 text-sm leading-7 text-[#675c4e]">Stories of craft, care, and mountain living from our Kathmandu atelier.</p>
    </div>
  );
}

function SidebarPosts({ title, blogs }: { title: string; blogs: Awaited<ReturnType<typeof getBlogs>> }) {
  return (
    <div className="rounded border border-[#e6decb] p-6">
      <div className="mb-5 text-center">
        <h3 className="font-serif text-xl text-[#28221c]">{title}</h3>
        <Image src="/brand/logo-cloud.png?v=2" alt="" width={60} height={16} className="mx-auto mt-2 h-2 w-14 object-contain" />
      </div>
      {blogs.length === 0 ? <p className="text-sm text-[#8a7e6d]">More stories are coming soon.</p> : (
        <div className="space-y-4">
          {blogs.slice(0, 4).map((blog) => (
            <article key={blog.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
              <Link href={`/blog/${blog.slug}`} className="relative h-[72px] overflow-hidden rounded bg-[#f2eada]">
                {blog.image && <Image src={blog.image} alt="" fill sizes="72px" className="object-cover" />}
              </Link>
              <div>
                <h4 className="font-serif text-sm leading-snug text-[#28221c]"><Link href={`/blog/${blog.slug}`} className="hover:text-[#c46243]">{blog.title}</Link></h4>
                <time className="mt-1 block text-[11px] text-[#8a7e6d]" dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarCategories({ categories, activeCategoryId }: { categories: Awaited<ReturnType<typeof getBlogCategories>>; activeCategoryId?: string }) {
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

function dateValue(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadTime(html: string) {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
