import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir, rm, readdir } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req) {
  const uniqueId = Date.now();
  const projectRoot = process.cwd(); 
  const workDir = path.join(projectRoot, 'temp_ocr', `${uniqueId}`);
  const scriptPath = path.join(projectRoot, 'scripts', 'pdf2word_ocr.py');
  
  const pythonCommand = 'python3'; 

  console.log("--- START PDF TO WORD (HEAVY LOAD SUPPORT) ---");

  try {
    const formData = await req.formData();
    const files = formData.getAll('files'); // Ab frontend se 1 hi file aayegi

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    await mkdir(workDir, { recursive: true });

    // Loop (Sirf 1 file ke liye chalega)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const pdfPath = path.join(workDir, `doc_${i}.pdf`);
      const docxPath = path.join(workDir, `doc_${i}.docx`);
      
      await writeFile(pdfPath, Buffer.from(bytes));

      console.log(`Processing File ${i+1} (Size: ${file.size} bytes)...`);
      const command = `${pythonCommand} "${scriptPath}" "${pdfPath}" "${docxPath}"`;
      
      try {
        // 🛠️ CRITICAL UPDATE FOR LARGE FILES
        // Timeout: 5 Minutes (300000ms) - Kyunki 24 pages time lete hain
        // MaxBuffer: 50MB - Taaki logs overflow na ho
        const { stdout, stderr } = await execPromise(command, { 
            maxBuffer: 1024 * 1024 * 50, 
            timeout: 300000 
        });
        
        // Logs print karo par error mat throw karo agar file ban gayi hai
        console.log("Python Output:", stdout);
        if (stderr) console.log("Python Log/Warnings:", stderr);

        // Sirf Critical Errors check karo (Missing Library / Crash)
        if (stdout.includes("CRITICAL_IMPORT_ERROR")) throw new Error(`Server Config Error: ${stdout}`);
        
        // Agar 'stderr' mein warnings hain to ignore karo, bas check karo DOCX bana ya nahi

      } catch (err) {
        // Agar timeout hua to ye error aayega
        console.error("Execution Error:", err);
        
        // Agar error signal 'kill' hai to matlab Timeout hua
        if (err.signal === 'SIGTERM') {
            throw new Error("File is too large or complex. The conversion timed out after 5 minutes.");
        }
        
        const msg = err.stdout || err.stderr || err.message;
        throw new Error(`Engine Error: ${msg.substring(0, 200)}...`);
      }
    }

    // Check Output
    const allFiles = await readdir(workDir);
    const docxFiles = allFiles.filter(f => f.endsWith('.docx'));

    if (docxFiles.length === 0) {
        throw new Error("Conversion finished but no DOCX file was created. The PDF might be password protected or corrupted.");
    }

    // Return Single File
    const outputBuffer = await readFile(path.join(workDir, docxFiles[0]));
    const contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const fileName = 'converted_document.docx';

    await rm(workDir, { recursive: true, force: true });

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    try { await rm(workDir, { recursive: true, force: true }); } catch(e) {}
    
    return NextResponse.json({ 
        error: error.message || "Server Error" 
    }, { status: 500 });
  }
}