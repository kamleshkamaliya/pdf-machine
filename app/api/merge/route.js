import { NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

// Exec ko promise banate hain taaki await use kar sakein
const execPromise = util.promisify(exec);

export async function POST(req) {
  // Temporary folder ka rasta (Mac/Linux/Windows sabke liye)
  const tempDir = os.tmpdir();
  
  // Safai ke liye list (files to delete)
  const cleanupFiles = [];

  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (files.length < 2) {
      return NextResponse.json({ error: "Kam se kam 2 files chahiye" }, { status: 400 });
    }

    // 1. Files ko Temp folder me save karna
    const inputPaths = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // File ka naam unique rakhenge
      const fileName = `input_${Date.now()}_${i}.pdf`;
      const filePath = path.join(tempDir, fileName);
      
      await writeFile(filePath, buffer);
      inputPaths.push(filePath);
      cleanupFiles.push(filePath); // List me daal do delete karne ke liye
    }

    // Output file ka path
    const outputFileName = `merged_${Date.now()}.pdf`;
    const outputPath = path.join(tempDir, outputFileName);
    cleanupFiles.push(outputPath); // Isko bhi baad me hatana hai

    // 2. pdfcpu Command chalana (Server par)
    // Command: pdfcpu merge "output.pdf" "in1.pdf" "in2.pdf"
    const command = `pdfcpu merge "${outputPath}" ${inputPaths.map(p => `"${p}"`).join(' ')}`;

    // Command run karo
    await execPromise(command);

    // 3. Bani hui file ko padhna (Read)
    const outputBuffer = await readFile(outputPath);

    // Response bhejne se pehle Safai (Cleanup)
    // Hum background me delete karenge (await nahi lagaya taaki user ko wait na karna pade)
    cleanup(cleanupFiles);

    // 4. File user ko wapas bhejo
    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged-document.pdf"',
      },
    });

  } catch (error) {
    console.error("Merge Error:", error);
    // Error aane par bhi safai zaroori hai
    cleanup(cleanupFiles);
    return NextResponse.json({ error: "Merge failed on server" }, { status: 500 });
  }
}

// Safai karne wala function
async function cleanup(files) {
  for (const file of files) {
    try {
      await unlink(file); // File delete command
    } catch (err) {
      // Agar file pehle hi hat gayi to ignore karo
    }
  }
}