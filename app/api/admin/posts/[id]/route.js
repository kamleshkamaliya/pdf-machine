import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 👈 Path check kar lena agar alag ho

export const runtime = "nodejs";

// Helper for tags parsing
function parseTags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return String(input).split(",").map((t) => t.trim()).filter(Boolean);
}

// ✅ GET Single Post (Edit Page ke liye data fetch)
export async function GET(req, { params }) {
  try {
    // 🛠️ FIX: Next.js 15 mein params ko await karna zaroori hai
    const { id } = await params; 

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: { tag: true }, // Tags bhi sath layein
        },
      },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // Data Transformation: Tags array ko string "tag1, tag2" banaya
    const formattedPost = {
      ...post,
      tags: post.tags.map((t) => t.tag.name).join(", "),
    };

    return NextResponse.json(formattedPost); 

  } catch (e) {
    console.error("GET Error:", e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ✅ PATCH Update Post
export async function PATCH(req, { params }) {
  try {
    // 🛠️ FIX: Params await kiya
    const { id } = await params;
    const body = await req.json();

    // Tags list banayein
    const tagsList = parseTags(body.tags);

    // 1. Purane tags delete karein (Is post ke liye)
    // Note: await params ke baad hi 'id' use kar sakte hain
    await prisma.postTag.deleteMany({ where: { postId: id } });

    // 2. Post Update karein
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        
        seoTitle: body.seoTitle,
        metaDescription: body.metaDescription,
        authorName: body.authorName,
        featuredImageUrl: body.featuredImageUrl,
        featuredImageAlt: body.featuredImageAlt,
        
        status: body.status,

        // Date Logic
        publishedAt: body.publishedAt 
          ? new Date(body.publishedAt) 
          : (body.status === "PUBLISHED" ? new Date() : null),

        // Tags update logic (Naye tags create/connect)
        tags: {
          create: tagsList.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
    });

    return NextResponse.json({ ok: true, post: updatedPost });

  } catch (e) {
    console.error("Update Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ✅ DELETE Post
export async function DELETE(req, { params }) {
  try {
    // 🛠️ FIX: Params await kiya
    const { id } = await params;

    await prisma.post.delete({ where: { id } });
    
    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error("Delete Error:", e);
    return NextResponse.json({ error: "Delete Failed" }, { status: 500 });
  }
}