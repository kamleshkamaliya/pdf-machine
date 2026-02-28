import { prisma } from "@/lib/prisma";

// 👇 1. IS LINE KO ADD KAREIN: Ye Next.js ko har baar fresh data lene par majboor karega
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export default async function sitemap() {
  const baseUrl = 'https://pdfmachine.pro';

  // 1. Database se Blog Posts fetch karo (Auto-Update)
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const pageRoutes = [
    '', 
    '/blog',
    '/merge-pdf',
    '/split-pdf',
    '/compress-pdf',
    '/jpg-to-pdf',
    '/pdf-to-jpg',
    '/pdf-to-word',
    '/protect-pdf',
    '/unlock-pdf', 
    '/contact',
    '/privacy-policy',
    '/terms',
    '/unlock-pdf',
    '/word-to-pdf',
    '/pdf-to-word',
    '/resume-scorer',
    
    
    
    
  ];

  const staticEntries = pageRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticEntries, ...blogEntries];
}