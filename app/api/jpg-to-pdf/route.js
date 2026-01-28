import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir, rm } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

export async function POST(req) {
  const tempDir = os.tmpdir();
  const uniqueId = Date.now();
  const workDir = path.join(tempDir, `ocr_work_${uniqueId}`);
  
  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // 1. Setup Work Directory
    await mkdir(workDir);

    // 2. Images Save Karo & List Banao
    const imageListPath = path.join(workDir, "images.txt");
    let imageListContent = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      // Extension safe rakho
      const ext = path.extname(file.name) || ".jpg"; 
      const imagePath = path.join(workDir, `img_${i}${ext}`);
      
      await writeFile(imagePath, buffer);
      imageListContent += `${imagePath}\n`;
    }

    await writeFile(imageListPath, imageListContent);

    // 3. RUN TESSERACT (OCR Engine) 🧠
    // Ye images ko padhega aur PDF banayega jisme text select ho sake.
    const outputBase = path.join(workDir, "output");
    const command = `tesseract "${imageListPath}" "${outputBase}" pdf`;

    console.log("Running OCR...");
    await execPromise(command);

    // 4. Output Read
    const finalPdfPath = outputBase + ".pdf";
    const outputBuffer = await readFile(finalPdfPath);

    // 5. Cleanup
    await rm(workDir, { recursive: true, force: true });

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="searchable.pdf"',
      },
    });

  } catch (error) {
    console.error("OCR Error:", error);
    // Cleanup on error
    try { await rm(workDir, { recursive: true, force: true }); } catch(e) {}
    return NextResponse.json({ error: "Server OCR Failed. Is Tesseract installed?" }, { status: 500 });
  }
}