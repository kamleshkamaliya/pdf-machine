import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir, rm, readdir } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

export async function POST(req) {
  const tempDir = os.tmpdir();
  const uniqueId = Date.now();
  const workDir = path.join(tempDir, `pdf2jpg_multi_${uniqueId}`);
  
  try {
    const formData = await req.formData();
    const files = formData.getAll('files'); // Multiple files grab karna

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // 1. Setup Work Directory
    await mkdir(workDir);

    // 2. Process Each PDF
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      
      // Har PDF ka alag naam rakho taaki mix na ho
      // Example: file_0_input.pdf, file_1_input.pdf
      const pdfPath = path.join(workDir, `file_${i}.pdf`);
      await writeFile(pdfPath, Buffer.from(bytes));

      // Output prefix: file_0_page (banega file_0_page-1.jpg, file_0_page-2.jpg)
      const imagePrefix = path.join(workDir, `file_${i}_page`);
      
      // Run Poppler
      const convertCommand = `pdftoppm -jpeg -r 300 "${pdfPath}" "${imagePrefix}"`;
      await execPromise(convertCommand);
    }

    // 3. Count Total Generated JPGs
    const allFiles = await readdir(workDir);
    const jpgFiles = allFiles.filter(f => f.endsWith('.jpg'));

    let outputBuffer;
    let contentType;
    let fileName;

    // --- LOGIC: SINGLE IMAGE vs MULTIPLE IMAGES ---
    if (jpgFiles.length === 1) {
        // Sirf 1 image bani (Matlab 1 PDF thi aur uska 1 hi page tha)
        const singleImgPath = path.join(workDir, jpgFiles[0]);
        outputBuffer = await readFile(singleImgPath);
        contentType = 'image/jpeg';
        fileName = 'converted_page.jpg';
    } else {
        // Multiple images hain (Ya to multiple PDFs thi, ya pages zyada the) -> ZIP karo
        const zipPath = path.join(workDir, "images.zip");
        const zipCommand = `cd "${workDir}" && zip images.zip *.jpg`;
        await execPromise(zipCommand);
        
        outputBuffer = await readFile(zipPath);
        contentType = 'application/zip';
        fileName = 'converted_images.zip';
    }

    // 4. Cleanup
    await rm(workDir, { recursive: true, force: true });

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Conversion Error:", error);
    try { await rm(workDir, { recursive: true, force: true }); } catch(e) {}
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}