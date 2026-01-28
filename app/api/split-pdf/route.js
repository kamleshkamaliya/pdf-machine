import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir, rm, readdir } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Time limit badha di (5 min) taaki badi file na ruke
export const maxDuration = 300; 
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const uniqueId = Date.now();
  const projectRoot = process.cwd();
  
  // Folders Setup
  const tempDir = path.join(projectRoot, 'temp_split', `${uniqueId}`);
  const outputDir = path.join(tempDir, 'output');
  const scriptPath = path.join(projectRoot, 'scripts', 'split_pdf.py');
  
  console.log("--- START SPLIT (PYTHON ENGINE) ---");

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const mode = formData.get('mode');
    const range = formData.get('range') || "";

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // 1. Files Save Karo
    await mkdir(tempDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const inputPdfPath = path.join(tempDir, "input.pdf");
    await writeFile(inputPdfPath, Buffer.from(bytes));

    // 2. Python Script Run Karo
    // Command: python3 script.py input output mode range
    const command = `python3 "${scriptPath}" "${inputPdfPath}" "${outputDir}" "${mode}" "${range}"`;
    
    console.log("Executing Python...");
    
    // maxBuffer: 50MB (Badi files ke logs crash nahi karenge)
    const { stdout, stderr } = await execPromise(command, { maxBuffer: 1024 * 1024 * 50 });

    if (stdout.includes("ERROR") || stderr) {
        console.error("Python Error:", stderr || stdout);
    }

    // 3. Output Check & Zip
    const files = await readdir(outputDir);
    if (files.length === 0) throw new Error("Processing failed. No files generated.");

    const zipPath = path.join(tempDir, "documents.zip");
    // Zip command (Fastest way)
    await execPromise(`cd "${outputDir}" && zip -r "${zipPath}" .`);

    const zipBuffer = await readFile(zipPath);

    // Cleanup
    await rm(tempDir, { recursive: true, force: true });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="split_documents.zip"`,
      },
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    // Cleanup on error
    try { await rm(tempDir, { recursive: true, force: true }); } catch(e) {}
    
    return NextResponse.json({ 
        error: "Server Error: Ensure Python is installed and file is valid." 
    }, { status: 500 });
  }
}