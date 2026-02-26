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
    const password = data.get("password");

    // 1. Basic Validation
    if (!file || !password) {
      return NextResponse.json({ error: "File aur password dono zaroori hain." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Temp Directory Setup (Server-safe 'tmp' folder)
    const tempDir = path.join(process.cwd(), "tmp");
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const inputPath = path.join(tempDir, `in_${Date.now()}.pdf`);
    const outputPath = path.join(tempDir, `out_${Date.now()}.pdf`);

    await writeFile(inputPath, buffer);

    // 3. Password Escaping (Special characters handle karne ke liye)
    const safePassword = password.replace(/'/g, "'\\''");
    
    // QPDF Decrypt Command
    const command = `qpdf --decrypt --password='${safePassword}' "${inputPath}" "${outputPath}"`;

    try {
      await execPromise(command);
    } catch (cmdError) {
      console.error("QPDF Command Error:", cmdError.stderr || cmdError.message);
      
      // Error ke waqt bhi cleanup karein
      if (existsSync(inputPath)) await unlink(inputPath);
      
      // Frontend ko JSON mein error bhejein
      return NextResponse.json({ 
        error: "Incorrect password or the file is already unlocked." 
      }, { status: 400 });
    }

    // 4. Result Read Karein
    const outputBuffer = await readFile(outputPath);

    // 5. Cleanup (Files delete karein taaki server storage na bhare)
    await unlink(inputPath);
    await unlink(outputPath);

    // 6. File Return Karein (Blob format mein)
    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Unlocked-${file.name}"`,
      },
    });

  } catch (error) {
    console.error("Critical API Error:", error);
    // Hamesha JSON bhejye taaki frontend crash na ho
    return NextResponse.json({ error: "Server Action Failed: " + error.message }, { status: 500 });
  }
}