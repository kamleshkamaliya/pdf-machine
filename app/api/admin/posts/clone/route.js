import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const id = body.id;

    console.log("Attempting to clone Post ID:", id); // 🛠️ Debug log

    if (!id) {
      return NextResponse.json({ error: "Post ID missing" }, { status: 400 });
    }

    // 1. Fetch Original Post
    const originalPost = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } }
      }
    });

    if (!originalPost) {
      console.error("Original Post NOT FOUND");
      return NextResponse.json({ error: "Original post not found" }, { status: 404 });
    }

    // 2. Prepare Tags Logic (Handle empty tags safely)
    let tagsOperation = {};
    if (originalPost.tags && originalPost.tags.length > 0) {
      tagsOperation = {
        create: originalPost.tags.map((t) => ({
          tag: {
            connect: { id: t.tag.id }
          }
        }))
      };
    }

    // 3. Create Clone
    const newSlug = `${originalPost.slug}-copy-${Math.floor(Math.random() * 10000)}`;
    
    const newPost = await prisma.post.create({
      data: {
        title: `${originalPost.title} (Copy)`,
        slug: newSlug,
        content: originalPost.content || "",
        excerpt: originalPost.excerpt || "",
        status: "DRAFT", // Always draft
        
        seoTitle: originalPost.seoTitle,
        metaDescription: originalPost.metaDescription,
        authorName: originalPost.authorName,
        featuredImageUrl: originalPost.featuredImageUrl,
        featuredImageAlt: originalPost.featuredImageAlt,
        
        publishedAt: null,

        // ✅ Safe Tag Copying
        tags: tagsOperation,
      },
    });

    console.log("Clone Success:", newPost.id);
    return NextResponse.json({ ok: true, post: newPost });

  } catch (error) {
    console.error("CLONE API ERROR:", error); // 👈 Terminal me ye error check karein
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}