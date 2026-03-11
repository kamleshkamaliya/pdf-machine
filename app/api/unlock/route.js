import { NextResponse } from "next/server";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";

const execPromise = promisify(exec);

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    
    // Trim spaces and escape quotes for safe password
    const rawPassword = data.get("password") || "";
    const password = rawPassword.trim().replace(/"/g, '\\"');

    if (!file || !password) {
      return NextResponse.json({ error: "File and password required." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = path.join(process.cwd(), "tmp");
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const inputPath = path.join(tempDir, `in_${Date.now()}.pdf`);
    const outputPath = path.join(tempDir, `out_${Date.now()}.pdf`);

    await writeFile(inputPath, buffer);

    const command = `qpdf --decrypt --password="${password}" "${inputPath}" "${outputPath}"`;

    try {
      await execPromise(command);
    } catch (cmdError) {
      // 🚨 FIX: QPDF Exit Code 3 means "Success with warnings" (Standard for Bank PDFs)
      if (cmdError.code === 3) {
        console.log("✅ Bank PDF Unlocked successfully (ignoring QPDF structural warnings).");
      } else {
        console.error("❌ REAL QPDF ERROR:", cmdError.stderr || cmdError.message);
        if (existsSync(inputPath)) await unlink(inputPath);
        if (existsSync(outputPath)) await unlink(outputPath);
        return NextResponse.json({ error: "Incorrect password or corrupted file." }, { status: 400 });
      }
    }

    // Check if the unlocked file was successfully generated
    if (!existsSync(outputPath)) {
      if (existsSync(inputPath)) await unlink(inputPath);
      return NextResponse.json({ error: "Could not generate unlocked file." }, { status: 400 });
    }

    // Success path
    const outputBuffer = await readFile(outputPath);
    
    // Cleanup
    await unlink(inputPath);
    await unlink(outputPath);

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Unlocked-${file.name}"`,
      },
    });

  } catch (error) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}