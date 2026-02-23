import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug"; // Ensure slugify helper exists or remove usage

export const runtime = "nodejs";

// Helper for tags parsing
function parseTags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return String(input).split(",").map(t => t.trim()).filter(Boolean);
}

// ✅ GET Single Post (Fix for Edit Page)
export async function GET(_req, ctx) {
  try {
    const params = await ctx.params;
    const id = params?.id;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: { tag: true } // ✅ Tags fetch karna zaroori hai
        }
      }
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // ✅ Data Transformation: Tags array ko "tag1, tag2" string banaya
    const formattedPost = {
      ...post,
      tags: post.tags.map(t => t.tag.name).join(", "), 
    };

    return NextResponse.json({ post: formattedPost });

  } catch (e) {
    console.error("GET Error:", e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// ✅ PATCH Update Post
export async function PATCH(req, ctx) {
  try {
    const params = await ctx.params;
    const id = params?.id;
    const body = await req.json();

    // Tags array for DB
    const tagsList = parseTags(body.tags);

    // 1. Clear old tags
    await prisma.postTag.deleteMany({ where: { postId: id } });

    // 2. Update Post & Add new tags
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content, // ✅ Content save ho raha hai
        
        seoTitle: body.seoTitle,
        metaDescription: body.metaDescription,
        authorName: body.authorName,
        featuredImageUrl: body.featuredImageUrl,
        featuredImageAlt: body.featuredImageAlt,
        
        status: body.status,
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,

        tags: {
          create: tagsList.map(name => ({
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
export async function DELETE(_req, ctx) {
  const params = await ctx.params;
  const id = params?.id;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}