import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// ✅ 1. Metadata Generator (Dynamic Canonical URL for SEO)
export async function generateMetadata({ searchParams }) {
  const params = await searchParams; // Wait for params
  const page = parseInt(params.page) || 1;
  
  return {
    title: `PDF Machine Blog - Page ${page} | Expert Tips & Tutorials`,
    description: "Explore our latest articles on how to compress, merge, protect, and convert PDFs. Get expert tips to improve your document workflow efficiently.",
    alternates: {
      canonical: `https://pdfmachine.pro/blog?page=${page}`,
    },
  };
}

// ✅ 2. Data Fetching with Pagination Logic
const POSTS_PER_PAGE = 9;

async function getPosts(page) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, totalCount] = await Promise.all([
    // Fetch limited posts
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: POSTS_PER_PAGE,
      skip: skip,
      include: {
        tags: { include: { tag: true } },
      },
    }),
    // Count total published posts
    prisma.post.count({ where: { status: "PUBLISHED" } }),
  ]);

  return { posts, totalCount };
}

export default async function BlogListing({ searchParams }) {
  // ✅ Parse page number from URL (e.g., ?page=2)
  const params = await searchParams;
  const currentPage = parseInt(params.page) || 1;
  
  const { posts, totalCount } = await getPosts(currentPage);
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 🟧 Hero Section */}
      <div className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#ff3b1d] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[#ff3b1d] font-bold tracking-widest text-xs uppercase mb-4 block">
            Resources & Tutorials
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            PDF Machine <span className="text-[#ff3b1d]">Blog</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Discover simple guides to handle your PDF tasks. Expert tips to manage your documents like a pro.
          </p>
        </div>
      </div>

      {/* 🟧 Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 relative z-20">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full block">
                  <article className="h-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#ff3b1d]/30">
                    
                    {/* Image Container */}
                    <div className="h-52 w-full bg-slate-100 relative overflow-hidden">
                      {post.featuredImageUrl ? (
                        <img
                          src={post.featuredImageUrl}
                          alt={post.featuredImageAlt || post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                          <span className="font-black text-4xl opacity-20">PDF</span>
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#ff3b1d]" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 flex-1 flex flex-col">
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((t) => (
                            <span key={t.tag.id} className="text-[10px] font-bold uppercase tracking-wider text-[#ff3b1d] bg-orange-50 border border-orange-100 px-2 py-1 rounded-md">
                              {t.tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-xl font-black text-slate-900 mb-3 leading-snug group-hover:text-[#ff3b1d] transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                        {post.excerpt || post.metaDescription || "Read full article..."}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                        
                        <span className="text-xs font-bold text-[#ff3b1d] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read Article <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* 🟧 Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                {/* Prev Button */}
                {currentPage > 1 ? (
                  <Link 
                    href={`/blog?page=${currentPage - 1}`} 
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:border-[#ff3b1d] hover:text-[#ff3b1d] transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Link>
                ) : (
                  <button disabled className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 text-slate-300 font-bold rounded-full cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                )}

                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </span>

                {/* Next Button */}
                {currentPage < totalPages ? (
                  <Link 
                    href={`/blog?page=${currentPage + 1}`} 
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:border-[#ff3b1d] hover:text-[#ff3b1d] transition-all shadow-sm"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button disabled className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 text-slate-300 font-bold rounded-full cursor-not-allowed">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <div className="inline-block p-4 rounded-full bg-orange-50 mb-4">
              <Calendar className="w-8 h-8 text-[#ff3b1d]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No posts published yet</h3>
            <p className="text-slate-500 mt-2">New content is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}