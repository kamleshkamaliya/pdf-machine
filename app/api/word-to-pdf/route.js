import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(tempDir, { recursive: true });

    const inputPath = path.join(tempDir, file.name);
    const outputDir = tempDir;
    const pdfFileName = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
    const outputPath = path.join(outputDir, pdfFileName);

    await fs.writeFile(inputPath, buffer);

    // Standard LibreOffice Conversion (Clean & Reliable)
    await execPromise(`soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`);

    const pdfBuffer = await fs.readFile(outputPath);

    // Cleanup: Files delete kar dete hain processing ke baad
    await Promise.all([fs.unlink(inputPath), fs.unlink(outputPath)]);

    console.log("✅ Word to PDF: Converted using LibreOffice");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfFileName}"`,
      },
    });
  } catch (error) {
    console.error("❌ Conversion Error:", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}