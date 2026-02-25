import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Filename saaf karein (Spaces hatao, lowercase karo)
    // Example: "My Photo.jpg" -> "my-photo.jpg"
    const cleanFilename = file.name.replace(/\s+/g, "-").toLowerCase();
    
    // 2. Timestamp lagayein taaki naam duplicate na ho
    const finalName = `${Date.now()}-${cleanFilename}`;

    // 3. Path set karein
    const pathOfFile = path.join(process.cwd(), 'public/uploads', finalName);
    
    await writeFile(pathOfFile, buffer);

    // 4. URL return karein (Bina 'public' ke)
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${finalName}` 
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}