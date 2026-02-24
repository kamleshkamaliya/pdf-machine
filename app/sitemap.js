import { prisma } from "@/lib/prisma";

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

  // 2. Apne saare Tools aur Static Pages ki list yahan rakhein
  // Jab bhi naya tool banao, bas uska naam is array mein daal do
  const pageRoutes = [
    '', // Homepage
    '/blog',
    '/merge-pdf',
    '/split-pdf',
    '/compress-pdf',
    '/jpg-to-pdf',
    '/pdf-to-jpg',
    '/pdf-to-word',
    '/protect-pdf',
    '/unlock-pdf', // Naya tool
    '/contact',
    '/privacy-policy',
    '/terms',
  ];

  const staticEntries = pageRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // 3. Sabko merge karke return karo
  return [...staticEntries, ...blogEntries];
}