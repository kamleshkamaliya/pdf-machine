import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);

export const runtime = "nodejs";

// 📂 Folder Path
const uploadDir = path.join(process.cwd(), "public/uploads");

// ✅ GET: Saari Images List Karo
export async function GET() {
  try {
    // Check agar folder exist karta hai
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = await readdir(uploadDir);

    // Sirf images filter karein aur details banayein
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(uploadDir, file);
        const stats = await stat(filePath);
        return {
          name: file,
          url: `/uploads/${file}`,
          size: (stats.size / 1024).toFixed(2) + " KB", // Size in KB
          date: stats.mtime,
        };
      })
    );

    // Sort by Date (Newest first)
    fileStats.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({ files: fileStats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}

// ❌ DELETE: Image Delete Karo
export async function DELETE(req) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    const filePath = path.join(uploadDir, filename);

    // Check agar file hai
    if (fs.existsSync(filePath)) {
      await unlink(filePath);
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}