import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

// ❌ export default function POST(...) -- YEH GALAT HAI
// ✅ export async function POST(...)    -- YEH SAHI HAI

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: "No file found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cleanFilename = file.name.replace(/\s+/g, "-").toLowerCase();
    const finalName = `${Date.now()}-${cleanFilename}`;

    const uploadDir = path.join(process.cwd(), "public/uploads");
    const pathOfFile = path.join(uploadDir, finalName);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(pathOfFile, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${finalName}` 
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}