import { NextResponse } from "next/server";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { existsSync, statSync } from "fs";

const execFilePromise = promisify(execFile);

export async function POST(req) {
  // Variables ko bahar define kiya hai taaki 'finally' block inko access kar sake
  let inputPath = null;
  let outputPath = null;

  try {
    const data = await req.formData();
    const file = data.get("file");
    const password = (data.get("password") || "").trim();

    if (!file || !password) {
      return NextResponse.json({ error: "File and password required." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = path.join(process.cwd(), "tmp");
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    inputPath = path.join(tempDir, `in_${Date.now()}.pdf`);
    outputPath = path.join(tempDir, `out_${Date.now()}.pdf`);

    await writeFile(inputPath, buffer);

    try {
      await execFilePromise("qpdf", [
        "--decrypt",
        `--password=${password}`,
        inputPath,
        outputPath
      ]);
    } catch (cmdError) {
      if (cmdError.code === 3) {
        console.log("✅ Bank PDF Unlocked successfully (ignoring QPDF structural warnings).");
      } else {
        throw new Error("Incorrect password or corrupted file."); // Throw to catch block
      }
    }

    if (existsSync(outputPath)) {
      const stats = statSync(outputPath);
      if (stats.size > 0) {
        const outputBuffer = await readFile(outputPath);
        
        return new NextResponse(outputBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Unlocked-${file.name}"`,
          },
        });
      }
    }

    throw new Error("Could not generate unlocked file.");

  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 400 });
  } finally {
    // 🧹 THE GUARANTEED CLEANUP: Yeh block hamesha chalega (Success ho ya Error)
    try {
      if (inputPath && existsSync(inputPath)) {
        await unlink(inputPath);
      }
      if (outputPath && existsSync(outputPath)) {
        await unlink(outputPath);
      }
      console.log("🧹 Temp files successfully deleted from server.");
    } catch (cleanupError) {
      console.error("Cleanup Error:", cleanupError);
    }
  }
}