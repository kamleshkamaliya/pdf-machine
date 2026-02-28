import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { createReadStream, existsSync } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { getAdobeUsage, incrementUsage } from "@/lib/usage-tracker";
import {
  ServicePrincipalCredentials,
  PDFServices,
  ExportPDFJob,
  ExportPDFParams,
  ExportPDFTargetFormat,
} from "@adobe/pdfservices-node-sdk";

const execPromise = promisify(exec);

export async function POST(req) {
  const tempDir = path.join(process.cwd(), "tmp");
  const scriptsDir = path.join(process.cwd(), "scripts");
  
  // Unique ID files ke liye
  const uniqueId = Date.now().toString();
  // Safe filename (spaces hata kar) taaki command line mein issue na aaye
  const inputPath = path.join(tempDir, `${uniqueId}_input.pdf`);
  const outputPath = path.join(tempDir, `${uniqueId}_output.docx`);

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    await fs.mkdir(tempDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    const tracker = await getAdobeUsage();
    let finalBuffer = null;
    let methodUsed = "Python (Backup)"; // Default method

    // ---------------------------------------------------------
    // 1. ADOBE PRIORITY CHECK (Best Quality)
    // ---------------------------------------------------------
    // Check karein ki keys exist karti hain aur empty string nahi hain
    const hasAdobeKeys = process.env.ADOBE_CLIENT_ID && process.env.ADOBE_CLIENT_ID.length > 10 &&
                         process.env.ADOBE_CLIENT_SECRET && process.env.ADOBE_CLIENT_SECRET.length > 10;

    if (tracker.count < 500 && hasAdobeKeys) {
      try {
        console.log("🚀 Attempting Adobe Premium Conversion...");
        
        const credentials = new ServicePrincipalCredentials({
          clientId: process.env.ADOBE_CLIENT_ID,
          clientSecret: process.env.ADOBE_CLIENT_SECRET
        });

        const pdfServices = new PDFServices({ credentials });
        const readStream = createReadStream(inputPath);
        const inputAsset = await pdfServices.upload({ readStream, mimeType: "application/pdf" });

        const params = new ExportPDFParams({ targetFormat: ExportPDFTargetFormat.DOCX });
        const job = new ExportPDFJob({ inputAsset, params });
        const pollingResponse = await pdfServices.submit({ job });
        const resultAsset = await pdfServices.getJobResult({ pollingResponse, assetClass: ExportPDFJob.ResultAsset });
        const streamAsset = await pdfServices.getContent({ asset: resultAsset });
        
        const chunks = [];
        for await (const chunk of streamAsset.readStream) { chunks.push(chunk); }
        finalBuffer = Buffer.concat(chunks);
        
        methodUsed = "Adobe Premium API";
        await incrementUsage();
      } catch (err) {
        // Agar Adobe fail hua (Polling error ya limit), toh yahan catch hoga
        console.warn("⚠️ Adobe Failed (Switching to Python)...", err.message);
        // Code rukega nahi, niche Python wale IF condition mein chala jayega
      }
    }

    // ---------------------------------------------------------
    // 2. PYTHON BACKUP (Free & Reliable) - Ye Aapka Working Code Hai
    // ---------------------------------------------------------
    if (!finalBuffer) {
      console.log("🐍 Running Python (pdf2docx) conversion...");
      
      const scriptPath = path.join(scriptsDir, "pdf2word.py");
      
      // Mac/Linux ke liye 'python3' command use kar rahe hain
      // Quotes ("") zaroori hain taaki agar path mein space ho toh error na aaye
      const cmd = `python3 "${scriptPath}" "${inputPath}" "${outputPath}"`;
      console.log(`Executing: ${cmd}`);

      try {
        const { stdout, stderr } = await execPromise(cmd);
        console.log("Python Output:", stdout);
        
        if (existsSync(outputPath)) {
          finalBuffer = await fs.readFile(outputPath);
          // Cleanup output file turant
          await fs.unlink(outputPath).catch(() => {});
        } else {
          throw new Error("Python script ran but output file not found.");
        }
      } catch (pyErr) {
        console.error("❌ Python Conversion Failed:", pyErr.message);
        throw new Error("Conversion failed on both Adobe and Python backup.");
      }
    }

    // ---------------------------------------------------------
    // Cleanup & Response
    // ---------------------------------------------------------
    
    // User ko original file name wapas dena (.docx extension ke sath)
    const originalName = file.name.replace(/\.[^/.]+$/, "") + ".docx";

    // Input file cleanup
    await fs.unlink(inputPath).catch(() => {});

    console.log(`✅ Success: Converted via ${methodUsed}`);

    return new NextResponse(finalBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${originalName}"`,
      },
    });

  } catch (error) {
    // Agar koi fatal error aaya toh safai karo
    if (inputPath && existsSync(inputPath)) await fs.unlink(inputPath).catch(() => {});
    console.error("❌ Fatal Error:", error.message);
    return NextResponse.json({ error: error.message || "Conversion failed" }, { status: 500 });
  }
}