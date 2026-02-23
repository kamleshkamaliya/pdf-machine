import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Slug Helper
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// ✅ GET: Fetch All Posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tags: { include: { tag: true } }, // Tags wapas aa gaye
      },
    });

    // Formatting tags for frontend
    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag.name),
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}

// ✅ POST: Create New Post
export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Title Validation
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // 2. Smart Slug Logic (Fix for Duplicates)
    let slug = generateSlug(body.slug || body.title);
    const existingSlug = await prisma.post.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`; // Agar duplicate hai to ID jod do
    }

    // 3. Date Fix (Empty Date Crash Fix)
    let publishedAt = null;
    if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt);
    } else if (body.status === "PUBLISHED") {
      publishedAt = new Date();
    }

    // 4. Tags Logic (Tags ko wapas joda)
    let tagsData = {};
    if (body.tags) {
      // String "pdf, tool" ko Array ["pdf", "tool"] mein badla
      const tagList = Array.isArray(body.tags) 
        ? body.tags 
        : body.tags.split(",").map(t => t.trim()).filter(t => t);

      if (tagList.length > 0) {
        tagsData = {
          create: tagList.map((tag) => ({
            tag: {
              connectOrCreate: { where: { name: tag }, create: { name: tag } },
            },
          })),
        };
      }
    }

    // 5. Create Post
    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        slug: slug,
        content: body.content || "",
        excerpt: body.excerpt || "",
        status: body.status || "DRAFT",
        publishedAt: publishedAt,
        
        // SEO & Images
        seoTitle: body.seoTitle || "",
        metaDescription: body.metaDescription || "",
        authorName: body.authorName || "Admin",
        featuredImageUrl: body.featuredImageUrl || "",
        featuredImageAlt: body.featuredImageAlt || "",
        
        tags: tagsData,
      },
    });

    return NextResponse.json({ ok: true, post: newPost });

  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}