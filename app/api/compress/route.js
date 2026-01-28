import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir, rm, unlink } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

export async function POST(req) {
  const tempDir = os.tmpdir();
  const uniqueId = Date.now();
  // Folder ka naam simple rakha
  const inputPath = path.join(tempDir, `raw_${uniqueId}.pdf`);
  const outputPath = path.join(tempDir, `optimized_${uniqueId}.pdf`);
  const cleanupFiles = [inputPath, outputPath];

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    await writeFile(inputPath, Buffer.from(bytes));

    // --- QPDF COMMAND (Best Safe Compression) ---
    // 1. --stream-data=compress: Text aur data ko dabata hai.
    // 2. --object-streams=generate: Tukdon ko jod kar jagah bachata hai.
    // 3. --recompress-flate: Internal data ko optimize karta hai.
    // Ye images blur nahi karega, par file ka structure clean kar dega.
    
    const command = `qpdf --stream-data=compress --object-streams=generate --recompress-flate "${inputPath}" "${outputPath}"`;
    
    console.log("Running QPDF...");
    await execPromise(command);

    const outputBuffer = await readFile(outputPath);

    // Safai
    await cleanup(cleanupFiles);

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="optimized.pdf"',
      },
    });

  } catch (error) {
    console.error("QPDF Error:", error);
    await cleanup(cleanupFiles);
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 });
  }
}

async function cleanup(files) {
  for (const file of files) {
    try { await unlink(file); } catch (err) {}
  }
}