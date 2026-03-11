import { NextResponse } from "next/server";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import path from "path";
// FIX 1: Use execFile instead of exec
import { execFile } from "child_process"; 
import { promisify } from "util";
import { existsSync } from "fs";

const execFilePromise = promisify(execFile);

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const password = data.get("password");

    // 1. Basic Validation
    if (!file || !password) {
      return NextResponse.json({ error: "File aur password dono zaroori hain." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Temp Directory Setup
    const tempDir = path.join(process.cwd(), "tmp");
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const inputPath = path.join(tempDir, `in_${Date.now()}.pdf`);
    const outputPath = path.join(tempDir, `out_${Date.now()}.pdf`);

    await writeFile(inputPath, buffer);

    // 3. QPDF Decrypt Command
    try {
      // FIX 2: execFile passes arguments as an array. 
      // This means we DON'T need to escape special characters with regex. 
      // The OS handles it safely, which is crucial for complex bank passwords.
      await execFilePromise("qpdf", [
        "--decrypt",
        `--password=${password}`,
        inputPath,
        outputPath
      ]);
      
    } catch (cmdError) {
      // FIX 3: THE BANK STATEMENT FIX
      // Bank PDFs often have structural warnings. QPDF fixes them but exits with code 3.
      // If code is 3 AND the outputPath was actually created, it was a success!
      if (cmdError.code === 3 && existsSync(outputPath)) {
        console.warn("QPDF Warnings (Common with Bank PDFs), but decryption succeeded.");
      } else {
        console.error("QPDF Command Error:", cmdError.stderr || cmdError.message);
        
        // Error cleanup
        if (existsSync(inputPath)) await unlink(inputPath);
        if (existsSync(outputPath)) await unlink(outputPath);
        
        return NextResponse.json({ 
          error: "Incorrect password or the file is heavily corrupted." 
        }, { status: 400 });
      }
    }

    // 4. Result Read Karein
    const outputBuffer = await readFile(outputPath);

    // 5. Cleanup
    await unlink(inputPath);
    await unlink(outputPath);

    // 6. File Return Karein
    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Unlocked-${file.name}"`,
      },
    });

  } catch (error) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ error: "Server Action Failed: " + error.message }, { status: 500 });
  }
}