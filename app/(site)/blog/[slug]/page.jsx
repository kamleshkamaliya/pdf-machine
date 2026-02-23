import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import SharePost from "@/app/components/SharePost";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ 
    where: { slug },
    include: { tags: { include: { tag: true } } }
  });

  if (!post || post.status !== "PUBLISHED") {
    return { title: "Post Not Found" };
  }

  const siteUrl = "https://pdfmachine.pro";
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const shareImage = post.featuredImageUrl || `${siteUrl}/default-og-image.jpg`; // Ek default image public folder mein rakhein

  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url: postUrl,
      siteName: "PDF Machine Pro",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.authorName || "Admin"],
      tags: post.tags?.map(t => t.tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [shareImage],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { tags: { include: { tag: true } } }
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* 🟢 Hero Section */}
      <div className="relative bg-slate-50 pt-16 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#ff3b1d] transition-colors mb-10 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Blog
          </Link>

          {/* Meta Info */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
              <Calendar className="w-3.5 h-3.5 text-[#ff3b1d]" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              }) : "Recently Published"}
            </span>

      
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-8">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {post.tags.map((t) => (
                <span key={t.tag.id} className="text-xs font-bold px-3 py-1 rounded-lg bg-orange-50 text-[#ff3b1d] border border-orange-100">
                  #{t.tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🖼️ Featured Image */}
      {post.featuredImageUrl && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 mb-16 relative z-10">
          <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-900/10 border-4 border-white bg-white">
            <img 
              src={post.featuredImageUrl} 
              alt={post.featuredImageAlt || post.title} 
              className="w-full h-auto max-h-[500px] object-cover mx-auto"
            />
          </div>
        </div>
      )}

      {/* 📝 Content Area */}
      <article className="max-w-3xl mx-auto px-6 pt-0">
        
        <div 
          className="prose prose-lg max-w-none blog-content-style 
            prose-headings:font-black prose-headings:text-slate-900 prose-headings:mt-12 prose-headings:mb-6
            prose-p:text-slate-600 prose-p:leading-8 prose-p:mb-6
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-a:text-[#ff3b1d] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-3xl prose-img:shadow-lg prose-img:my-12 prose-img:w-full
            prose-li:marker:text-[#ff3b1d] prose-li:mb-2
            prose-ul:pl-6 prose-ol:pl-6
            prose-blockquote:border-l-[#ff3b1d] prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-blockquote:my-10"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* ✅ Pass Title and URL explicitly to Share Component */}
        <SharePost 
          title={post.title} 
          url={`https://pdfmachine.pro/blog/${post.slug}`} 
        />

      </article>
    </div>
  );
}