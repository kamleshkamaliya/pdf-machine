import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto"; // 🔒 Hashing ke liye

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public/uploads");

// 🛠️ Helper: Calculate File Hash (Fingerprint)
function getFileHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Folder check/create
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2. File ko Buffer mein convert karein
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ 3. DUPLICATE CHECK (Smart Logic)
    // Hum naye file ka hash (fingerprint) banayenge
    const newFileHash = getFileHash(buffer);
    
    // Server par maujood saari files scan karenge
    const existingFiles = fs.readdirSync(uploadDir);

    for (const existingFile of existingFiles) {
      const existingFilePath = path.join(uploadDir, existingFile);
      
      // Agar file folder nahi hai toh check karo
      if (fs.statSync(existingFilePath).isFile()) {
        const existingFileBuffer = fs.readFileSync(existingFilePath);
        const existingHash = getFileHash(existingFileBuffer);

        // 🛑 AGAR HASH MATCH HUA (Matlab same photo hai)
        if (newFileHash === existingHash) {
          console.log(`Duplicate found! Using existing: ${existingFile}`);
          return NextResponse.json({ 
            url: `/uploads/${existingFile}`, 
            message: "Duplicate image detected. Using existing file." 
          });
        }
      }
    }

    // ✅ 4. Agar Duplicate nahi hai, tabhi Save karein
    // Filename safe banayein (spaces hata kar)
    const sanitizedFilename = file.name.replace(/\s+/g, "-").toLowerCase();
    
    // Agar same naam ki file hai (par content alag hai), toh timestamp jod dein
    let finalFilename = sanitizedFilename;
    if (fs.existsSync(path.join(uploadDir, finalFilename))) {
       const timestamp = Date.now();
       const namePart = sanitizedFilename.split(".")[0];
       const extPart = sanitizedFilename.split(".").pop();
       finalFilename = `${namePart}-${timestamp}.${extPart}`;
    }

    const filePath = path.join(uploadDir, finalFilename);
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({ 
      url: `/uploads/${finalFilename}`,
      message: "File uploaded successfully." 
    });

  } catch (e) {
    console.error("Upload Error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}